import type { Config } from 'drizzle-kit'
import 'dotenv/config'

const enableAuthSchema = parseBooleanFlag(
  process.env['ENABLE_AUTH'],
  true,
)

export default {
  schema: enableAuthSchema
    ? ['./src/schema.ts', '../auth/src/schema.ts']
    : ['./src/schema.ts'],
  out: './migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env['TURSO_DATABASE_URL'] ?? '',
    authToken: process.env['TURSO_AUTH_TOKEN'] ?? '',
  },
} satisfies Config

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
