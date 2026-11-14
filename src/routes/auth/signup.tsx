import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { establishSession } from '../../lib/auth/session'
import { createBrowserSupabaseClient } from '../../lib/supabase/client'

export const Route = createFileRoute('/auth/signup')({
  component: SignupPage,
})

function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setNotice(null)
    setPending(true)
    try {
      const supabase = createBrowserSupabaseClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })
      if (signUpError) {
        setError(signUpError.message)
        return
      }
      if (!data.session) {
        setNotice(
          'Account created. Check your email to confirm it, then log in.',
        )
        return
      }
      await establishSession({ data: { accessToken: data.session.access_token } })
      await navigate({ to: '/dashboard' })
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell mx-auto max-w-md rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Sponsor sign up</p>
        <h1 className="display-title mb-4 text-3xl font-bold text-[var(--sea-ink)]">
          Create an account
        </h1>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1 text-sm font-semibold text-[var(--sea-ink)]">
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-base font-normal text-[var(--sea-ink)]"
            />
          </label>
          <label className="grid gap-1 text-sm font-semibold text-[var(--sea-ink)]">
            Password
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-base font-normal text-[var(--sea-ink)]"
            />
          </label>
          {error ? (
            <p
              role="alert"
              className="m-0 rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] px-3 py-2 text-sm font-semibold text-[var(--sea-ink)]"
            >
              {error}
            </p>
          ) : null}
          {notice ? (
            <p
              role="status"
              className="m-0 rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] px-3 py-2 text-sm font-semibold text-[var(--sea-ink)]"
            >
              {notice}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="h-11 rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 text-sm font-semibold text-[var(--lagoon-deep)] disabled:opacity-60"
          >
            {pending ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="m-0 mt-4 text-sm text-[var(--sea-ink-soft)]">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-semibold">
            Log in
          </Link>
        </p>
      </section>
    </main>
  )
}
