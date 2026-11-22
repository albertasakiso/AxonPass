/* ===================================================================
   ANOXPASS — 100% Open-Source Supabase Realtime Sync Manager
   Handles:
     - postgres_changes subscriptions (instant cross-device sync)
     - presence tracking (active learner devices / study rooms)
     - broadcast events (live XP / mastery milestone celebrations)
     - Graceful offline / localStorage fallback when Supabase is
       unconfigured or the user is offline/unauthenticated.
   =================================================================== */

import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';

export type RealtimeConnectionStatus =
  | 'connected'
  | 'connecting'
  | 'offline_local'
  | 'error';

export type RealtimeTable =
  | 'certification_path_progress'
  | 'cert_course_progress'
  | 'academy_lesson_progress'
  | 'book_mastery_notes'
  | 'fsrs_cards'
  | 'user_gamification_stats'
  | 'ai_coach_sessions'
  | 'user_reading_progress';

export interface RealtimeChangeEvent {
  table: RealtimeTable;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  newRecord: Record<string, unknown> | null;
  oldRecord: Record<string, unknown> | null;
  timestamp: string;
}

export interface BroadcastMasteryEvent {
  type: 'xp_earned' | 'milestone_completed' | 'fsrs_reviewed' | 'streak_updated';
  userId: string;
  deviceId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface PresenceDevice {
  deviceId: string;
  userId: string;
  onlineAt: string;
  activeView?: string;
}

const LOCAL_DEVICE_KEY = 'anoxpass_device_id';

function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = window.localStorage.getItem(LOCAL_DEVICE_KEY);
  if (!id) {
    id = `dev_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
    window.localStorage.setItem(LOCAL_DEVICE_KEY, id);
  }
  return id;
}

export interface RealtimeCallbacks {
  onStatusChange?: (status: RealtimeConnectionStatus) => void;
  onPostgresChange?: (event: RealtimeChangeEvent) => void;
  onBroadcast?: (event: BroadcastMasteryEvent) => void;
  onPresenceSync?: (devices: PresenceDevice[]) => void;
}

class RealtimeSyncManager {
  private channel: RealtimeChannel | null = null;
  private status: RealtimeConnectionStatus = 'offline_local';
  private userId: string | null = null;
  private deviceId: string = getOrCreateDeviceId();
  private callbacks: RealtimeCallbacks = {};

  getStatus(): RealtimeConnectionStatus {
    return this.status;
  }

  getDeviceId(): string {
    return this.deviceId;
  }

  private setStatus(next: RealtimeConnectionStatus) {
    this.status = next;
    this.callbacks.onStatusChange?.(next);
  }

  /**
   * Connect to Supabase Realtime for the given authenticated user.
   * Falls back cleanly to 'offline_local' if Supabase env vars are missing,
   * user is not signed in, or browser is offline.
   */
  async connect(userId: string | null, callbacks: RealtimeCallbacks = {}): Promise<void> {
    this.callbacks = callbacks;

    if (!isSupabaseConfigured || !userId || (typeof navigator !== 'undefined' && !navigator.onLine)) {
      this.disconnect();
      this.setStatus('offline_local');
      return;
    }

    if (this.channel && this.userId === userId && this.status === 'connected') {
      return;
    }

    this.disconnect();
    this.userId = userId;
    this.setStatus('connecting');

    const channelName = `anoxpass-user-${userId}`;
    const channel = supabase.channel(channelName, {
      config: {
        presence: { key: this.deviceId },
        broadcast: { self: false },
      },
    });

    const tables: RealtimeTable[] = [
      'certification_path_progress',
      'cert_course_progress',
      'academy_lesson_progress',
      'book_mastery_notes',
      'fsrs_cards',
      'user_gamification_stats',
      'ai_coach_sessions',
      'user_reading_progress',
    ];

    for (const table of tables) {
      channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          this.callbacks.onPostgresChange?.({
            table,
            eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
            newRecord: (payload.new as Record<string, unknown>) || null,
            oldRecord: (payload.old as Record<string, unknown>) || null,
            timestamp: new Date().toISOString(),
          });
        }
      );
    }

    channel.on('broadcast', { event: 'mastery_update' }, ({ payload }) => {
      if (payload) {
        this.callbacks.onBroadcast?.(payload as BroadcastMasteryEvent);
      }
    });

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState<PresenceDevice>();
      const devices: PresenceDevice[] = [];
      Object.values(state).forEach((entries) => {
        entries.forEach((entry) => {
          devices.push(entry);
        });
      });
      this.callbacks.onPresenceSync?.(devices);
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        this.setStatus('connected');
        try {
          await channel.track({
            deviceId: this.deviceId,
            userId,
            onlineAt: new Date().toISOString(),
          });
        } catch {
          // Presence track failure is non-fatal
        }
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        this.setStatus('error');
      } else if (status === 'CLOSED') {
        this.setStatus('offline_local');
      }
    });

    this.channel = channel;
  }

  /**
   * Broadcast a live mastery event to other connected devices for this user.
   * No-ops cleanly in offline_local mode.
   */
  async broadcastMasteryEvent(
    type: BroadcastMasteryEvent['type'],
    payload: Record<string, unknown>
  ): Promise<void> {
    if (!this.channel || this.status !== 'connected' || !this.userId) return;
    try {
      await this.channel.send({
        type: 'broadcast',
        event: 'mastery_update',
        payload: {
          type,
          userId: this.userId,
          deviceId: this.deviceId,
          payload,
          timestamp: new Date().toISOString(),
        } satisfies BroadcastMasteryEvent,
      });
    } catch {
      // Non-fatal in offline/degraded network conditions
    }
  }

  /**
   * Safely upsert a row into Supabase when online & authenticated.
   * Returns true if synced to cloud, false if operating in local-only fallback.
   */
  async upsertRow(
    table: RealtimeTable,
    row: Record<string, unknown>,
    onConflict?: string
  ): Promise<boolean> {
    if (!isSupabaseConfigured || !this.userId || (typeof navigator !== 'undefined' && !navigator.onLine)) {
      return false;
    }
    try {
      const { error } = await supabase
        .from(table)
        .upsert({ ...row, user_id: this.userId }, onConflict ? { onConflict } : undefined);
      if (error) {
        console.warn(`[RealtimeSync] upsert ${table} fallback to local:`, error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Safely delete a row from Supabase when online & authenticated.
   */
  async deleteRow(table: RealtimeTable, id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !this.userId || (typeof navigator !== 'undefined' && !navigator.onLine)) {
      return false;
    }
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .eq('user_id', this.userId);
      return !error;
    } catch {
      return false;
    }
  }

  disconnect(): void {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.userId = null;
  }
}

export const realtimeSync = new RealtimeSyncManager();
