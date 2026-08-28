/**
 * dev のときだけ head に足す、StyleX の CSS 用のタグ。
 *
 * `@stylexjs/unplugin` は本番ビルドでは集めた CSS を Vite が出力する CSS asset
 * （`globals.css` 由来の 1 枚）へ追記するが、dev では合流させず専用の URL で
 * 配信する。プラグインは `transformIndexHtml` でその URL を注ぎ込むところまで
 * やってくれるものの、TanStack Start は `index.html` を持たず document を
 * `__root.tsx` から組み立てるので、そのフックが回らない。だから自分で足す。
 *
 * runtime script のほうは HMR 用で、スタイルを書き換えたときに CSS を取り直す。
 * 本番ビルドではどちらも空配列になり、tree shaking で消える。
 */

/** unplugin が dev server に生やす CSS の配信 URL */
const DEV_CSS_HREF = '/virtual:stylex.css'

/** 同じく dev 用の仮想モジュール。CSS の再取得を HMR に繋ぐ */
const DEV_RUNTIME_SRC = '/@id/virtual:stylex:runtime'

export const stylexDevLinks = import.meta.env.DEV
  ? [{ rel: 'stylesheet', href: DEV_CSS_HREF }]
  : []

export const stylexDevScripts = import.meta.env.DEV
  ? [{ type: 'module', src: DEV_RUNTIME_SRC }]
  : []
