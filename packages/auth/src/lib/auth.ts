import 'dotenv/config'
import { db } from '@packages/db'
import * as schema from '../schema'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { hashPassword, verifyPassword } from './password'

const SOCIAL_PROVIDER_ENV_PREFIXES = [
  ['apple', 'APPLE'],
  ['discord', 'DISCORD'],
  ['facebook', 'FACEBOOK'],
  ['github', 'GITHUB'],
  ['gitlab', 'GITLAB'],
  ['google', 'GOOGLE'],
  ['linkedin', 'LINKEDIN'],
  ['microsoft', 'MICROSOFT'],
  ['slack', 'SLACK'],
  ['spotify', 'SPOTIFY'],
  ['twitch', 'TWITCH'],
  ['x', 'X'],
] as const

const enableAuth = parseBooleanFlag(process.env['ENABLE_AUTH'], true)
const socialProviders = getSocialProviders()

export const auth = enableAuth
  ? betterAuth({
      baseURL: getBaseUrl(),
      database: drizzleAdapter(db, {
        provider: 'sqlite',
        schema,
      }),
      emailAndPassword: {
        enabled: true,
        password: {
          hash: hashPassword,
          verify: verifyPassword,
        },
      },
      ...(socialProviders ? { socialProviders } : {}),
      plugins: [tanstackStartCookies()],
    })
  : {
      handler: async () => {
        return Response.json(
          {
            message: 'Authentication is disabled.',
            code: 'AUTH_DISABLED',
          },
          { status: 404 },
        )
      },
    }

function getBaseUrl() {
  return (
    process.env['BETTER_AUTH_URL'] ??
    process.env['APP_BASE_URL'] ??
    'http://localhost:3000'
  )
}

function getSocialProviders() {
  const providerEntries = SOCIAL_PROVIDER_ENV_PREFIXES.flatMap(
    ([provider, envPrefix]) => {
      const clientId = process.env[`${envPrefix}_CLIENT_ID`]
      const clientSecret = process.env[`${envPrefix}_CLIENT_SECRET`]

      if (!clientId || !clientSecret) {
        return []
      }

      return [[provider, { clientId, clientSecret }] as const]
    },
  )

  if (providerEntries.length === 0) {
    return undefined
  }

  return Object.fromEntries(providerEntries)
}

function parseBooleanFlag(value: string | undefined, fallback: boolean) {
  if (!value) {
    return fallback
  }

  const normalized = value.trim().toLowerCase()

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false
  }

  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true
  }

  return fallback
}
