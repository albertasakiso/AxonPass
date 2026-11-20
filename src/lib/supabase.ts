/* ===================================================================
   APILIGU LEARNING PASS — Supabase Client
   =================================================================== */

import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://vnhrftvlmdojqtrcpmqx.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_TGz-h-0iabH2WbU_TUyDGw_ZD8Y-hAM';
const DEPRECATED_PROJECT_REF = 'ntegjiuktzmdbjxocqhz';

// Purge any stale auth/session keys from the deleted Supabase project ref
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const staleKeys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.includes(DEPRECATED_PROJECT_REF)) {
        staleKeys.push(key);
      }
    }
    for (const key of staleKeys) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Ignore storage access errors in restricted browsing modes
  }
}

// Read Supabase credentials from Vite environment variables, falling back to
// the active project when unset, placeholder, or pointing at the deleted ref.
const rawUrl = ((import.meta.env.VITE_SUPABASE_URL as string) || '').trim();
const rawKey = (
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  ''
).trim();

const useDefaultFallback =
  !rawUrl ||
  rawUrl.includes('placeholder') ||
  rawUrl.includes(DEPRECATED_PROJECT_REF);

export const supabaseUrl = useDefaultFallback ? DEFAULT_SUPABASE_URL : rawUrl;

export const supabaseAnonKey =
  useDefaultFallback || !rawKey || rawKey.includes('placeholder')
    ? DEFAULT_SUPABASE_PUBLISHABLE_KEY
    : rawKey;

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

