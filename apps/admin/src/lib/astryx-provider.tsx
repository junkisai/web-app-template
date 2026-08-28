import type { ReactNode } from 'react'

import { Theme } from '@astryxdesign/core/theme'
import { neutralTheme } from '@astryxdesign/theme-neutral/built'

/**
 * Astryx を this app 用に設定したもの。画面はこれで包まれている前提で書く。
 *
 * `Theme` は `data-astryx-theme="neutral"` を付けた要素を描く。テーマの CSS は
 * `@scope` でその属性の中に閉じているので、**これを通さないとトークンが 1 つも
 * 効かない**（コンポーネントは Astryx 既定の見た目のまま出る）。
 *
 * ツリーの最上位の `Theme` だけが `<html>` にも同じ属性を同期するので、
 * Dialog や Toast のように portal でツリーの外に出るものにもテーマが届く。
 *
 * テーマは 7 つ配られているうち neutral を選んでいる。管理画面はデータが主役で、
 * テーマ側に色を持たせる場面ではない。差し替えるならこの 1 行と、
 * globals.css の theme.css の import を同じテーマに揃える。
 *
 * `mode` は既定の 'system' のまま使う。OS の設定に従って light / dark が切り替わる。
 *
 * ここで `LinkProvider` は入れていない。Astryx の Link は差し替え先に `href` を
 * 渡すが、TanStack Router の `Link` が取るのは `to` で、`href` は受けない。
 * 素通しすると Astryx 由来のリンクが実行時に壊れるため、既定の `<a>` のままにしてある
 * （リンクは動くが、クライアント側遷移ではなくフルリロードになる）。
 * 管理画面の画面数が増えて内部リンクが要るようになったら、ここに `href` を `to` へ
 * 移すアダプタを書いて `LinkProvider` に渡す。
 */
export function AstryxProvider({ children }: { children: ReactNode }) {
  return <Theme theme={neutralTheme}>{children}</Theme>
}
