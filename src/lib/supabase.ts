/* ===================================================================
   APILIGU LEARNING PASS — Supabase Client
   =================================================================== */

import { createClient } from '@supabase/supabase-js';

// Read Supabase credentials from Vite environment variables.
// When unset, isSupabaseConfigured is false and the app runs cleanly in offline_local mode.
const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const rawKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  '';

export const supabaseUrl =
  rawUrl && !rawUrl.includes('placeholder') ? rawUrl : '';

export const supabaseAnonKey =
  rawKey && !rawKey.includes('placeholder') ? rawKey : '';

// Ensure createClient is never called with an invalid/empty URL which causes
// an unhandled top-level exception and blank page on deployment.
const safeUrl =
  supabaseUrl && supabaseUrl.startsWith('http')
    ? supabaseUrl
    : 'https://placeholder.supabase.co';

const safeKey = supabaseAnonKey || 'dummy-anon-key';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  !supabaseUrl.includes('placeholder') &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('placeholder')
);

export const supabase = createClient(
  safeUrl,
  safeKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

