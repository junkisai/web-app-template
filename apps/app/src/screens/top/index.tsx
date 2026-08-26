import { useState, useTransition } from 'react'

import * as stylex from '@stylexjs/stylex'
import { Link } from '@tanstack/react-router'

import { colors, fonts } from '@/styles/tokens.stylex'
import { authClient } from '@packages/auth/auth-client'

import type { User } from '@/features/users/types/user'

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
    <main {...stylex.props(styles.main)}>
      <div {...stylex.props(styles.intro)}>
        <h1 {...stylex.props(styles.title)}>Hello, TanStack Start!</h1>
        <p {...stylex.props(styles.lead)}>
          Better Auth is connected. Use the login screen to create an account
          and confirm the session state.
        </p>
      </div>

      <section {...stylex.props(styles.card)}>
        <div {...stylex.props(styles.actions)}>
          <Link to="/login" {...stylex.props(styles.loginLink)}>
            Open login screen
          </Link>

          {session.data ? (
            <button
              type="button"
              onClick={onSignOut}
              disabled={isPending}
              {...stylex.props(styles.signOutButton)}
            >
              {isPending ? 'Signing out...' : 'Sign out'}
            </button>
          ) : null}
        </div>

        {session.isPending ? (
          <p {...stylex.props(styles.pendingText)}>
            Loading current session...
          </p>
        ) : session.data ? (
          <div {...stylex.props(styles.sessionInfo)}>
            <p>
              Signed in as{' '}
              <span {...stylex.props(styles.emphasis)}>
                {session.data.user.email}
              </span>
            </p>
            <p>Name: {session.data.user.name}</p>
            <p {...stylex.props(styles.userId)}>
              User ID: {session.data.user.id}
            </p>
          </div>
        ) : (
          <p {...stylex.props(styles.lead)}>
            No active session. Open the login screen to authenticate.
          </p>
        )}

        {errorMessage ? (
          <div {...stylex.props(styles.errorBox)}>{errorMessage}</div>
        ) : null}
      </section>

      <section {...stylex.props(styles.userSection)}>
        <ul {...stylex.props(styles.userList)}>
          {users.map((row) => (
            <li key={row.id} {...stylex.props(styles.userItem)}>
              {row.name}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

const styles = stylex.create({
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginInline: 'auto',
    minHeight: '100vh',
    width: '100%',
    maxWidth: '48rem',
    paddingInline: '1.5rem',
    paddingBlock: '4rem',
  },
  intro: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  title: {
    fontSize: '1.875rem',
    lineHeight: '2.25rem',
    fontWeight: 700,
    color: colors.accentText,
  },
  lead: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    color: colors.textMuted,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: '1rem',
    backgroundColor: colors.surface,
    padding: '1.25rem',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '0.75rem',
  },
  loginLink: {
    borderRadius: '9999px',
    backgroundColor: {
      default: colors.accent,
      ':hover': colors.accentHover,
    },
    paddingInline: '1rem',
    paddingBlock: '0.5rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
    color: colors.textInverse,
  },
  signOutButton: {
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
    color: colors.textBody,
    cursor: { default: null, ':disabled': 'not-allowed' },
    opacity: { default: null, ':disabled': 0.6 },
  },
  pendingText: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    color: colors.textSubtle,
  },
  sessionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    color: colors.textBody,
  },
  emphasis: {
    fontWeight: 500,
  },
  userId: {
    fontFamily: fonts.mono,
    fontSize: '0.75rem',
    lineHeight: '1rem',
  },
  errorBox: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.dangerBorder,
    borderRadius: '0.75rem',
    backgroundColor: colors.dangerSurface,
    paddingInline: '1rem',
    paddingBlock: '0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    color: colors.dangerText,
  },
  userSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  userList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  userItem: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: '0.75rem',
    backgroundColor: colors.surface,
    paddingInline: '1rem',
    paddingBlock: '0.75rem',
  },
})
