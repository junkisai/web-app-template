import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

import { db } from '@packages/db'
import { SOCIAL_PROVIDER_ENV_PREFIXES, env } from '@packages/env'

import * as schema from '../schema'
import { hashPassword, verifyPassword } from './password'

const socialProviders = getSocialProviders()

export const auth = env.ENABLE_AUTH
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
  return env.BETTER_AUTH_URL ?? env.APP_BASE_URL ?? 'http://localhost:3000'
}

function getSocialProviders() {
  const providerEntries = SOCIAL_PROVIDER_ENV_PREFIXES.flatMap(
    ([provider, envPrefix]) => {
      const clientId = env[`${envPrefix}_CLIENT_ID`]
      const clientSecret = env[`${envPrefix}_CLIENT_SECRET`]

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
