---
title: packages/db を Turso から Cloudflare D1 へ移す
date: 2026-09-06
status: approved
author: Junki Saito
pr:
---

## 概要

`packages/db` の接続先を Turso (libSQL) から Cloudflare D1 に変える。Drizzle ORM と SQLite のスキーマ定義はそのまま残し、driver を `@libsql/client` から Workers の D1 binding に差し替える。migration と seed の入口も `wrangler` 側へ寄せる。

## 背景

アプリは Cloudflare Workers の上で動いている。`apps/app` と `apps/admin` はどちらも `wrangler.jsonc` を持ち、`@cloudflare/vite-plugin` 経由で開発時から workerd で動く。**そこにぶら下がるデータベースだけが Cloudflare の外にあり、リクエストのたびに Turso へ外部 HTTP を張っている。**

そのために回避策を 2 つ抱えている。

1. **`node-fetch` の差し替え。** `@libsql/client` の依存ツリーに `node-fetch` が入っており、workerd の resolve condition ではそれが SSR バンドルに取り込まれてクラッシュする。`apps/app` と `apps/admin` は同じ `src/lib/native-fetch-shim.ts` をそれぞれ持ち、`vite.config.ts` の `resolve.alias` で差し替えている。import 文から辿れないので `knip.jsonc` にも両アプリぶんの `entry` 例外を書いている
2. **接続情報を secrets で配ること。** `TURSO_DATABASE_URL` と `TURSO_AUTH_TOKEN` を `packages/env` で必須にし、`scripts/set-secrets.sh` で Worker に投入している。D1 は binding なので、この 2 本はどちらも要らなくなる

運用先が Cloudflare と Turso の 2 つに分かれていることも、テンプレートとして配る構成としては重い。**Workers で動かすと決まっているなら、データベースも同じ足場に置いたほうが、回避策も secrets も減る。**

## ゴール

- [ ] `packages/db` が D1 binding で動き、`apps/app` と `apps/admin` のユーザー一覧が Turso なしで表示できる
- [ ] `@libsql/client`・`drizzle-seed`・`TURSO_*` env・`native-fetch-shim.ts`・`knip.jsonc` の shim 例外がリポジトリから消えている
- [ ] ローカルは wrangler のローカル D1 だけで起動でき、`.env` に DB の接続情報を書かなくても `pnpm -F app dev` が動く
- [ ] migration と seed の当て方が README にあり、その手順どおりで新規セットアップが通る
- [ ] `pnpm lint`（tsc・oxlint・knip）と `pnpm -F app build` / `pnpm -F admin build` が通る

## やらないこと

**今回やらないこと。**

- **Turso 上のデータの移行。** テンプレートに入っているのは seed の `Alice` 1 行だけなので、D1 に migration を当て直して seed し直す。dump と流し込みの手順も書かない
- **スキーマそのものの変更。** `packages/db/src/schema.ts` と `packages/auth/src/schema.ts` の列は 1 つも変えない。今回変わるのは driver と、migration / seed の入口だけ
- **Cloudflare 上への D1 の作成と `database_id` の記入。** `wrangler.jsonc` には `apps/app` の `name` と同じく TODO のプレースホルダを置く。実際の作成は使う人がやる

**この先もやらないこと。**

- **Turso との両対応。** driver を env で切り替えられる形にはしない。分岐が残ると、背景に書いた回避策も一緒に残り続ける
- **`packages/db` を Node から import できる状態に保つこと。** D1 binding は workerd の中にしかないので、`@packages/db` は workerd 専用の package として扱う

## 設計

### 画面と URL

なし。画面も URL も足さない。`apps/app` の `/`・`/login` と `apps/admin` の `/` はそのまま動く。

### 置き場所

新しいまとまりは作らない。既存のファイルの中身が入れ替わり、いくつかが消える。

