---
title: 管理画面用の apps/admin を作り、UI を Astryx で組む
date: 2026-08-28
status: approved
author:
pr:
---

## 概要

管理画面が必要になったアプリのための入口として、`apps/admin` を workspace に足す。構成は `apps/app` と同じ TanStack Start + Vite + Cloudflare Workers で、**UI だけ [Astryx](https://astryx.atmeta.com/docs/getting-started)（Meta の OSS デザインシステム）の既成コンポーネントで組む。**

## 背景

管理画面は「作り込む価値が低いのに、部品の点数だけは多い」画面の代表になる。テーブル、フォーム、ダイアログ、ナビゲーション、空状態、トースト。`apps/app` のやり方（`stylex.create` に 1 つずつ手で書く）をそのまま持ち込むと、**プロダクト側の画面と同じコストを、社内しか見ない画面に払うことになる。**

`apps/app` の 2 画面で実際にそうなっている。`screens/login/index.tsx` は 500 行あり、そのうち 300 行以上が `stylex.create` のスタイル定義になっている。管理画面は画面数がプロダクト側より多くなりがちなので、この比率のまま増やせない。

Astryx を選ぶ理由は 3 つある。

1. **`@stylexjs/stylex` を peer dependency に取る。** このリポジトリが 2 日前に StyleX へ移行した（[20260826_tailwind-to-stylex.md](20260826_tailwind-to-stylex.md)）ばかりで、要求される `^0.19.0` は `apps/app` が入れている `0.19.0` と同じ。スタイリングの土台を二重に持たなくていい
2. **ビルドプラグインが要らない。** コンポーネントは `dist` にビルド済みの JS と CSS で配られる。CSS を 3 枚 import してプロバイダで包むだけで、Vite の設定は増えない
3. **エージェント向けの入口が用意されている。** `@astryxdesign/cli` の `astryx component <name>` がコンポーネントの props と用例を出す。このリポジトリのコードを主に書くのはエージェントで、`AGENTS.md` に索引を書き込む `astryx init` もある

## ゴール

- [x] `apps/admin` が workspace として認識され、`pnpm -F admin dev` で起動する（`apps/app` と衝突しない port）
- [x] Astryx のコンポーネントだけで管理画面の 1 枚目（ユーザー一覧）が描けている
- [x] `routes/` の `loader` → まとまりの `api/` → `@packages/db` という既存の流れを、`apps/admin` でも同じ形でなぞれている
- [x] `pnpm lint`（tsc・oxlint・knip）と `pnpm -F admin build` が通る
- [x] `docs/architecture/20260819_directory-structure.md` の置き場所・依存の向き・命名に違反しない

## やらないこと

**今回やらないこと。**

- **認証・認可。** `apps/admin` は誰でも見られる状態で入る。`@packages/auth` は既にあり `apps/app` に配線済みなので、必要になった時点でそこから移す。**中途半端に「ゲートだけあってログイン画面がない」状態にするほうが危ないので、今回はどちらも入れない。** 管理画面として運用に乗せる前には必ず要る
- **`apps/admin` の Cloudflare へのデプロイ。** `wrangler.jsonc` は置くが、`name` は `apps/app` と同じく TODO のまま。Workers の作成と secrets の投入は使う人がやる
- **ユーザー一覧の書き込み系（作成・編集・削除）。** 1 枚目は読み取りだけにして、`loader` → `api/` → `@packages/db` の流れが通ることの確認に絞る
- **`apps/app` 側への Astryx の導入。** プロダクト側の見た目はデザインシステムに寄せる話とは別なので、混ぜない

**この先もやらないこと。**

- **`apps/app` と `apps/admin` で画面を共有すること。** 入口どうしは参照しない。両方が欲しがるものが出たら `packages/` へ出す

## 設計

### 画面と URL

| URL | 画面 | 内容 |
| --- | --- | --- |
| `/` | `screens/user-list/` | 登録ユーザーの一覧。Astryx の `Table` で出す |

### 置き場所

判断フローの結果は次のとおり。

```text
apps/admin/
├─ scripts/
│  └─ set-secrets.sh              1: 運用時だけ動く。apps/app と同じもの
├─ src/
│  ├─ routes/
│  │  ├─ __root.tsx               2: document と head。Astryx のプロバイダで包む
│  │  └─ index.tsx                2: `/` の loader
│  ├─ screens/
│  │  └─ user-list/
│  │     └─ index.tsx             3: まとまりを並べて 1 画面にする
│  ├─ features/
│  │  └─ users/                   4: ユーザーの取得・型・表示を 1 か所に
│  │     ├─ api/get-users.ts         @packages/db を引くのはここだけ
│  │     ├─ components/user-table.tsx 一覧（Astryx の Table）
│  │     └─ types/user.ts            画面へ渡す型
│  ├─ lib/
│  │  ├─ astryx-provider.tsx      9: Astryx の Theme の設定
│  │  ├─ stylex-dev-head.ts       9: apps/app と同じもの
│  │  └─ native-fetch-shim.ts     9: apps/app と同じもの
│  ├─ styles/
│  │  └─ globals.css                 Astryx の CSS 3 枚を import するだけ
│  ├─ router.tsx
│  └─ routeTree.gen.ts
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ wrangler.jsonc
```

**ユーザーのまとまりは、画面が 1 つでも `features/users/` に置く。** 「2 つ目の参照元が現れてから外に出す」に従えば `screens/user-list/components/users/` になるはずだが、**そこには置けない。** `.oxlintrc.json` が `**/src/screens/**` からの `@packages/db` を禁止していて、`screens/` の下に `api/` を掘ると `pnpm lint` が落ちる。lint のメッセージ自体が「取得は features/<ドメイン>/api/ に置き、loader から渡してください」と言っている。`apps/app` も同じ理由で `features/users/` に置いている。

**構成の規約（`docs/architecture/20260819_directory-structure.md`）の本文と lint はここで食い違っている。** 本文は「使うのが 1 画面のうちは `screens/<画面>/components/<まとまり>/api/`」と書いているが、lint はそれを通さない。今回は動くほう（lint）に合わせた。**どちらが正なのかを決めて片方を直すのは、この design doc の範囲外にする。**

**`screens/<入口>/<画面>/` の形にはしない。** 構成の規約には「管理画面のような 2 つ目の入口ができたら `screens/<入口>/` を 1 段挟む」とあるが、それは**同じ app の中に入口が 2 つできたとき**の話になる。今回は app ごと分けるので、`apps/admin/src/screens/` はフラットに始める。

**`components/ui/` は作らない。** ドメインを知らない表示部品は Astryx が持っている。自前の `Button` や `Table` を置くと、同じものが 2 系統になる。

### Astryx の組み込み

`@astryxdesign/core` はビルド済みの CSS と JS を配るので、Vite のプラグインは増やさない。要るのは CSS 3 枚とプロバイダだけになる。

**`src/styles/globals.css`** — **順番に意味がある。** `reset.css`（`@layer reset`）→ `astryx.css`（`@layer astryx-base`）→ `theme.css`（`@layer astryx-theme`）の順で、後ろほど強い。

```css
@import '@astryxdesign/core/reset.css';
@import '@astryxdesign/core/astryx.css';
@import '@astryxdesign/theme-neutral/theme.css';
```

`apps/app` の `globals.css`（Tailwind Preflight を写した自前の reset）は持ち込まない。Astryx の `reset.css` が同じ役割を、Astryx のコンポーネント前提で果たす。

**`src/lib/astryx-provider.tsx`** — `Theme` がトークンを流し込む。

**`LinkProvider` は入れない。** getting-started は Next.js の `Link` を `LinkProvider` に渡す形を載せているが、**TanStack Router では成立しない。** Astryx は差し替え先に `href` を渡すのに対し、TanStack Router の `Link` が取るのは型付きの `to` で、`href` は受けない。素通しすると Astryx 由来のリンクが実行時に壊れる。型のほうは `LinkComponentType = ElementType` と緩いので、**tsc では止まらない。**

そのため既定の `<a>` のままにする。リンクは正しく動き、クライアント側遷移にならない（フルリロードになる）だけになる。画面が増えて内部リンクが要るようになったら、`href` を `to` へ移すアダプタを書いてここで渡す。

テーマは `@astryxdesign/theme-neutral` を使う。7 つ配られているうち、Astryx 自身が "a good starting point" と言っている無彩色のもので、**管理画面はデータが主役なのでテーマに色を持たせない。**

`Theme` は `data-astryx-theme` を付けた `div` を描き、テーマの CSS は `@scope ([data-astryx-theme="neutral"])` で閉じている。ツリーの最上位の `Theme` だけが `<html>` にも同じ属性を同期するので、portal で外に出る Dialog や Toast にもテーマが届く。

**`@stylexjs/unplugin` は `apps/app` と同じ設定で入れる。** Astryx 自体には要らないが、外さないほうがいい理由がある。**StyleX はコンパイラが無くても `stylex.create` が書けてしまい、本番ビルドでだけスタイルが消える。** 画面固有の調整で 1 か所 `stylex.create` を書いた瞬間に踏むので、罠を残さない。

### データ

既存の `users` テーブルをそのまま読む。**スキーマは変えない。**

`@packages/db` の `User` 型は画面まで通さず、`components/users/types.ts` で受け直してから渡す（`apps/app` の `features/users/types/user.ts` と同じ形）。テーブル定義が変わったときに、画面側の import が動かないようにするため。

### 処理の流れ

```text
routes/index.tsx (loader)
  └─ screens/user-list/components/users/api/get-users.ts   createServerFn
       └─ @packages/db                                     db.select().from(users)
```

`routes/index.tsx` は `loader` で取って `screens/user-list/` に渡すだけにする。整形も集計もしない。

### バージョンの固定

**`@astryxdesign/*` は `0.4.5` に固定する。** 最新は `0.5.0` だが公開から 4 日しか経っておらず、`pnpm-workspace.yaml` の `minimumReleaseAge: 10080`（7 日）に掛かって `pnpm install` が `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION` で落ちる。

[20260825_minimum-release-age.md](../runbooks/20260825_minimum-release-age.md) の指示どおり、`minimumReleaseAgeExclude` に例外を足すのではなく **7 日を満たす最新版まで下げる。** 下げておけば 7 日経った時点で Renovate が上げ直す。`0.4.5` と `0.5.0` の間に、ここで使う `Theme` / `LinkProvider` / CSS の export の差分は無い。

`@astryxdesign/theme-neutral` は `@astryxdesign/core` を `0.4.5` 固定で peer に取るので、**3 つの version は必ず揃える。**

## 検討した他の案

| 案 | 採らなかった理由 |
| --- | --- |
| `apps/app` の中に `screens/admin/` を作る（構成の規約が言う「2 つ目の入口」の形） | 管理画面とプロダクトを同じ Worker・同じ URL・同じバンドルに載せることになる。**管理画面のコードが一般利用者に配られる**うえ、片方のデプロイでもう片方が落ちる。分けたい理由が「入口が 2 つ」ではなく「配布先と権限が違う」なので、app ごと分ける |
| Astryx を使わず `apps/app` と同じく `stylex.create` を手書きする | 土台は一番揃うが、背景に書いたコスト（`login` 画面で 500 行中 300 行がスタイル）を管理画面の枚数だけ払うことになる。管理画面は作り込む価値が低い |
| shadcn/ui を入れる | 現状 Tailwind 前提で、2 日前に捨てた Tailwind を管理画面のためだけに戻すことになる。スタイリングの土台が app と admin で割れる |
| Astryx を `packages/ui` で包んでから使う | 参照元が 1 つのうちは器を作らない、という規約に反する。`apps/app` も使い始めたらそこで考える |
| `@astryxdesign/*` を `0.5.0` にして `minimumReleaseAgeExclude` に例外を足す | 例外は「セキュリティ更新を急いで入れる」ための逃がし口で、新規導入の初期選定で使うものではない。7 日待てば Renovate が上げる |
| テーマを `theme-gothic`（dark 専用）などにする | 管理画面はデータが主役で、テーマに色や個性を持たせる場面ではない |

## 影響範囲

- **`apps/app` は変えない。** 依存も設定も触らない
- **`packages/*` は変えない。** `@packages/db` を読む側が 1 つ増えるだけ
- **`turbo.json` は変えない。** `dev` / `lint` / `fmt` は workspace を名前で列挙していないので、`apps/admin` を置けばそのまま拾われる
- **`.oxlintrc.json` は変えない。** `overrides` の glob が `**/src/routes/**` のように app 名を含まないので、依存の向きの lint は `apps/admin` にも最初から効く
- **`knip.jsonc` に `apps/admin` の項目が要る。** `apps/app` と同じく `src/lib/native-fetch-shim.ts` が import 文から辿れない（Vite の `resolve.alias` 経由）ため entry に足す
- **`pnpm dev` が 2 つの Vite を同時に立てる。** port が衝突しないよう `apps/admin` は 3001 を使う（`apps/app` は 3000）
- **`.env` のシンボリックリンクが `apps/admin` にも要る。** README の手順に 1 行足す
- **`pnpm lint` の実行時間が伸びる。** workspace が 1 つ増えた分の tsc と oxlint
- **CSS が `apps/app` より一桁大きい。** 実測は次のとおり（`pnpm build` が出す client 側の CSS 1 枚）。

  | | raw | gzip |
  | --- | --- | --- |
  | `apps/app`（StyleX、画面 2 枚） | 10,164 B | 2,975 B |
  | `apps/admin`（Astryx、画面 1 枚） | 158,149 B | 28,674 B |

  **これは画面が増えたから出た差ではない。** `astryx.css` は 150 種類以上のコンポーネント全部のスタイルを 1 枚で配る固定費で、**1 画面でも全部載る。** [20260826_tailwind-to-stylex.md](20260826_tailwind-to-stylex.md) が固定費を削ってサイズを 28% 減らした直後に、その 15 倍を管理画面側で払うことになる。

  **承知のうえで進める。** あの design doc がサイズを気にしたのは一般利用者に配るプロダクト側の話で、管理画面は利用者が社内に限られ、初回ロード 1 回きりでキャッシュも効く。ここでは部品を書かずに済むほうが価値が大きい。**同じ理由が `apps/app` には立たないので、プロダクト側に Astryx を持ち込むときは測り直す。**

## 未決事項

なし。
