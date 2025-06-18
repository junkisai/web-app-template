# web-app-template

| Kind                             |                              |                                   |                                  |
| -------------------------------- | ---------------------------- | --------------------------------- | -------------------------------- |
| **言語・マークアップ**           | TypeScript (Language)        | HTML (Markup)                     |                                  |
|                                  |                              |                                   |                                  |
| **スタイル・デザイン**           | CSS (Style Sheet Language)   | Panda CSS (CSS Framework)         |                                  |
|                                  |                              |                                   |                                  |
| **UIライブラリ／フレームワーク** | React (UI Library)           | Next.js (React Framework)         | lucide-react (Icon Library)      |
|                                  |                              |                                   |                                  |
| **バックエンド／クラウドサービス** | Prisma (ORM)                 | PostgreSQL (Database)             | Cloudflare R2 (Object Storage)   |
|                                  |                              |                                   |                                  |
| **開発ツール／ユーティリティ**   | Biome (Linter/Formatter)     | VSCode (Code Editor)              | GitHub Actions (CI/CD)           |

## Setup

### Prisma Postgres

[Prisma Postgresの管理画面](https://console.prisma.io/cm2k2bkw6033kz4nm3p680ptx/overview)にいき、プロジェクトを作成してください。
プロジェクトを作成すると`DATABASE_URL`が発行されるので、`.env`ファイルに値をセットしてください。

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

### Auth0

アプリケーションを新規作成して、発行された環境変数を`.env`ファイルにセットしてください。

- AUTH0_DOMAIN
- AUTH0_CLIENT_ID
- AUTH0_CLIENT_SECRET

`AUTH0_SECRET`は`.env.template`に記載されているコマンドを実行することで得られる値をセットしてください。

次に、アプリケーションのSettingsメニューからコールバックURLを設定します。
本番環境のURLも登録する必要があります。

**Allowed Callback URLs**

```txt
http://localhost:3001/auth/callback, https://XXX.YYY.workers.dev/auth/callback
```

**Allowed Logout URLs**

```txt
http://localhost:3001, http://localhost:3001/auth/logout, https://XXX.YYY.workers.dev, https://XXX.YYY.workers.dev/auth/logout
```

### シンボリックリンクを作成

以下のディレクトリでシンボリックリンクを作成してください。

- apps/app
- apps/admin
- packages/db

```sh
ln -s ../../.env ./.env
```

### Install dependencies

```sh
pnpm install
```

## Development

```sh
pnpm dev
```
