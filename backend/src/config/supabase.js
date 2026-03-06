import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

if (!config.supabaseUrl || !config.supabaseServiceKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in environment variables.');
}

// Service-role client — bypasses RLS for all server-side operations.
// Never expose this key to the frontend.
export const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey, {
  auth: {
    persistSession: false,   // no session storage on the server
    autoRefreshToken: false, // server doesn't need token refresh
  },
});