```text
packages/db/
├─ drizzle.config.ts             dialect を sqlite にし dbCredentials を消す。generate 専用になる
├─ migrations/
│  ├─ 0000_<name>.sql            いまの schema.ts から生成し直した 1 本。wrangler が読む
│  └─ meta/                      drizzle-kit の snapshot。wrangler は .sql しか見ない
├─ seed.sql                      wrangler d1 execute --file で流す（seed.ts は消す）
├─ src/client.ts                 cloudflare:workers の env.DB を drizzle-orm/d1 に渡す
├─ src/cloudflare.d.ts           cloudflare:workers の最小のアンビエント宣言。client.ts から参照する
├─ src/index.ts                  変更なし
├─ src/schema.ts                 変更なし
└─ package.json                  @libsql/client と drizzle-seed を外し、generate だけ残す

apps/app/
├─ package.json                  db:migrate と db:seed を足す
├─ tsconfig.json                 include に packages/db/src/cloudflare.d.ts を足す
├─ wrangler.jsonc                d1_databases を足し、secrets.required から TURSO_* を消す
├─ vite.config.ts                node-fetch の alias を消す
└─ src/lib/native-fetch-shim.ts  削除

apps/admin/
├─ package.json                  db:migrate と db:seed を足し、cf:set-env を消す
├─ tsconfig.json                 include に packages/db/src/cloudflare.d.ts を足す
├─ wrangler.jsonc                d1_databases を足し、secrets ごと消す
├─ scripts/set-secrets.sh        削除
├─ vite.config.ts                node-fetch の alias を消す
└─ src/lib/native-fetch-shim.ts  削除

packages/env/src/index.ts        TURSO_* と skipValidation の逃がし口を消す
knip.jsonc                       両アプリの shim の entry 例外を消す
.env.template                    Turso の 2 行を消す
package.json                     lint:knip の SKIP_ENV_VALIDATION=1 を外す
docs/architecture/20260819_directory-structure.md
                                 依存の向きに「@packages/db を Node の script から import しない」を足す
```

### データ

**テーブルは 1 つも変えない。** `packages/db/src/schema.ts` の `users` と、`packages/auth/src/schema.ts` の `user` / `session` / `account` / `verification` を、いまの列のまま D1 に作る。

migration は畳み直す。いまの `migrations/` は 0000 から 0002 まで 3 本あり、先頭に実験の残骸である `foo` テーブルの作成と削除が入っている。**D1 は新しく作るので過去の履歴をなぞる必要がなく、テンプレートを clone した人が読む履歴は短いほうがいい。** `migrations/` を一度空にし、いまの schema から `0000` を生成し直す。

Turso 上のデータは移さない。中身は seed の `Alice` 1 行だけで、D1 側で seed し直せば同じ状態になる。

`ENABLE_AUTH` による生成対象の切り替えはそのまま残す。`true` なら `packages/db` と `packages/auth` の両方、`false` なら `packages/db` だけを `drizzle-kit generate` の対象にする。

### 処理の流れ

読み書きの経路は変わらない。

```text
routes/ の loader
  → features/users/api/get-users.ts
    → @packages/db の db
      → cloudflare:workers の env.DB（D1 binding）
```

**変わるのは `packages/db/src/client.ts` の中だけ。** `createClient` で Turso に HTTP を張る代わりに、`import { env } from 'cloudflare:workers'` で binding を取り、`drizzle-orm/d1` に渡す。`apps/app` と `apps/admin` の `api/`、`@packages/auth` の `drizzleAdapter(db, ...)` はどれも `import { db } from '@packages/db'` のままでよい。

binding 名は **`DB` で固定**する。`packages/db` が binding を名前で引く以上、両アプリの `wrangler.jsonc` で同じ名前にする必要がある。`database_name` と `database_id` は `apps/app` の `name` と同じく TODO のプレースホルダで配り、使う人が `wrangler d1 create` の結果で埋める。この `DB` という名前は、後述の `cloudflare.d.ts` の宣言にもそのまま現れる。

migration と seed はアプリ側から当てる。

| コマンド | 当たる先 |
| --- | --- |
| `pnpm -F db generate` | `packages/db/migrations/` に SQL を出すだけ。DB には触らない |
| `pnpm -F app db:migrate` | `apps/app/.wrangler/state` のローカル D1 |
| `pnpm -F app db:migrate --remote` | Cloudflare 上の D1 |
| `pnpm -F admin db:migrate` | `apps/admin/.wrangler/state` のローカル D1 |

**script 本体に `--local` を固定しない。** wrangler 4 は `--local` と `--remote` のどちらも無いときローカルを既定にするので、script は `wrangler d1 migrations apply DB` と書いておき、リモートに当てたいときだけ後ろに `--remote` を足す。`--local` を固定すると `--remote` と衝突して切り替えられなくなる。pnpm には `--` を挟まない。挟むと `--` ごと script の引数として渡り、wrangler がオプションとして読まない。

