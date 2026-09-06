// @cloudflare/workers-types は index.d.ts にトップレベルの export を持たず,
// package.json に types も exports も無いためモジュールとして import できない。
// グローバル宣言として読み込むと declare class Headers などが両アプリの
// lib: ["DOM"] と衝突するので、必要な分だけここで宣言する。
// DB binding に触るのは drizzle だけなので、型も drizzle が受け取れるものにする。
declare module 'cloudflare:workers' {
  export const env: {
    DB: import('drizzle-orm/d1').AnyD1Database
  }
}

import { env } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/d1'

export const db = drizzle(env.DB)
