import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'

function getRequiredEnv(name: 'TURSO_DATABASE_URL' | 'TURSO_AUTH_TOKEN') {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

const databaseUrl = getRequiredEnv('TURSO_DATABASE_URL')
const authToken = getRequiredEnv('TURSO_AUTH_TOKEN')

const turso = createClient({
  url: databaseUrl,
  authToken,
})

export const db = drizzle(turso)
