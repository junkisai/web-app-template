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
|                                  |                              |                                   |                                  |
| **開発ツール／ユーティリティ**   | pnpm (Package Manager)       | Turborepo (Monorepo Task Runner)  | oxlint (Linter)                  |
|                                  | oxfmt (Formatter)            | VSCode (Code Editor)              | GitHub Actions (CI/CD)           |

## Setup

### Turso

Turso でデータベースを作成し、接続情報を `.env` に設定してください。

```env
TURSO_DATABASE_URL="libsql://<your-database>.turso.io"
TURSO_AUTH_TOKEN="<your-auth-token>"
```

初期テーブル作成と seed は以下を実行します。

```sh
pnpm -F db migrate
pnpm -F db seed
```

### Cloudflare

[APIトークン](https://dash.cloudflare.com/7f1a98e6d518e869f7dbe928287cf37b/api-tokens)を作成します。
APIトークン テンプレートの「Cloudflare Workers を編集する」を選択し、発行されたAPIトークンを`.env`ファイルにセットしてください。

つぎにR2バケットを作成します。
[R2オブジェクトストレージ](https://dash.cloudflare.com/7f1a98e6d518e869f7dbe928287cf37b/r2/overview)に移動し、アプリケーション名と同じ名前でバケットを作成します。

最後に[apps/app/wrangler.jsonc](./apps/app/wrangler.jsonc)ファイルの中身の一部を作成するアプリケーション名に差し替えます。

- **name**
- **services.service**
- **r2_buckets.bucket_name**

### Cloudflare R2 環境変数

R2 バケットを作成したら、ダッシュボードの **S3 API** タブから発行される値を確認し、`.env` に設定します。
`.env.template` に記載されている以下の変数を置き換えてください。

```env
NEXT_PUBLIC_R2_BUCKET_NAME="<作成したバケット名>"
NEXT_PUBLIC_R2_BUCKET_URL="<パブリックバケット URL>"
NEXT_PUBLIC_R2_ACCESS_KEY="<Access Key ID>"
NEXT_PUBLIC_R2_SECRET_KEY="<Access Key Secret>"
NEXT_PUBLIC_R2_ENDPOINT="<S3 API エンドポイント>"
```

#### CORS の設定

R2 のバケット設定画面から **CORS** を有効にし、アプリで利用するドメインを許可してください。開発用に `http://localhost:3000` と `http://localhost:3001` を追加します。許可するメソッドは `GET`, `HEAD`, `PUT` を指定します。以下は開発環境向けの例です。Workers にデプロイして `https://<service>.workers.dev` やカスタムドメインを利用する場合は、それらの URL も `AllowedOrigins` に追加してください。

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

### Auth.js

`AUTH_SECRET`は`.env.template`に記載されているコマンドを実行することで得られる値をセットしてください。

### シンボリックリンクを作成

以下のディレクトリでシンボリックリンクを作成してください。

- apps/app
- packages/db

```sh
ln -s ../../.env ./.env
ln -s ../../.env.production ./.env.production
```

### Install dependencies

```sh
pnpm install
```

## Development

```sh
pnpm dev
```