`wrangler.jsonc` の `migrations_dir` は `../../packages/db/migrations` を指す。**migration の定義は `packages/db` に 1 か所だけ置き、当てる入口だけがアプリごとに 2 つある**という形になる。リモートは両アプリが同じ `database_id` を指すので、どちらから当てても同じ D1 に当たる。

seed も同じで、`wrangler d1 execute DB --file ../../packages/db/seed.sql` をアプリ側の `db:seed` から呼ぶ。こちらも `--local` は固定しない。

### binding の型

**`@cloudflare/workers-types` は入れない。** 型の宣言は `packages/db` に置き、両アプリの `tsconfig.json` はその 1 ファイルを拾うだけにする。

前提が 2 つある。

1. **`packages/db` は自前の型検査を持たない。** `lint` script が無く、`packages/db/src/*.ts` は TypeScript のソースのまま公開されているので、型が検査されるのは両アプリの `tsc --noEmit` がこのファイルを読み込むときだけになる。`packages/db/tsconfig.json` の `types` に何を足しても、アプリ側の型検査には引き継がれない
2. **`@cloudflare/workers-types` はグローバル宣言としてしか読み込めず、読み込むと両アプリが壊れる。** この package の `index.d.ts` にはトップレベルの `export` が無く、`package.json` に `types` も `exports` も無い。つまり `import type { D1Database } from '@cloudflare/workers-types'` は解決できず、`/// <reference types="..." />` でグローバルに入れるしかない。しかし中身は `declare class Headers` や `declare class Blob` といったグローバル宣言で、両アプリの `lib: ["DOM"]` と名前が衝突する。アプリは React の SSR なので DOM を外せない

そこで、`packages/db/src/cloudflare.d.ts` に必要な分だけを宣言する。

```ts
declare module 'cloudflare:workers' {
  export const env: {
    DB: import('drizzle-orm/d1').AnyD1Database
  }
}
```

`AnyD1Database` は `drizzle-orm/d1` が export している、`drizzle()` が受け取れる型。**このリポジトリで `DB` binding に触るのは drizzle だけなので、D1 の API 全体の型は要らない。** `Cloudflare.Env` の拡張も要らなくなる。

アンビエントモジュール宣言なので、`client.ts` の中には書けない。**module の中の `declare module` は augmentation として扱われ、実体の無い `cloudflare:workers` に対しては `TS2664` になる。** 独立した `.d.ts` に置き、`@packages/db` を使うアプリの `tsconfig.json` の `include` に足して拾わせる。すでに `../../env.d.ts` を同じやり方で渡しているので、並びも揃う。

```jsonc
"include": [
  "**/*.ts",
  "**/*.tsx",
  "../../env.d.ts",
  "../../packages/db/src/cloudflare.d.ts"
],
```

`client.ts` から `/// <reference path="./cloudflare.d.ts" />` で取り込む形にはしない。**`.oxlintrc.json` が `typescript(triple-slash-reference)` を禁止しており、`pnpm lint` が落ちる。**

## 検討した他の案

