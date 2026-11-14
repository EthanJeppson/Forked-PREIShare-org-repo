import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

/**
 * Browser-safe Supabase client. Reads only the two public variables from
 * `.env.example` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Row Level
 * Security is what protects the data; this key is not a secret.
 *
 * Never read a server-only secret here (see docs/setup/supabase-env-checklist.md),
 * and never import `./server` from this file or from anything the browser loads.
 */
export function createBrowserSupabaseClient(): SupabaseClient<Database> {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

  if (!url || !anonKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. See docs/setup/supabase-env-checklist.md',
    )
  }

  return createClient<Database>(url, anonKey)
}
