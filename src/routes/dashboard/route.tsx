import { useState } from 'react'
import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { AppShell } from '../../components/dashboard/AppShell'
import { getUser, signOut } from '../../lib/auth/session'
import { createBrowserSupabaseClient } from '../../lib/supabase/client'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const user = await getUser()
    if (!user) throw redirect({ to: '/auth/login' })
    return { user }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const { user } = Route.useRouteContext()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await createBrowserSupabaseClient().auth.signOut({ scope: 'local' })
    } catch {
      // A failed revoke must not stop the cookie from being cleared below.
    }
    try {
      await signOut()
      await navigate({ to: '/auth/login' })
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <AppShell>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 min-w-0 break-words text-sm text-[var(--sea-ink-soft)]">
          Signed in as{' '}
          <strong className="text-[var(--sea-ink)]">
            {user.email ?? user.id}
          </strong>
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="inline-flex h-11 items-center rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] px-4 text-sm font-semibold text-[var(--sea-ink)] disabled:opacity-60"
        >
          {signingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
      <Outlet />
    </AppShell>
  )
}
