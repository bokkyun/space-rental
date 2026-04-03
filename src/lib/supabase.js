import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// createClient가 URL이 없으면 throw하므로 try/catch로 감쌈
export const supabase = (() => {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('Supabase env vars missing');
      return null;
    }
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.error('Supabase init error:', e);
    return null;
  }
})();
