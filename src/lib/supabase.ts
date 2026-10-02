/* ===================================================================
   APILIGU LEARNING PASS — Supabase Client
   =================================================================== */

import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const rawKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  '';

const supabaseUrl = rawUrl.includes('placeholder') ? '' : rawUrl;
const supabaseAnonKey = rawKey.includes('placeholder') ? '' : rawKey;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
