import { authClient } from '@packages/auth/auth-client'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState, useTransition } from 'react'

type AuthMode = 'sign-in' | 'sign-up'

type Feedback = {
  tone: 'error' | 'success'
  message: string
}

type FormState = {
  name: string
  email: string
  password: string
  rememberMe: boolean
}

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  password: '',
  rememberMe: true,
}

export function LoginPage() {
  const navigate = useNavigate()
  const session = authClient.useSession()
  const activeSession = session.data
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isSubmitting, startSubmittingTransition] = useTransition()
  const [isSigningOut, startSignOutTransition] = useTransition()

  const isBusy = isSubmitting || isSigningOut || session.isPending
  const hasSession = Boolean(activeSession)

  function updateField<Key extends keyof FormState>(
    key: Key,
    value: FormState[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback(null)

    startSubmittingTransition(() => {
      void submit()
    })
  }

  async function submit() {
    try {
      if (mode === 'sign-in') {
        const result = await authClient.signIn.email({
          email: form.email,
          password: form.password,
          rememberMe: form.rememberMe,
        })

        if (result.error) {
          throw result.error
        }

        setFeedback({
          tone: 'success',
          message: `Welcome back, ${result.data.user.name}. Redirecting now.`,
        })
      } else {
        const result = await authClient.signUp.email({
          name: form.name.trim() || inferNameFromEmail(form.email),
          email: form.email,
          password: form.password,
        })

        if (result.error) {
          throw result.error
        }

        setFeedback({
          tone: 'success',
          message: `Account created for ${result.data.user.email}. Redirecting now.`,
        })
      }

      await session.refetch()
      await navigate({ to: '/' })
    } catch (error) {
      setFeedback({
        tone: 'error',
        message: getErrorMessage(error),
      })
    }
  }

  function onSignOut() {
    setFeedback(null)

    startSignOutTransition(() => {
      void signOut()
    })
  }

  async function signOut() {
    try {
      const result = await authClient.signOut()

      if (result.error) {
        throw result.error
      }

      await session.refetch()
      setFeedback({
        tone: 'success',
        message: 'Session cleared. You can sign in again with another account.',
      })
    } catch (error) {
      setFeedback({
        tone: 'error',
        message: getErrorMessage(error),
      })
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10">
      <div className="grid w-full gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:p-12">
          <div className="flex h-full flex-col justify-between gap-12">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-500">
                Better Auth
              </div>

              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">
                  Access Ledger
                </p>
                <h1 className="text-5xl font-semibold leading-none text-slate-900 md:text-6xl">
                  Sign in without turning the app into a side quest.
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-600 md:text-lg">
                  The auth stack is wired to Better Auth, Turso, and TanStack
                  Start. This screen exists to validate the flow end to end, not
                  to hide it behind a placeholder.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <ValueCard
                label="Email + Password"
                value="Active"
                detail="Credential login is enabled on the server."
              />
              <ValueCard
                label="Cookie Handling"
                value="TanStack"
                detail="Session cookies are bridged through the Better Auth plugin."
              />
              <ValueCard
                label="Database"
                value="Turso"
                detail="User, session, account, and verification tables are migrated."
              />
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                  Session Desk
                </p>
                <h2 className="text-3xl font-semibold text-slate-900">
                  {hasSession ? 'You are already in.' : 'Open a session.'}
                </h2>
              </div>
              <Link
                to="/"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:border-slate-400 hover:text-slate-900"
              >
                Back home
              </Link>
            </div>

            {feedback ? (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  feedback.tone === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-rose-200 bg-rose-50 text-rose-900'
                }`}
              >
                {feedback.message}
              </div>
            ) : null}

            {hasSession ? (
              <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <div className="space-y-1">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                    Active session
                  </p>
                  <h3 className="text-2xl font-semibold text-slate-900">
                    {activeSession?.user.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {activeSession?.user.email}
                  </p>
                </div>

                <dl className="grid gap-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <dt>User ID</dt>
                    <dd className="font-mono text-xs text-slate-900">
                      {activeSession?.user.id}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={onSignOut}
                  disabled={isBusy}
                  className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 rounded-full border border-slate-200 bg-slate-50 p-1">
                  <ModeButton
                    label="Sign in"
                    active={mode === 'sign-in'}
                    onClick={() => setMode('sign-in')}
                  />
                  <ModeButton
                    label="Create account"
                    active={mode === 'sign-up'}
                    onClick={() => setMode('sign-up')}
                  />
                </div>

                <form className="space-y-4" onSubmit={onSubmit}>
                  {mode === 'sign-up' ? (
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-slate-900">
                        Display name
                      </span>
                      <input
                        required
                        value={form.name}
                        onChange={(event) =>
                          updateField('name', event.currentTarget.value)
                        }
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
                        placeholder="A name for the session ledger"
                      />
                    </label>
                  ) : null}

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-900">
                      Email
                    </span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField('email', event.currentTarget.value)
                      }
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
                      placeholder="pilot@example.com"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-900">
                      Password
                    </span>
                    <input
                      required
                      type="password"
                      minLength={8}
                      value={form.password}
                      onChange={(event) =>
                        updateField('password', event.currentTarget.value)
                      }
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
                      placeholder="At least 8 characters"
                    />
                  </label>

                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={form.rememberMe}
                      onChange={(event) =>
                        updateField('rememberMe', event.currentTarget.checked)
                      }
                      className="h-4 w-4 accent-emerald-600"
                    />
                    Keep the session alive on this browser
                  </label>

                  <button
                    type="submit"
                    disabled={isBusy}
                    className="w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting
                      ? 'Working...'
                      : mode === 'sign-in'
                        ? 'Sign in'
                        : 'Create account'}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

function ModeButton(props: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium ${
        props.active
          ? 'bg-slate-900 text-white'
          : 'text-slate-500 hover:text-slate-900'
      }`}
    >
      {props.label}
    </button>
  )
}

function ValueCard(props: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
        {props.label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-slate-900">
        {props.value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{props.detail}</p>
    </div>
  )
}

function inferNameFromEmail(email: string) {
  return email.split('@')[0] || 'New User'
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = error.message

    if (typeof message === 'string' && message.length > 0) {
      return message
    }
  }

  return 'Authentication failed. Check the credentials and try again.'
}
