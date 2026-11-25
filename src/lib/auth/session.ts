import { createServerFn, createServerOnlyFn } from '@tanstack/react-start'
import {
  deleteCookie,
  getCookie,
  setCookie,
} from '@tanstack/react-start/server'
import { createServerSupabaseClient } from '../supabase.server'

const ACCESS_TOKEN_COOKIE = 'sb-access-token'
// Supabase access tokens last one hour by default. The token is checked with
// Supabase on every read, so this only bounds how long the browser keeps it.
const ACCESS_TOKEN_COOKIE_MAX_AGE_SECONDS = 60 * 60

export type SessionUser = {
  id: string
  email: string | null
}

export type ServerSession = {
  accessToken: string
  user: SessionUser
}

type TokenCheck =
  | { status: 'valid'; user: SessionUser }
  | { status: 'rejected' }
  | { status: 'unavailable' }

async function checkAccessToken(accessToken: string): Promise<TokenCheck> {
  const { data, error } = await createServerSupabaseClient(
    accessToken,
  ).auth.getUser(accessToken)

  if (data.user && !error) {
    return {
      status: 'valid',
      user: { id: data.user.id, email: data.user.email ?? null },
    }
  }
  const status = error?.status ?? 0
  return status >= 400 && status < 500
    ? { status: 'rejected' }
    : { status: 'unavailable' }
}

/**
 * Server-only. The signed-in user and their access token, or null. Use the
 * token with `createServerSupabaseClient` so Row Level Security applies.
 * Never returned to the browser; routes use `getUser` instead.
 */
export const getSession = createServerOnlyFn(
  async (): Promise<ServerSession | null> => {
    const accessToken = getCookie(ACCESS_TOKEN_COOKIE)
    if (!accessToken) return null

    const check = await checkAccessToken(accessToken)
    if (check.status === 'valid') return { accessToken, user: check.user }
    // Only drop the cookie when Supabase refused the token, not when it was unreachable.
    if (check.status === 'rejected') {
      deleteCookie(ACCESS_TOKEN_COOKIE, { path: '/' })
    }
    return null
  },
)

/** For route guards. Runs on the server and returns only the user's id and email. */
export const getUser = createServerFn({ method: 'POST' }).handler(
  async (): Promise<SessionUser | null> => {
    const session = await getSession()
    return session?.user ?? null
  },
)

/**
 * Called by the login and sign-up pages after the browser client has signed
 * in. Confirms the token with Supabase, then keeps it in an httpOnly cookie so
 * the server can read it on page loads.
 */
export const establishSession = createServerFn({ method: 'POST' })
  .validator((input: unknown) => {
    const accessToken =
      typeof input === 'object' && input !== null && 'accessToken' in input
        ? input.accessToken
        : undefined
    if (typeof accessToken !== 'string' || accessToken.length === 0) {
      throw new Error('An access token is required.')
    }
    return { accessToken }
  })
  .handler(async ({ data }): Promise<SessionUser> => {
    const check = await checkAccessToken(data.accessToken)
    if (check.status !== 'valid') {
      throw new Error('Could not verify your sign-in. Please try again.')
    }
    setCookie(ACCESS_TOKEN_COOKIE, data.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE_SECONDS,
    })
    return check.user
  })

/**
 * Clears the session cookie. The browser client revokes the Supabase session
 * (`auth.signOut({ scope: 'local' })`) before calling this, because the
 * server client has no session of its own to revoke.
 */
export const signOut = createServerFn({ method: 'POST' }).handler(
  async (): Promise<void> => {
    deleteCookie(ACCESS_TOKEN_COOKIE, { path: '/' })
  },
)
