import type { Config } from 'drizzle-kit'

require('dotenv').config()

export default {
  schema: './src/schema.ts',
  out: './migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env['TURSO_DATABASE_URL'] ?? '',
    authToken: process.env['TURSO_AUTH_TOKEN'] ?? '',
  },
} satisfies Config
