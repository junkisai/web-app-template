# web-app-template

| Kind                             |                              |                                   |                                  |
| -------------------------------- | ---------------------------- | --------------------------------- | -------------------------------- |
| **言語・マークアップ**           | TypeScript (Language)        | HTML (Markup)                     |                                  |
|                                  |                              |                                   |                                  |
| **スタイル・デザイン**           | CSS (Style Sheet Language)   | Tailwind CSS (CSS Framework)      |                                  |
|                                  |                              |                                   |                                  |
| **UIライブラリ／フレームワーク** | React (UI Library)           | TanStack Start (React Framework)  | TanStack Router (Router)         |
|                                  | lucide-react (Icon Library)  |                                   |                                  |
|                                  |                              |                                   |                                  |
| **ビルド・実行環境**             | Vite (Build Tool)            | Cloudflare Workers (Runtime)      | Wrangler (Deployment CLI)        |
|                                  |                              |                                   |                                  |
| **データベース**                 | Turso (libSQL Database)      | @libsql/client (DB Client)        | Drizzle ORM (ORM)                |
|                                  | drizzle-kit (Migration Tool) | drizzle-seed (Seed Tool)          | Cloudflare R2 (Object Storage)   |
|                                  | Better Auth (Authentication) |                                   |                                  |
|                                  |                              |                                   |                                  |
| **開発ツール／ユーティリティ**   | pnpm (Package Manager)       | Turborepo (Monorepo Task Runner)  | oxlint (Linter)                  |
|                                  | oxfmt (Formatter)            | VSCode (Code Editor)              | GitHub Actions (CI/CD)           |

## Workspace

- `apps/app`: TanStack Start アプリケーション
- `packages/db`: DB client、業務 schema、Drizzle migration runner
- `packages/auth`: Better Auth 設定、auth schema、auth client

## Setup

### 1. Install dependencies

```sh
pnpm install
```

### 2. Create `.env`

`.env.template` をコピーして `.env` を作成し、必要な値を設定してください。

```sh
cp .env.template .env
```

主な設定値:

```env
# Better Auth
ENABLE_AUTH="true"
APP_BASE_URL="http://localhost:3000"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="<32文字以上のランダム文字列>"

# Turso
TURSO_DATABASE_URL="libsql://<your-database>.turso.io"
TURSO_AUTH_TOKEN="<your-auth-token>"

# Cloudflare R2
R2_BUCKET_NAME="<bucket-name>"
R2_BUCKET_URL="<public-bucket-url>"
R2_ACCESS_KEY="<access-key-id>"
R2_SECRET_KEY="<access-key-secret>"
R2_ENDPOINT="<s3-api-endpoint>"
```

`BETTER_AUTH_SECRET` は 32 文字以上を推奨します。例:

```sh
openssl rand -base64 32
```

### 3. Create symbolic links

この repo では各 package が `dotenv/config` で `.env` を読むため、使用する package 配下にも `.env` のシンボリックリンクが必要です。

以下のディレクトリでそれぞれ実行してください。

- `apps/app`
- `packages/db`
- `packages/auth`

```sh
ln -s ../../.env ./.env
```

### 4. Turso

Turso でデータベースを作成し、接続情報を `.env` に設定してください。

```env
TURSO_DATABASE_URL="libsql://<your-database>.turso.io"
TURSO_AUTH_TOKEN="<your-auth-token>"
```

初期テーブル作成と seed は以下です。

```sh
pnpm -F db generate
pnpm -F db migrate
pnpm -F db seed
```

`ENABLE_AUTH` の値によって migration 対象が変わります。

- `ENABLE_AUTH="true"`: `packages/db/src/schema.ts` と `packages/auth/src/schema.ts` の両方を対象にします
- `ENABLE_AUTH="false"`: `packages/db/src/schema.ts` だけを対象にします

`.env` を書き換えずに一時的に切り替えたい場合は、環境変数を前置して実行できます。

```sh
ENABLE_AUTH=false pnpm -F db generate
ENABLE_AUTH=false pnpm -F db migrate
```

## Better Auth

### Runtime toggle

`ENABLE_AUTH` は migration だけでなく runtime にも効きます。

- `ENABLE_AUTH="true"`: `/api/auth/*` が有効
- `ENABLE_AUTH="false"`: `/api/auth/*` は `404` と `AUTH_DISABLED` を返す

### Server configuration

Better Auth のサーバー設定は [packages/auth/src/lib/auth.ts](./packages/auth/src/lib/auth.ts) にあります。

現在の設定:

- Drizzle adapter で Turso を使用
- `emailAndPassword` を有効化
- `BETTER_AUTH_URL` を `baseURL` に使用
- `better-auth/tanstack-start` の cookie plugin を使用
- OAuth 資格情報が env に存在する provider だけ自動で有効化

server 側では次を import します。

```ts
import { auth } from '@packages/auth/auth'
```

### Client configuration

Better Auth のクライアント設定は [packages/auth/src/lib/auth-client.ts](./packages/auth/src/lib/auth-client.ts) にあります。

React 側では次を import します。

```ts
import { authClient } from '@packages/auth/auth-client'
```

### Route handler

API route は [apps/app/src/routes/api/auth/$.ts](./apps/app/src/routes/api/auth/$.ts) にあります。TanStack Start では `/api/auth/*` をこの route で処理します。

### Supported OAuth providers

以下の provider は `*_CLIENT_ID` と `*_CLIENT_SECRET` が両方ある場合のみ有効になります。

- Apple
- Discord
- Facebook
- GitHub
- GitLab
- Google
- LinkedIn
- Microsoft
- Slack
- Spotify
- Twitch
- X

たとえば GitHub を有効にする場合:

```env
GITHUB_CLIENT_ID="<github-client-id>"
GITHUB_CLIENT_SECRET="<github-client-secret>"
```

## Cloudflare

### R2

R2 バケットを作成し、`.env` に設定してください。CORS には開発用として少なくとも `http://localhost:3000` を追加します。`PUT` を使う場合は `GET`, `HEAD`, `PUT` を許可してください。

例:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3001"
    ],
    "AllowedMethods": [
      "GET",
      "HEAD",
      "PUT"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

### Wrangler

[apps/app/wrangler.jsonc](./apps/app/wrangler.jsonc) の以下は作成するアプリケーションに合わせて調整してください。

- `name`
- `services.service`
- `r2_buckets.bucket_name`

## Development

```sh
pnpm dev
```

アプリ単体で起動する場合:

```sh
pnpm -F app dev
```

## Deploy

デプロイは `main` へのマージをトリガーに自動で実行されます。事前に `.env` を用意したうえで、Cloudflare の secret を次回デプロイ向けに登録してください。

```sh
pnpm -F app cf:set-env
```

このコマンドは `wrangler versions secret put` を使うため、その場では本番反映されず、`main` マージ後の自動デプロイで反映されます。
