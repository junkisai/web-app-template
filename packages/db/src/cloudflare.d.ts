// @cloudflare/workers-types は index.d.ts にトップレベルの export を持たず、
// package.json に types も exports も無いためモジュールとして import できない。
// グローバル宣言として読み込むと declare class Headers などが両アプリの
// lib: ["DOM"] と衝突するので、必要な分だけここで宣言する。
// DB binding に触るのは drizzle だけなので、型も drizzle が受け取れるものにする。
//
// アンビエントモジュール宣言なので、module である client.ts には書けない
// （module の中では augmentation になり、実体の無い cloudflare:workers では TS2664）。
// このファイルは @packages/db を使うアプリの tsconfig の include に足して拾わせる。
declare module 'cloudflare:workers' {
  export const env: {
    DB: import('drizzle-orm/d1').AnyD1Database
  }
}
