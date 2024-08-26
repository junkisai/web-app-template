import type { Config } from 'drizzle-kit'

export default {
  schema: './src/drizzleSchema.ts',
  out: './migrations',
  driver: 'd1',
  dbCredentials: {
    wranglerConfigPath: 'wrangler.toml',
    dbName: 'web-app-template',
  },
} satisfies Config
