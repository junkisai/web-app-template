import { useState, useTransition } from 'react'

import * as stylex from '@stylexjs/stylex'
import { Link, useNavigate } from '@tanstack/react-router'

import { colors, fonts } from '@/styles/tokens.stylex'
import { authClient } from '@packages/auth/auth-client'

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
    <main {...stylex.props(styles.main)}>
      <div {...stylex.props(styles.layout)}>
        <section {...stylex.props(styles.heroSection)}>
          <div {...stylex.props(styles.heroInner)}>
            <div {...stylex.props(styles.heroTop)}>
              <div {...stylex.props(styles.badge)}>Better Auth</div>

              <div {...stylex.props(styles.heroCopy)}>
                <p {...stylex.props(styles.eyebrow)}>Access Ledger</p>
                <h1 {...stylex.props(styles.heroTitle)}>
                  Sign in without turning the app into a side quest.
                </h1>
                <p {...stylex.props(styles.heroLead)}>
                  The auth stack is wired to Better Auth, Turso, and TanStack
                  Start. This screen exists to validate the flow end to end, not
                  to hide it behind a placeholder.
                </p>
              </div>
            </div>

            <div {...stylex.props(styles.valueGrid)}>
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

        <section {...stylex.props(styles.formSection)}>
          <div {...stylex.props(styles.formInner)}>
            <div {...stylex.props(styles.formHeader)}>
              <div>
                <p {...stylex.props(styles.sessionLabel)}>Session Desk</p>
                <h2 {...stylex.props(styles.formTitle)}>
                  {hasSession ? 'You are already in.' : 'Open a session.'}
                </h2>
              </div>
              <Link to="/" {...stylex.props(styles.homeLink)}>
                Back home
              </Link>
            </div>

            {feedback ? (
              <div
                {...stylex.props(
                  styles.feedback,
                  feedback.tone === 'success'
                    ? styles.feedbackSuccess
                    : styles.feedbackError,
                )}
              >
                {feedback.message}
              </div>
            ) : null}

            {hasSession ? (
              <div {...stylex.props(styles.sessionCard)}>
                <div {...stylex.props(styles.sessionCardHead)}>
                  <p {...stylex.props(styles.sessionCardLabel)}>
                    Active session
                  </p>
                  <h3 {...stylex.props(styles.sessionUserName)}>
                    {activeSession?.user.name}
                  </h3>
                  <p {...stylex.props(styles.sessionUserEmail)}>
                    {activeSession?.user.email}
                  </p>
                </div>

                <dl {...stylex.props(styles.detailList)}>
                  <div {...stylex.props(styles.detailRow)}>
                    <dt>User ID</dt>
                    <dd {...stylex.props(styles.detailValue)}>
                      {activeSession?.user.id}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={onSignOut}
                  disabled={isBusy}
                  {...stylex.props(styles.signOutButton)}
                >
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            ) : (
              <>
                <div {...stylex.props(styles.modeSwitch)}>
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

                <form {...stylex.props(styles.form)} onSubmit={onSubmit}>
                  {mode === 'sign-up' ? (
                    <label {...stylex.props(styles.field)}>
                      <span {...stylex.props(styles.fieldLabel)}>
                        Display name
                      </span>
                      <input
                        required
                        value={form.name}
                        onChange={(event) =>
                          updateField('name', event.currentTarget.value)
                        }
                        placeholder="A name for the session ledger"
                        {...stylex.props(styles.input)}
                      />
                    </label>
                  ) : null}

                  <label {...stylex.props(styles.field)}>
                    <span {...stylex.props(styles.fieldLabel)}>Email</span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField('email', event.currentTarget.value)
                      }
                      placeholder="pilot@example.com"
                      {...stylex.props(styles.input)}
                    />
                  </label>

                  <label {...stylex.props(styles.field)}>
                    <span {...stylex.props(styles.fieldLabel)}>Password</span>
                    <input
                      required
                      type="password"
                      minLength={8}
                      value={form.password}
                      onChange={(event) =>
                        updateField('password', event.currentTarget.value)
                      }
                      placeholder="At least 8 characters"
                      {...stylex.props(styles.input)}
                    />
                  </label>

                  <label {...stylex.props(styles.rememberMe)}>
                    <input
                      type="checkbox"
                      checked={form.rememberMe}
                      onChange={(event) =>
                        updateField('rememberMe', event.currentTarget.checked)
                      }
                      {...stylex.props(styles.checkbox)}
                    />
                    Keep the session alive on this browser
                  </label>

                  <button
                    type="submit"
                    disabled={isBusy}
                    {...stylex.props(styles.submitButton)}
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
      {...stylex.props(
        styles.modeButton,
        props.active ? styles.modeButtonActive : styles.modeButtonInactive,
      )}
    >
      {props.label}
    </button>
  )
}

