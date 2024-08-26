import type { Config } from 'drizzle-kit'

export default process.env.LOCAL_DB === 'true'
  ? ({
      schema: './src/drizzleSchema.ts',
      out: './migrations',
      dialect: 'sqlite',
      dbCredentials: {
        // NOTE: 適切なurlに変更して利用
        url: '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/fa89a6c46e6350f4ab903dafebb7ab3e92e3ce28d2478365d3b5eacaee98ca48.sqlite',
      },
    } satisfies Config)
  : ({
      schema: './src/drizzleSchema.ts',
      out: './migrations',
      dialect: 'sqlite',
      driver: 'd1-http',
      dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? '',
        databaseId: process.env.CLOUDFLARE_DATABASE_ID ?? '',
        token: process.env.CLOUDFLARE_D1_TOKEN ?? '',
      },
    } satisfies Config)
