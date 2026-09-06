import { env } from '@packages/env'

import type { Config } from 'drizzle-kit'

// 適用は wrangler d1 migrations apply が行うため、ここは SQL の生成だけを担う。
// 接続先を持たないので dbCredentials も要らない。
export default {
  schema: env.ENABLE_AUTH
    ? ['./src/schema.ts', '../auth/src/schema.ts']
    : ['./src/schema.ts'],
  out: './migrations',
  dialect: 'sqlite',
} satisfies Config
