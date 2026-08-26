---
title: Tailwind CSS から StyleX へ移行する
date: 2026-08-26
status: implemented
author: jonki.beam@gmail.com
pr:
---

## 概要

`apps/app` のスタイリングを Tailwind CSS v4 から [StyleX](https://stylexjs.com/docs/learn) に置き換える。className の羅列をやめ、スタイルは各ファイルの `stylex.create` に型付きで持つ。色は `src/styles/tokens.stylex.ts` の CSS 変数にまとめる。

## 背景

Tailwind はクラス名の文字列なので、**型が付かず、どこにも定義がない。** 綴りを間違えても壊れるまで気づかず、`text-slate-600` が何色かはエディタでは分からない。テンプレートとして配る以上、最初に入っているスタイリング手段が「文字列を覚えて書く」ものだと、使う人ごとに書き方がばらける。

このリポジトリは他のすべて（ディレクトリ構成、依存の向き、命名）を仕組みで縛っている。スタイルだけが縛られていない。

StyleX は `stylex.create` に渡すオブジェクトが TypeScript の型で検査され、値は定義元へジャンプできる。ビルド時に atomic CSS へ潰れるので、出力の性質（重複しない・使った分だけ）は Tailwind と変わらない。

いま移行する理由は、**画面が 2 つしかないうちだから。** 画面が増えてから同じことをやると、書き換える対象が線形に増える。

## ゴール

- [x] `apps/app` から `tailwindcss` / `@tailwindcss/vite` の依存が消えている
- [x] 既存 2 画面（`/`・`/login`）の見た目が移行前と変わらない
- [x] `pnpm build`（Cloudflare Workers 向け）が通り、生成された CSS に StyleX の atomic rule が入っている
- [x] `pnpm dev` で SSR された HTML に StyleX の CSS が当たり、編集が HMR で反映される
- [x] `pnpm lint`（tsc・oxlint・knip）が通る

## やらないこと

- **デザインそのものの変更。** 移行前と同じ見た目を再現する。色・余白・角丸をよくするのは別の機会にやる。
- **ダークモード対応。** 現状 `color-scheme: light` の light 固定で、StyleX の `light-dark()` / `stylex.createTheme` は使わない。今はやらない（`tokens.stylex.ts` を足せば後から入る）。
- **共通 UI コンポーネントの切り出し。** `components/ui/` は空のまま。ボタンやカードは 2 画面それぞれの `stylex.create` に置く。2 つ目の参照元が現れてから外に出す、の原則どおり。
- **spacing / font-size のトークン化。** 色とフォントだけ CSS 変数にする。余白や文字サイズは各 `stylex.create` に直接書く（StyleX では値がそのまま型検査されるので、変数にしても得るものが少ない）。
- **`@stylexjs/eslint-plugin` の導入。** このリポジトリの linter は oxlint で、ESLint plugin を読み込めない。この先も入れない。

## 設計

### 画面と URL

変更なし。既存の `/` と `/login` の中身だけを書き換える。

### 置き場所

```text
apps/app/
├── vite.config.ts                  # @tailwindcss/vite → @stylexjs/unplugin
├── src/
│   ├── styles/
│   │   ├── globals.css             # @import 'tailwindcss' → 最小限の reset + base
│   │   └── tokens.stylex.ts        # 新規。stylex.defineVars による色・フォント
│   ├── lib/
│   │   └── stylex-dev-head.ts      # 新規。dev のときだけ足す <link>/<script>
│   ├── routes/
│   │   └── __root.tsx              # head に dev 用の CSS を足す
│   └── screens/
│       ├── top/index.tsx           # className → stylex.props
│       └── login/index.tsx         # className → stylex.props
```

`tokens.stylex.ts` を `src/styles/` に置くのは、`globals.css` と同じ「アプリ全体の見た目の土台」だから。ドメインも画面も知らないので、依存の向きは壊れない。ファイル名の `.stylex.ts` は StyleX 側の要求で、`defineVars` はこの拡張子のファイルにしか書けない。

`stylex-dev-head.ts` が `lib/` なのは、外部ライブラリ（unplugin）の都合を吸収するラッパーだから（置き場所の 9 番）。

### データ

なし。

### 処理の流れ

ビルド時のみ。実行時の処理は増えない。

1. `@stylexjs/unplugin` が `@stylexjs/stylex` を import しているモジュールを Babel で変換し、`stylex.create` をクラス名に潰す
2. 集めた CSS を lightningcss に通し、Vite が出力した CSS asset（`globals.css` 由来）の末尾に追記する
3. `__root.tsx` の `links` が参照しているのはその 1 枚だけなので、追加のリクエストは増えない

dev だけは経路が違う。unplugin は dev では CSS をバンドルに合流させず、`/virtual:stylex.css` で配信する。TanStack Start は `index.html` を持たず、document を `__root.tsx` から作るので、プラグインの `transformIndexHtml` による自動注入が効かない。**そのため `__root.tsx` の head に、dev のときだけ `<link>` と HMR 用の runtime script を自分で足す。**

### `@/` エイリアスを StyleX にも教える

StyleX は `defineVars` を書いたファイル（`tokens.stylex.ts`）の実体を Babel の中で自前で解決する。Vite の `resolve` も tsconfig の `paths` も見ないので、`@/styles/tokens.stylex` の import はそのままだとビルドが落ちる。`vite.config.ts` の `stylex.vite()` に `aliases` を渡して同じ対応を書く。相対パスに逃げると `screens/` の中から `../../styles/` を書くことになるので、エイリアス側を揃える。

## 検討した他の案

| 案 | 採らなかった理由 |
| --- | --- |
| Tailwind のまま残す | 型が付かないという元の問題が残る。画面が増えるほど移行コストが上がる |
| `@stylexjs/postcss-plugin` + Babel を `@vitejs/plugin-react` に挿す | dev/prod ともに Vite の CSS パイプラインに乗るので `__root.tsx` に dev 用の分岐が要らない利点はある。ただし Babel 設定が `vite.config.ts` と `postcss.config.js` の 2 か所に分かれ、片方だけずれるとクラス名が合わなくなる。加えて全 `.tsx` が Babel を通るのでビルドが遅くなる。公式が推す unplugin 1 個で済む形を採った |
| `@stylexswc/*`（Rust 実装のコンパイラ） | Babel より速いが facebook/stylex 本体とはリリースが別で、追随のずれを踏む。テンプレートの土台に置くものではない |
| CSS Modules | 型は `.d.ts` 生成に頼ることになり、値そのものは型検査されない。atomic CSS でもないので出力が画面数に比例して増える |
| `useCSSLayers: true` で出力する | `@layer` の中の StyleX は、layer に入っていない `globals.css` の reset に負ける。reset 側も layer に入れて順序を宣言すれば解決するが、StyleX が作る layer 数（`priority1..N`）に依存する並びになる。既定の `:not(#\#)` なら「StyleX が常に reset に勝つ」で終わる |
| Tailwind の Preflight の代わりに reset を入れない | Preflight が消えると `<h1>` の余白、`<ul>` の行頭記号、`<button>` の既定スタイル、`body` の 8px margin が復活して見た目が崩れる。Preflight から実際に効いている分だけを `globals.css` に写した |

## 影響範囲

- **`apps/app` の全画面。** className を持つ要素はすべて書き換わる。見た目の差分が出ていないかは `/` と `/login` を目視で確認する
- **`.oxfmtrc.json` の `sortTailwindcss`。** 並べ替える対象の className が無くなるので外す
- **`README.md` の技術スタック表。** Tailwind CSS → StyleX
- **CSS の優先順位。** StyleX は `:not(#\#)` を付けて出力するので、`globals.css` に後から書いた element セレクタでは上書きできない。上書きしたくなったらそれは `stylex.create` 側に書くもの
- **`space-y-*` は flex + `gap` に置き換える。** 子に margin を配る Tailwind の形は StyleX にはない。並びの見た目は変わらないが、その要素が flex container になるので、中の `inline-flex` なバッジには `alignSelf` が要る。入力欄のラベル（`block space-y-2`）だけは inline の `span` を含んでいて行送りの高さが変わるため、`display: block` のまま残した
- **`@stylexjs/stylex` は dependency（devDependency ではない）。** `stylex.props` の実体が実行時に残るため

## 未決事項

なし。
