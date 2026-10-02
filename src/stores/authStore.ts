/* ===================================================================
   APILIGU LEARNING PASS — Auth Store (Zustand)
   Robust authentication handling for Supabase Auth (Sign In, Sign Up,
   Password Reset, Magic Link, and Profile Hydration).
   =================================================================== */

import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useProgressStore } from './progressStore';
import type { UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  successMessage: string | null;
  activeCertificationSlug: string;

  // Actions
  initialize: () => Promise<void>;
  setActiveCertification: (slug: string) => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; requiresEmailConfirmation: boolean; message: string }>;
  signInWithMagicLink: (email: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
  clearSuccessMessage: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  successMessage: null,
  activeCertificationSlug: localStorage.getItem('alp_active_cert') || 'cisa',

  setActiveCertification: (slug: string) => {
    localStorage.setItem('alp_active_cert', slug);
    set({ activeCertificationSlug: slug });
    try {
      useProgressStore.getState().refreshProgress(slug);
    } catch (e) {
      console.warn('Could not auto-refresh progressStore on cert change:', e);
    }
  },

  initialize: async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.warn('Session retrieval notice:', sessionError.message);
      }

      if (session?.user) {
        // Fetch profile
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile) {
            set({
              user: profile as UserProfile,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            // Create fallback user profile
            const isSuperAdmin = session.user.email?.toLowerCase() === 'apullahalbert@gmail.com';
            const fallbackProfile: UserProfile = {
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              selected_certification_id: 'a0000000-0000-0000-0000-000000000001',
              daily_study_goal_minutes: 60,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              onboarding_state: 'pending',
              role: isSuperAdmin ? 'owner' : 'learner',
              status: 'active',
              created_at: new Date().toISOString(),
              last_active_at: new Date().toISOString(),
            };

            // Attempt to insert/upsert profile
            try {
              await supabase.from('profiles').upsert(fallbackProfile);
            } catch {
              // Ignore offline upsert error
            }

            set({
              user: fallbackProfile,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (profileErr) {
          console.warn('Profile fetch fallback:', profileErr);
          const isSuperAdmin = session.user.email?.toLowerCase() === 'apullahalbert@gmail.com';
          const minimalProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.email?.split('@')[0] || 'User',
            selected_certification_id: 'a0000000-0000-0000-0000-000000000001',
            daily_study_goal_minutes: 60,
            timezone: 'UTC',
            onboarding_state: 'pending',
            role: isSuperAdmin ? 'owner' : 'learner',
            status: 'active',
            created_at: new Date().toISOString(),
            last_active_at: new Date().toISOString(),
          };
          set({ user: minimalProfile, isAuthenticated: true, isLoading: false });
        }
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (err: any) {
      console.error('Auth initialization error:', err);
      set({ isLoading: false, user: null, isAuthenticated: false });
    }

    // Subscribe to auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          const isSuperAdmin = session.user.email?.toLowerCase() === 'apullahalbert@gmail.com';
          const activeProfile: UserProfile = (profile as UserProfile) || {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            selected_certification_id: 'a0000000-0000-0000-0000-000000000001',
            daily_study_goal_minutes: 60,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            onboarding_state: 'pending',
            role: isSuperAdmin ? 'owner' : 'learner',
            status: 'active',
            created_at: new Date().toISOString(),
            last_active_at: new Date().toISOString(),
          };

          set({
            user: activeProfile,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch {
          set({
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, isAuthenticated: false, isLoading: false });
      } else if (event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        set({ isLoading: false });
      }
    });
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        let friendlyMsg = error.message;
        if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
          friendlyMsg = 'Invalid email or password. Please verify and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          friendlyMsg = 'Your email is not confirmed yet. Please check your inbox for the confirmation email from Supabase.';
        }
        set({ error: friendlyMsg, isLoading: false });
        return false;
      }

      if (data.session && data.user) {
        // Hydrate profile immediately
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profile?.status === 'suspended') {
          await supabase.auth.signOut();
          set({
            error: 'This account has been suspended by an administrator. Please contact support.',
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
          return false;
        }

        const isSuperAdmin = normalizedEmail === 'apullahalbert@gmail.com';
        const userProfile: UserProfile = (profile as UserProfile) || {
          id: data.user.id,
          email: data.user.email || normalizedEmail,
          full_name: data.user.user_metadata?.full_name || normalizedEmail.split('@')[0],
          selected_certification_id: 'a0000000-0000-0000-0000-000000000001',
          daily_study_goal_minutes: 60,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          onboarding_state: 'pending',
          role: isSuperAdmin ? 'owner' : 'learner',
          status: 'active',
          created_at: new Date().toISOString(),
          last_active_at: new Date().toISOString(),
        };

        set({
          user: userProfile,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      }

      set({ isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Sign in failed', isLoading: false });
      return false;
    }
  },

  signUp: async (email: string, password: string, fullName?: string) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const name = fullName?.trim() || normalizedEmail.split('@')[0];
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        set({ error: error.message, isLoading: false });
        return { success: false, requiresEmailConfirmation: false, message: error.message };
      }

      // Check if session was returned immediately (auto-confirm) or confirmation email was sent
      if (data.session) {
        const isSuperAdmin = normalizedEmail === 'apullahalbert@gmail.com';
        const userProfile: UserProfile = {
          id: data.user!.id,
          email: data.user!.email || normalizedEmail,
          full_name: name,
          selected_certification_id: 'a0000000-0000-0000-0000-000000000001',
          daily_study_goal_minutes: 60,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          onboarding_state: 'pending',
          role: isSuperAdmin ? 'owner' : 'learner',
          status: 'active',
          created_at: new Date().toISOString(),
          last_active_at: new Date().toISOString(),
        };

        set({
          user: userProfile,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          successMessage: 'Account created successfully! Welcome to Learning Pass.',
        });

        return {
          success: true,
          requiresEmailConfirmation: false,
          message: 'Account created and signed in successfully.',
        };
      } else {
        // Confirmation email required
        set({
          isLoading: false,
          successMessage: `Confirmation email sent to ${normalizedEmail}. Please click the verification link in your email to sign in.`,
        });

        return {
          success: true,
          requiresEmailConfirmation: true,
          message: `Confirmation email sent to ${normalizedEmail}. Please check your inbox.`,
        };
      }
    } catch (err: any) {
      set({ error: err.message || 'Sign up failed', isLoading: false });
      return { success: false, requiresEmailConfirmation: false, message: err.message };
    }
  },

  signInWithMagicLink: async (email: string) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      set({
        isLoading: false,
        successMessage: `Magic sign-in link sent to ${normalizedEmail}. Check your inbox.`,
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Magic link request failed', isLoading: false });
      return false;
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;

      set({
        isLoading: false,
        successMessage: `Password reset instructions sent to ${normalizedEmail}.`,
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Password reset request failed', isLoading: false });
      return false;
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    const currentUser = get().user;
    if (!currentUser) return false;
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          last_active_at: new Date().toISOString(),
        })
        .eq('id', currentUser.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        set({ user: data as UserProfile, isLoading: false, successMessage: 'Profile updated successfully.' });
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (err: any) {
      set({ error: err.message || 'Profile update failed', isLoading: false });
      return false;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    set({ user: null, isAuthenticated: false, isLoading: false, error: null, successMessage: null });
  },

  clearError: () => set({ error: null }),
  clearSuccessMessage: () => set({ successMessage: null }),
}));
