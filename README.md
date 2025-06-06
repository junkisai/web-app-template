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
