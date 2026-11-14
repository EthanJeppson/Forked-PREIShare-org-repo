import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

let browserClient: SupabaseClient<Database> | undefined

/**
 * Browser-safe Supabase client. Reads only the two public variables from
 * `.env.example` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Row Level
 * Security is what protects the data; this key is not a secret.
 *
 * Never read a server-only secret here (see docs/setup/supabase-env-checklist.md),
 * and never import `./server` from this file or from anything the browser loads.
 *
 * In the browser the one client is reused, because several clients on the same
 * storage key conflict. On the server a new client is made per call, so nothing
 * is shared between requests.
 */
export function createBrowserSupabaseClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient

  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

  if (!url || !anonKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. See docs/setup/supabase-env-checklist.md',
    )
  }

  const client = createClient<Database>(url, anonKey)
  if (typeof window !== 'undefined') browserClient = client
  return client
}
