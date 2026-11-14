import { createServerOnlyFn } from '@tanstack/react-start'
import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

/**
 * SERVER ONLY. Import this from server functions, loaders' server code and
 * other server utilities, never from React components or browser code.
 * `createServerOnlyFn` makes the call throw if it ever runs in the browser.
 *
 * Returns a client that acts as the signed-in user: it sends the user's access
 * token, so Row Level Security applies to every query. It does not read
 * `SUPABASE_SERVICE_ROLE_KEY` and no sponsor operation should (see
 * docs/data-model/property-listings-schema.md, section 5).
 *
 * Reads `SUPABASE_URL` (server-only) and `VITE_SUPABASE_ANON_KEY` (public)
 * from `.env.example`. It creates a fresh client per call and persists no
 * session, so one request's user can never leak into another.
 */
export const createServerSupabaseClient = createServerOnlyFn(
  (accessToken: string): SupabaseClient<Database> => {
    const url = process.env.SUPABASE_URL
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

    if (!url || !anonKey) {
      throw new Error(
        'Missing SUPABASE_URL or VITE_SUPABASE_ANON_KEY. See docs/setup/supabase-env-checklist.md',
      )
    }
    if (!accessToken) {
      throw new Error(
        "createServerSupabaseClient needs the signed-in user's access token. Without one, requests run as the logged-out role and RLS returns nothing.",
      )
    }

    return createClient<Database>(url, anonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  },
)
