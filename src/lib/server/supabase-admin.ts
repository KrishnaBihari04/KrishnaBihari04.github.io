import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export const hasSupabaseAdminConfig = Boolean(supabaseUrl && serviceRoleKey);

export const supabaseAdmin = hasSupabaseAdminConfig
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;
