import 'dotenv/config'
import { createEnv } from '@t3-oss/env-core'
import * as v from 'valibot'

export const SOCIAL_PROVIDER_ENV_PREFIXES = [
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

type SocialProviderEnvPrefix = (typeof SOCIAL_PROVIDER_ENV_PREFIXES)[number][1]

const TRUE_VALUES: readonly string[] = ['1', 'true', 'yes', 'on']
const FALSE_VALUES: readonly string[] = ['0', 'false', 'no', 'off']

const optionalString = v.optional(v.string())
const optionalUrl = v.optional(v.pipe(v.string(), v.url()))

const booleanFlag = (fallback: boolean) =>
  v.pipe(
    v.optional(v.string(), String(fallback)),
    v.transform((value) => value.trim().toLowerCase()),
    v.check(
      (value) => TRUE_VALUES.includes(value) || FALSE_VALUES.includes(value),
      `${TRUE_VALUES.join(' / ')} または ${FALSE_VALUES.join(' / ')} のいずれかを指定してください`,
    ),
    v.transform((value) => TRUE_VALUES.includes(value)),
  )

type SocialProviderCredentials = {
  [Prefix in SocialProviderEnvPrefix as
    | `${Prefix}_CLIENT_ID`
    | `${Prefix}_CLIENT_SECRET`]: typeof optionalString
}

const socialProviderCredentials = Object.fromEntries(
  SOCIAL_PROVIDER_ENV_PREFIXES.flatMap(([, prefix]) => [
    [`${prefix}_CLIENT_ID`, optionalString],
    [`${prefix}_CLIENT_SECRET`, optionalString],
  ]),
) as SocialProviderCredentials

export const env = createEnv({
  server: {
    ENABLE_AUTH: booleanFlag(true),
    APP_BASE_URL: optionalUrl,
    BETTER_AUTH_URL: optionalUrl,
    BETTER_AUTH_SECRET: optionalString,

    TURSO_DATABASE_URL: v.pipe(v.string(), v.url()),
    TURSO_AUTH_TOKEN: v.pipe(v.string(), v.nonEmpty()),

    // R2 の 5 つはコードから読まれておらず、.env.template も XXXX のまま配っている。
    // ここで形式を課すと R2 を使わない構成が起動しなくなるので、存在の宣言だけに留める。
    R2_BUCKET_NAME: optionalString,
    R2_BUCKET_URL: optionalString,
    R2_ACCESS_KEY: optionalString,
    R2_SECRET_KEY: optionalString,
    R2_ENDPOINT: optionalString,

    ...socialProviderCredentials,
  },
  // Cloudflare Workers では nodejs_compat が secrets を process.env に流し込むため、
  // ローカル（dotenv）と本番（Workers）を同じ参照元で扱える。
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  // knip は drizzle.config.ts を読み込んで解析するため、この module も評価される。
  // 秘密情報を持たない環境で lint を通せるようにするための逃がし口で、
  // 立てるとスキーマを通さない生の値が返るのでアプリの実行時には使わない。
  skipValidation: !!process.env['SKIP_ENV_VALIDATION'],
  onValidationError: (issues) => {
    const lines = issues.map(
      (issue) => `  - ${formatIssuePath(issue.path)}: ${issue.message}`,
    )

    throw new Error(
      `環境変数が不正です。.env を確認してください。\n${lines.join('\n')}`,
    )
  },
})

function formatIssuePath(
  path: readonly (PropertyKey | { readonly key: PropertyKey })[] | undefined,
) {
  if (!path || path.length === 0) {
    return '(unknown)'
  }

  return path
    .map((segment) =>
      typeof segment === 'object' ? String(segment.key) : String(segment),
    )
    .join('.')
}