| 案 | 採らなかった理由 |
| --- | --- |
| `createDb(binding)` を export し、リクエストごとに binding を渡す | `apps/app`・`apps/admin` の `api/` と `@packages/auth` の `auth` が binding を受け取る形に変わり、`auth` は module 直下の定数でいられなくなる。**driver を差し替えるだけの変更で、呼び出し側の形まで変えることになる。** `cloudflare:workers` の `env` で同じことができる |
| singleton の `db` と `createDb` を両方 export する | 移行中は楽だが、どちらを使うべきかがコードから読めない。テンプレートとして配るものに選択肢を 2 つ置くと、使う人が毎回決めることになる |
| Turso と D1 の両対応にし、env で driver を切り替える | 背景に書いた回避策（node-fetch shim と secrets 2 本）が両方とも残り続ける。**移す動機がそのまま消える** |
| `drizzle-kit migrate` を `driver: 'd1-http'` で使う | コマンドはいまと同じままにできるが、Cloudflare の HTTP API 経由なのでリモート専用で、ローカル D1 には当てられない。account id と API token の env が 3 本増える |
| `drizzle-seed` を残し、`drizzle-orm/sqlite-proxy` で D1 の HTTP API を叩く | seed がスキーマの型で守られるが、seed のためだけに 2 つ目の接続経路と API token を持つことになる。テンプレートに入れる seed は `Alice` 1 行で、型で守る価値がその重さに見合わない |
| 既存の migration 3 本をそのまま持ち込む | 履歴は連続するが、いまの schema に存在しない `foo` テーブルの作成と削除を、clone した人が最初に読むことになる |
| `@cloudflare/workers-types` を入れて `D1Database` を取る | モジュールとして import できず、`/// <reference types="..." />` でグローバルに入れるしかない。中身の `declare class Headers` などが両アプリの `lib: ["DOM"]` と衝突し、React の SSR である以上 DOM は外せない |
| `wrangler types` の生成物をコミットし、`packages/db` の tsconfig から読む | binding 名の間違いまで型で拾えるが、`packages/db` が `apps/app` の生成物を参照することになり、依存の向きが逆になる。生成物には Workers のグローバル型が丸ごと入るので、DOM との衝突も同じように起きる |
| `client.ts` の `/// <reference path="./cloudflare.d.ts" />` で取り込む | `packages/db` の中で完結し、`@packages/db` を使うアプリが増えても tsconfig に足すものが無い。しかし `.oxlintrc.json` が `typescript(triple-slash-reference)` を禁止しているので `pnpm lint` が落ちる |
| 開発時もリモートの D1 を直接見る | ローカルの state が 1 つで済むが、開発中の操作が本物のデータに当たる。オフラインでも動かなくなる |
| ローカル D1 を両アプリで 1 つに共有する（`persist_to` を揃える） | ローカルでもデータが 1 つになるが、設定が 1 段増える。`apps/admin` はまだ読み取りだけなので、いまは分かれていて困らない |

## 影響範囲

- **`db.transaction()` が使えなくなる。** D1 は明示的な `BEGIN` / `COMMIT` を受け付けず、drizzle の D1 driver はこれを素の SQL として投げるため実行時に落ちる。複数文をまとめたいときは `db.batch()` を使う。**いまのコードでは 1 か所も使っていない。** `@packages/auth` が使う better-auth の drizzle adapter も `transaction` が既定 `false` なので影響しない。README の DB の節に 1 行残す
- **`@packages/db` が Node から import できなくなる。** `cloudflare:workers` は workerd の中にしかない。これが `seed.ts` を `seed.sql` に置き換える理由で、恒常的な制約として `docs/architecture/20260819_directory-structure.md` の依存の向きにも足す
- **ローカルのデータが `apps/app` と `apps/admin` で 2 つに分かれる。** `.wrangler/state` はアプリごとなので、`apps/admin` で入れたデータは `apps/app` から見えない。それぞれで `db:migrate` と `db:seed` を当てる
- **`packages/env` の必須 env が 0 本になる。** 残るのは既定値を持つ `ENABLE_AUTH` と、任意の auth 系・R2 系だけ。`skipValidation` の逃がし口と `lint:knip` の `SKIP_ENV_VALIDATION=1` は、必須が無くなることで要らなくなるので一緒に消す
- **`.env` を持たなくても `pnpm -F app dev` が起動するようになる。** DB の接続情報が env から消えるため。README のセットアップ手順から Turso の節が消え、`wrangler d1 create` の節に入れ替わる
- **`apps/admin` から secrets の仕組みが消える。** `secrets.required` が空になるので、`scripts/set-secrets.sh` と `cf:set-env` script ごと消す。`apps/app` 側は auth 系の 4 本が残るのでそのまま
- **`knip.jsonc` の shim 例外 2 つが消える。** 新しい依存は 1 つも増えず、`packages/db` からは `@libsql/client` と `drizzle-seed` の 2 つが消える
- **Cloudflare 上に D1 を作る作業が要る。** `wrangler d1 create` と、両アプリの `wrangler.jsonc` への `database_id` の記入。既存の Turso データベースは自動では消えないので、乗り換えが済んだら使う人が消す
- **README の書き換え。** 冒頭の技術構成の表（Turso・@libsql/client・drizzle-seed の 3 つ）、セットアップ手順の Turso の節、env の説明の必須 2 本

## 未決事項

なし。
