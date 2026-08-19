import { authClient } from '@packages/auth/auth-client'
import { Link } from '@tanstack/react-router'
import { useState, useTransition } from 'react'
import type { User } from '@packages/db'

type Props = {
  users: User[]
}

export function TopPage({ users }: Props) {
  const session = authClient.useSession()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function onSignOut() {
    setErrorMessage(null)

    startTransition(() => {
      void signOut()
    })
  }

  async function signOut() {
    const result = await authClient.signOut()

    if (result.error) {
      setErrorMessage(result.error.message ?? 'Failed to sign out.')
      return
    }

    await session.refetch()
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-emerald-500">
          Hello, TanStack Start!
        </h1>
        <p className="text-sm text-slate-600">
          Better Auth is connected. Use the login screen to create an account
          and confirm the session state.
        </p>
      </div>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/login"
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Open login screen
          </Link>

          {session.data ? (
            <button
              type="button"
              onClick={onSignOut}
              disabled={isPending}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? 'Signing out...' : 'Sign out'}
            </button>
          ) : null}
        </div>

        {session.isPending ? (
          <p className="text-sm text-slate-500">Loading current session...</p>
        ) : session.data ? (
          <div className="space-y-1 text-sm text-slate-700">
            <p>
              Signed in as{' '}
              <span className="font-medium">{session.data.user.email}</span>
            </p>
            <p>Name: {session.data.user.name}</p>
            <p className="font-mono text-xs">User ID: {session.data.user.id}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            No active session. Open the login screen to authenticate.
          </p>
        )}

        {errorMessage ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {errorMessage}
          </div>
        ) : null}
      </section>

      <section className="space-y-3">
        <ul className="space-y-2">
          {users.map((row) => (
            <li
              key={row.id}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              {row.name}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