function ValueCard(props: { label: string; value: string; detail: string }) {
  return (
    <div {...stylex.props(styles.valueCard)}>
      <p {...stylex.props(styles.valueCardLabel)}>{props.label}</p>
      <p {...stylex.props(styles.valueCardValue)}>{props.value}</p>
      <p {...stylex.props(styles.valueCardDetail)}>{props.detail}</p>
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

const CARD_SHADOW =
  '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'

const styles = stylex.create({
  main: {
    display: 'flex',
    alignItems: 'center',
    marginInline: 'auto',
    minHeight: '100vh',
    width: '100%',
    maxWidth: '72rem',
    paddingInline: '1.5rem',
    paddingBlock: '2.5rem',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: {
      default: null,
      '@media (min-width: 64rem)': '1.15fr 0.85fr',
    },
    gap: '1.5rem',
    width: '100%',
  },
  heroSection: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: '2rem',
    backgroundColor: colors.surface,
    padding: {
      default: '2rem',
      '@media (min-width: 64rem)': '3rem',
    },
    boxShadow: CARD_SHADOW,
  },
  heroInner: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '3rem',
    height: '100%',
  },
  heroTop: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  badge: {
    display: 'inline-flex',
    alignSelf: 'flex-start',
    alignItems: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: '9999px',
    backgroundColor: colors.surfaceMuted,
    paddingInline: '0.75rem',
    paddingBlock: '0.25rem',
    fontSize: '0.75rem',
    lineHeight: '1rem',
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: colors.textSubtle,
  },
  heroCopy: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  eyebrow: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: colors.accent,
  },
  heroTitle: {
    fontSize: {
      default: '3rem',
      '@media (min-width: 48rem)': '3.75rem',
    },
    lineHeight: 1,
    fontWeight: 600,
    color: colors.text,
  },
  heroLead: {
    maxWidth: '36rem',
    fontSize: {
      default: '1rem',
      '@media (min-width: 48rem)': '1.125rem',
    },
    lineHeight: '1.75rem',
    color: colors.textMuted,
  },
  valueGrid: {
    display: 'grid',
    gridTemplateColumns: {
      default: null,
      '@media (min-width: 48rem)': 'repeat(3, minmax(0, 1fr))',
    },
    gap: '1rem',
  },
  valueCard: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: '1.5rem',
    backgroundColor: colors.surfaceMuted,
    padding: '1rem',
  },
  valueCardLabel: {
    fontSize: '0.75rem',
    lineHeight: '1rem',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: colors.textSubtle,
  },
  valueCardValue: {
    marginTop: '0.75rem',
    fontSize: '1.875rem',
    lineHeight: '2.25rem',
    fontWeight: 600,
    color: colors.text,
  },
  valueCardDetail: {
    marginTop: '0.5rem',
    fontSize: '0.875rem',
    lineHeight: '1.5rem',
    color: colors.textMuted,
  },
  formSection: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: '2rem',
    backgroundColor: colors.surface,
    padding: {
      default: '1.5rem',
      '@media (min-width: 48rem)': '2rem',
    },
    boxShadow: CARD_SHADOW,
  },
  formInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  sessionLabel: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: colors.textSubtle,
  },
  formTitle: {
    fontSize: '1.875rem',
    lineHeight: '2.25rem',
    fontWeight: 600,
    color: colors.text,
  },
  homeLink: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: colors.borderStrong,
      ':hover': colors.borderHover,
    },
    borderRadius: '9999px',
    paddingInline: '1rem',
    paddingBlock: '0.5rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    color: {
      default: colors.textMuted,
      ':hover': colors.text,
    },
  },
  feedback: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '1rem',
    paddingInline: '1rem',
    paddingBlock: '0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
  feedbackSuccess: {
    borderColor: colors.successBorder,
    backgroundColor: colors.successSurface,
    color: colors.successText,
  },
  feedbackError: {
    borderColor: colors.dangerBorder,
    backgroundColor: colors.dangerSurface,
    color: colors.dangerText,
  },
  sessionCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: '1.5rem',
    backgroundColor: colors.surfaceMuted,
    padding: '1.25rem',
  },
  sessionCardHead: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  sessionCardLabel: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: colors.textSubtle,
  },
  sessionUserName: {
    fontSize: '1.5rem',
    lineHeight: '2rem',
    fontWeight: 600,
    color: colors.text,
  },
  sessionUserEmail: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    color: colors.textMuted,
  },
  detailList: {
    display: 'grid',
    gap: '0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    color: colors.textMuted,
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: '1rem',
    backgroundColor: colors.surface,
    paddingInline: '1rem',
    paddingBlock: '0.75rem',
  },
  detailValue: {
    fontFamily: fonts.mono,
    fontSize: '0.75rem',
    lineHeight: '1rem',
    color: colors.text,
  },
  signOutButton: {
    width: '100%',
    borderRadius: '9999px',
    backgroundColor: {
      default: colors.surfaceInverse,
      ':hover': colors.surfaceInverseHover,
    },
    paddingInline: '1.25rem',
    paddingBlock: '0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
    color: colors.textInverse,
    cursor: { default: null, ':disabled': 'not-allowed' },
    opacity: { default: null, ':disabled': 0.6 },
  },
  modeSwitch: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: '9999px',
    backgroundColor: colors.surfaceMuted,
    padding: '0.25rem',
  },
  modeButton: {
    borderRadius: '9999px',
    paddingInline: '1rem',
    paddingBlock: '0.5rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
  },
  modeButtonActive: {
    backgroundColor: colors.surfaceInverse,
    color: colors.textInverse,
  },
  modeButtonInactive: {
    color: {
      default: colors.textSubtle,
      ':hover': colors.text,
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  // ここだけ flex + gap にしないのは、ラベルの span が inline のまま
  // 1 行分の行送りに収まる形（移行前と同じ高さ）を保つため
  field: {
    display: 'block',
  },
  fieldLabel: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
    color: colors.text,
  },
  input: {
    width: '100%',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: colors.borderStrong,
      ':focus': colors.accentText,
    },
    borderRadius: '1rem',
    backgroundColor: colors.surface,
    paddingInline: '1rem',
    paddingBlock: '0.75rem',
    outlineStyle: 'none',
  },
  rememberMe: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: '1rem',
    backgroundColor: colors.surfaceMuted,
    paddingInline: '1rem',
    paddingBlock: '0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    color: colors.textMuted,
  },
  checkbox: {
    height: '1rem',
    width: '1rem',
    accentColor: colors.accent,
  },
  submitButton: {
    width: '100%',
    borderRadius: '9999px',
    backgroundColor: {
      default: colors.accent,
      ':hover': colors.accentHover,
    },
    paddingInline: '1.25rem',
    paddingBlock: '0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 600,
    color: colors.textInverse,
    cursor: { default: null, ':disabled': 'not-allowed' },
    opacity: { default: null, ':disabled': 0.6 },
  },
})
