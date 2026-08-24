import { env } from '@packages/env'

import type { Config } from 'drizzle-kit'

export default {
  schema: env.ENABLE_AUTH
    ? ['./src/schema.ts', '../auth/src/schema.ts']
    : ['./src/schema.ts'],
  out: './migrations',
  dialect: 'turso',
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
} satisfies Config
