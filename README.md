# web-app-template

| Kind                             |                                    |                                   |                                  |
| -------------------------------- | ---------------------------------- | --------------------------------- | -------------------------------- |
| **言語・マークアップ**           | TypeScript (Language)              | HTML (Markup)                     |                                  |
|                                  |                                    |                                   |                                  |
| **スタイル・デザイン**           | CSS (Style Sheet Language)         | StyleX (CSS-in-JS)                | Astryx (Design System)           |
|                                  |                                    |                                   |                                  |
| **UIライブラリ／フレームワーク** | React (UI Library)                 | TanStack Start (React Framework)  | TanStack Router (Router)         |
|                                  | @tabler/icons-react (Icon Library) |                                   |                                  |
|                                  |                                    |                                   |                                  |
| **ビルド・実行環境**             | Vite (Build Tool)                  | Cloudflare Workers (Runtime)      | Wrangler (Deployment CLI)        |
|                                  |                                    |                                   |                                  |
| **データベース**                 | Turso (libSQL Database)            | @libsql/client (DB Client)        | Drizzle ORM (ORM)                |
|                                  | drizzle-kit (Migration Tool)       | drizzle-seed (Seed Tool)          | Cloudflare R2 (Object Storage)   |
|                                  | Better Auth (Authentication)       |                                   |                                  |
|                                  |                                    |                                   |                                  |
| **開発ツール／ユーティリティ**   | pnpm (Package Manager)             | Turborepo (Monorepo Task Runner)  | oxlint (Linter)                  |
|                                  | oxfmt (Formatter)                  | knip (Unused Code Detector)       | VSCode (Code Editor)             |

## Workspace

- `apps/app`: TanStack Start アプリケーション
- `apps/admin`: 管理画面。同じく TanStack Start で、UI は [Astryx](https://astryx.atmeta.com/docs/getting-started) のコンポーネントで組みます（[apps/admin/README.md](./apps/admin/README.md)）

ディレクトリ構成と置き場所の規約は [docs/architecture/20260819_directory-structure.md](./docs/architecture/20260819_directory-structure.md) にあります。要約は [AGENTS.md](./AGENTS.md) にあり、`CLAUDE.md` はそのシンボリックリンクです。編集するのは `AGENTS.md` の側です。機能を追加・変更するときは、実装の前に [docs/design-docs/](./docs/design-docs/README.md) に design doc を書きます。
- `packages/db`: DB client、業務 schema、Drizzle migration runner
- `packages/auth`: Better Auth 設定、auth schema、auth client
- `packages/env`: 環境変数の schema と検証済みの `env`

## Setup

### 1. Install dependencies

```sh
pnpm install
```

`pnpm install` すると lefthook 自身の `postinstall` が Git フックをインストールします。フックの内容は [lefthook.yml](./lefthook.yml) にあります。`pnpm-workspace.yaml` の `allowBuilds` に `lefthook: true` があるのはこのためで、外すとフックが有効になりません。

| フック | 実行内容 |
| --- | --- |
| pre-commit | ステージ済みの JS/TS に `oxlint --fix` と `oxfmt` をかけ、修正結果を自動でステージし直します |
| pre-push | `pnpm lint`（`tsc --noEmit`・`oxlint`・`knip`）を実行し、エラーがあれば push を中断します |

フックを一時的に飛ばしたいときは `LEFTHOOK=0 git commit` のように環境変数を付けます。

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

`.env` は `packages/env` が `dotenv/config` で読みますが、dotenv はコマンドを実行したディレクトリの `.env` を探します。そのため、コマンドを実行する package 配下にも `.env` のシンボリックリンクが必要です。

以下のディレクトリでそれぞれ実行してください。

- `apps/app`
- `apps/admin`
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

## Environment variables

環境変数は [packages/env/src/index.ts](./packages/env/src/index.ts) の schema で検証します。検証には [T3 Env](https://env.t3.gg/) と [valibot](https://valibot.dev/) を使います。

アプリケーションのコードから `process.env` を直接読まず、検証済みの `env` を import してください。

```ts
import { env } from '@packages/env'

env.TURSO_DATABASE_URL // string
env.ENABLE_AUTH // boolean
```

- 検証は `env` を最初に import した時点で走り、欠けている値と形式が不正な値をまとめて報告します
- 必須は `TURSO_DATABASE_URL` と `TURSO_AUTH_TOKEN` の 2 つで、それ以外は任意です
- 空文字は未設定として扱います
- `ENABLE_AUTH` は `1` / `true` / `yes` / `on` と `0` / `false` / `no` / `off` を受け付けます。未設定なら `true`、それ以外の文字列はエラーです

変数を増やすときは `.env.template` と schema の両方に追加します。schema にないキーは `env` から読めません。

`SKIP_ENV_VALIDATION` を立てると検証を飛ばして生の値を返します。`pnpm lint` の knip がこれを使っていて、`.env` の無い環境でも lint が通ります。アプリの実行時には使いません。

ブラウザに渡す値はこの package には置きません。`packages/env` は drizzle-kit や tsx からも読まれるため `process.env` だけを参照します。`VITE_` プレフィックスの値を使う場合は、`import.meta.env` を `runtimeEnv` にした env を `apps/app` 側に別途定義してください。

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

[apps/app/wrangler.jsonc](./apps/app/wrangler.jsonc) と [apps/admin/wrangler.jsonc](./apps/admin/wrangler.jsonc) の以下は作成するアプリケーションに合わせて調整してください。2 つの app は別々の Worker としてデプロイするため、`name` は重複させないでください。

- `name`
- `services.service`
- `r2_buckets.bucket_name`

## Development

```sh
pnpm dev
```

`pnpm dev` は 2 つの app を同時に起動します。`apps/app` が 3000、`apps/admin` が 3001 を使います。

アプリ単体で起動する場合:

```sh
pnpm -F app dev       # http://localhost:3000
pnpm -F admin dev     # http://localhost:3001
```

## Agent config sync

このプロジェクトの `.claude` / `.agent` / `.agents` / `.codex` は、`junkisai/web-app-template` を source of truth として同期します。

### 同期方法

GitHub Actions の `Sync agent config` workflow により、毎週月曜に自動で同期 PR が作成されます。

手動で同期したい場合は、GitHub Actions から `Sync agent config` を `workflow_dispatch` で実行してください。

ローカルで同期したい場合は以下を実行します。

```sh
pnpm sync:agents
```

### 注意

同期対象ディレクトリは `web-app-template` 側の内容で完全同期されます。

そのため、各プロジェクト側で `.claude` / `.agent` / `.agents` / `.codex` に独自ファイルを追加していた場合、次回同期時に削除されます。

共通設定を変更したい場合は、派生プロジェクトではなく `web-app-template` 側に反映してください。

## Deploy

デプロイは `main` へのマージをトリガーに自動で実行されます。事前に `.env` を用意したうえで、Cloudflare の secret を次回デプロイ向けに登録してください。

```sh
pnpm -F app cf:set-env
```

このコマンドは `wrangler versions secret put` を使うため、その場では本番反映されず、`main` マージ後の自動デプロイで反映されます。
