# 要件: packages/db を Cloudflare D1 + Drizzle の構成へ変更する

design doc [20260906_db-turso-to-cloudflare-d1.md](20260906_db-turso-to-cloudflare-d1.md) の元になった要件。

## 目的

`packages/db` の接続先を Turso (libSQL) から Cloudflare D1 に変える。Drizzle ORM は引き続き使う。

アプリ（`apps/app`・`apps/admin`）はすでに Cloudflare Workers 上で動いており、データベースだけが Cloudflare の外にある。この差を埋めることで、`@libsql/client` のために抱えている回避策と、接続情報を配るための secrets をなくす。

## 決まっている仕様・受け入れ条件

### driver と `@packages/db` の公開形

- `packages/db/src/client.ts` で `import { env } from 'cloudflare:workers'` を使って D1 binding を取り、`drizzle-orm/d1` に渡す
- いまと同じ module 直下の `export const db` を保つ。`apps/app`・`apps/admin` の `api/` と `@packages/auth` の呼び出し（`import { db } from '@packages/db'`）は変更しない
- binding 名は `DB` で固定する。両アプリの `wrangler.jsonc` で同じ名前にする
- `database_name` / `database_id` は TODO のプレースホルダで配る。実際の D1 の作成と記入は、このテンプレートを使う人が行う
- binding の型は `packages/db` の中で完結させ、両アプリの `tsconfig.json` は触らない。新しい依存は増やさない

### Turso の削除

- Turso 関連を完全に消す。両対応にはしない
- 対象: `@libsql/client` 依存、`packages/env` の `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN`、両アプリの `src/lib/native-fetch-shim.ts` と `vite.config.ts` の `node-fetch` alias、`knip.jsonc` の shim の `entry` 例外、`.env.template` の Turso の 2 行
- 必須 env が 0 本になるため、`packages/env` の `skipValidation` の逃がし口と、root `package.json` の `lint:knip` に付いている `SKIP_ENV_VALIDATION=1` も一緒に消す
- `apps/admin` は `secrets.required` が空になるため、`scripts/set-secrets.sh` と `cf:set-env` script ごと消す。`apps/app` 側は auth 系の secrets が残るので維持する

### ローカル開発

- wrangler のローカル D1（`@cloudflare/vite-plugin` が `.wrangler/state` に作る SQLite）を使う
- state は `apps/app` と `apps/admin` で別々のままとする。ローカルでデータが 2 つに分かれることは許容する
- `.env` に DB の接続情報を書かなくても `pnpm -F app dev` が起動すること

### migration

- SQL の生成は `drizzle-kit generate` のまま。適用は `wrangler d1 migrations apply` に移す
- migration の定義は `packages/db/migrations/` に 1 か所だけ置く
- 適用の入口は `apps/app` と `apps/admin` それぞれの `db:migrate` script に置き、各アプリの `wrangler.jsonc` から走らせる。`migrations_dir` は `packages/db/migrations` を指す
- 既存の migration 0000〜0002 は畳み直し、いまの schema から `0000` を 1 本だけ生成し直す
- `ENABLE_AUTH` による生成対象の切り替え（`true` なら `packages/db` と `packages/auth` の両方、`false` なら `packages/db` だけ）は維持する

### seed

- `packages/db/seed.sql` を置き、`wrangler d1 execute --file` で流す
- `packages/db/seed.ts` と `drizzle-seed` 依存は消す

### データ

- テーブル定義（`packages/db/src/schema.ts` の `users`、`packages/auth/src/schema.ts` の `user` / `session` / `account` / `verification`）は変更しない
- Turso 上の既存データは移行しない。D1 に migration を当て直して seed し直す。移行手順も書かない

### ドキュメント

- README の技術構成の表、セットアップ手順の Turso の節、env の説明を D1 の内容に書き換える
- D1 では drizzle の `db.transaction()` が使えないこと（代わりに `db.batch()`）を design doc の影響範囲と README に 1 行残す。lint での機械的な禁止はしない
- 「`@packages/db` は workerd 専用で、Node で動く script から import しない」という制約を、今回の実装 PR で `docs/architecture/20260819_directory-structure.md` の「破ってはいけない依存の向き」にも足す

### 完了の判定

- `apps/app` と `apps/admin` のユーザー一覧が、Turso なしで D1 から表示できる
- `pnpm lint`（tsc・oxlint・knip）と `pnpm -F app build` / `pnpm -F admin build` が通る
- README の手順どおりに新規セットアップが通る

## 制約

- 技術構成は変えない。TanStack Start + Vite + Cloudflare Workers、Drizzle ORM、SQLite スキーマはそのまま
- スキーマそのものの変更はスコープ外
- Cloudflare 上への D1 の作成と `database_id` の記入はスコープ外
- リポジトリの規約（[AGENTS.md](../../AGENTS.md)、[docs/architecture/20260819_directory-structure.md](../architecture/20260819_directory-structure.md)）に従う。ディレクトリ・ファイル名は kebab-case、バレルファイルを作らない、依存の向きを守る
- design doc の書き方は [docs/design-docs/README.md](README.md) と [_template.md](_template.md) に従う。節を消さず、該当しないものは「なし」と書く

## 参照リンク

- リポジトリの規約: [AGENTS.md](../../AGENTS.md)
- ディレクトリ構成の判断フロー: [docs/architecture/20260819_directory-structure.md](../architecture/20260819_directory-structure.md)
- design doc の書き方: [docs/design-docs/README.md](README.md) / [docs/design-docs/_template.md](_template.md)
- 現行の実装: `packages/db/`、`packages/env/src/index.ts`、`packages/auth/src/lib/auth.ts`、`apps/app/wrangler.jsonc`、`apps/admin/wrangler.jsonc`、`apps/app/vite.config.ts`
- Cloudflare D1（Workers binding・ローカル開発）: https://developers.cloudflare.com/d1/
- Cloudflare D1 の migration コマンド: https://developers.cloudflare.com/d1/reference/migrations/
- Drizzle ORM の Cloudflare D1 対応: https://orm.drizzle.team/docs/connect-cloudflare-d1
- `cloudflare:workers` の `env`: https://developers.cloudflare.com/workers/runtime-apis/bindings/#importable-env

## 未決事項

なし。
