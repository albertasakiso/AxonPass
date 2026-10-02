/* ===================================================================
   APILIGU LEARNING PASS — Sync Store (Zustand)
   Tracks offline sync queue status
   =================================================================== */

import { create } from 'zustand';
import type { SyncStatus } from '../types';

interface SyncState {
  status: SyncStatus;
  pendingCount: number;
  lastSyncAt: string | null;
  isOnline: boolean;
  isSyncing: boolean;
  error: string | null;

  setOnline: (online: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setPendingCount: (count: number) => void;
  setLastSync: (timestamp: string) => void;
  setError: (error: string | null) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  status: 'synced',
  pendingCount: 0,
  lastSyncAt: null,
  isOnline: navigator.onLine,
  isSyncing: false,
  error: null,

  setOnline: (online) =>
    set((state) => ({
      isOnline: online,
      status: !online ? 'pending' : state.pendingCount > 0 ? 'pending' : 'synced',
    })),

  setSyncing: (syncing) => set({ isSyncing: syncing }),

  setPendingCount: (count) =>
    set((state) => ({
      pendingCount: count,
      status: count > 0 ? 'pending' : state.isOnline ? 'synced' : 'pending',
    })),

  setLastSync: (timestamp) => set({ lastSyncAt: timestamp }),

  setError: (error) =>
    set({ error, status: error ? 'error' : 'synced' }),
}));

// Listen for online/offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useSyncStore.getState().setOnline(true);
  });
  window.addEventListener('offline', () => {
    useSyncStore.getState().setOnline(false);
  });
}
