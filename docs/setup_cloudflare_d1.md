# Cloudflare D1のセットアップ

## 初期設定

以下のコマンドを実行します。

```sh
npx wrangler d1 create <DATABASE_NAME>
```

`wrangler.toml`を作成し、D1の設定を記入します。

```
[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "<DATABASE_NAME>"
database_id = "xxxxxxxxxxxxxxxxxxxx"
migrations_dir = "migrations"
```

`apps/api/drizzle.config.ts`にもDB情報を記載する必要があります。

```ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/schema.ts',
  out: './migrations',
  driver: 'd1',
  dbCredentials: {
    wranglerConfigPath: 'wrangler.toml',
    dbName: '<DATABASE_NAME>',
  },
} satisfies Config

```

## マイグレートファイルの作成

`apps/api/src/schema.ts`ファイルを開き、drizzleベースでDBスキーマを作成します。
以下のコマンドでマイグレーションファイルを生成します。

```sh
bun migrate:gen
```

## マイグレーションの実行

以下のコマンドでマイグレーションを実行します。

```sh
bun migrate:apply:local
```
