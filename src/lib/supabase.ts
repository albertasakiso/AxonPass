/* ===================================================================
   APILIGU LEARNING PASS — Supabase Client
   =================================================================== */

import { createClient } from '@supabase/supabase-js';

// Default project public credentials as fallback if Vercel / hosting environment
// variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not set in the build settings.
// Note: Anon / publishable keys are safe for frontend exposure protected by RLS.
const DEFAULT_SUPABASE_URL = 'https://ntegjiuktzmdbjxocqhz.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_J5R3DbRjnL9JNmtFcp8mMA_6BJowKD7';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const rawKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  '';

export const supabaseUrl =
  rawUrl && !rawUrl.includes('placeholder')
    ? rawUrl
    : DEFAULT_SUPABASE_URL;

export const supabaseAnonKey =
  rawKey && !rawKey.includes('placeholder')
    ? rawKey
    : DEFAULT_SUPABASE_ANON_KEY;

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

