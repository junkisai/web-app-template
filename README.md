# web-app-template

| Kind                             |                                    |                                   |                                  |
| -------------------------------- | ---------------------------------- | --------------------------------- | -------------------------------- |
| **言語・マークアップ**           | TypeScript (Language)              | HTML (Markup)                     |                                  |
|                                  |                                    |                                   |                                  |
| **スタイル・デザイン**           | CSS (Style Sheet Language)         | StyleX (CSS-in-JS)                | Astryx (Design System)           |
|                                  |                                    |                                   |                                  |
| **UIライブラリ／フレームワーク** | React (UI Library)                 | TanStack Start (React Framework)  | TanStack Router (Router)         |
|                                  | reicon-react (Icon Library)        |                                   |                                  |
|                                  |                                    |                                   |                                  |
| **ビルド・実行環境**             | Vite (Build Tool)                  | Cloudflare Workers (Runtime)      | Wrangler (Deployment CLI)        |
|                                  |                                    |                                   |                                  |
| **データベース**                 | Cloudflare D1 (SQLite Database)    | Drizzle ORM (ORM)                 | drizzle-kit (Migration Tool)     |
|                                  | Cloudflare R2 (Object Storage)     | Better Auth (Authentication)      |                                  |
|                                  |                                    |                                   |                                  |
| **開発ツール／ユーティリティ**   | pnpm (Package Manager)             | Turborepo (Monorepo Task Runner)  | oxlint (Linter)                  |
|                                  | oxfmt (Formatter)                  | knip (Unused Code Detector)       | VSCode (Code Editor)             |

## Workspace

- `apps/app`: TanStack Start アプリケーション
- `apps/admin`: 管理画面。同じく TanStack Start で、UI は [Astryx](https://astryx.atmeta.com/docs/getting-started) のコンポーネントで組みます（[apps/admin/README.md](./apps/admin/README.md)）
- `packages/db`: D1 binding から作る DB client、業務 schema、migration と seed の定義
- `packages/auth`: Better Auth 設定、auth schema、auth client
- `packages/env`: 環境変数の schema と検証済みの `env`

## Docs

ドキュメントの地図は [docs/README.md](./docs/README.md) にあります。

| 知りたいこと | 場所 |
| --- | --- |
| このテンプレートの目的・対象・提供価値 | [docs/product.md](./docs/product.md) |
| 機能ごとの目的・要件・今の振る舞い | [docs/prds/](./docs/prds/README.md) |
| アプリ・パッケージの関係と技術構成 | [docs/architecture/overview.md](./docs/architecture/overview.md) |
| ディレクトリ構成と置き場所の規約 | [docs/architecture/directory-structure.md](./docs/architecture/directory-structure.md) |
| 操作・運用の手順 | [docs/runbooks/](./docs/runbooks/) |

規約の要約とエージェント向けの運用ルールは [AGENTS.md](./AGENTS.md) にあり、`CLAUDE.md` はそのシンボリックリンクです。編集するのは `AGENTS.md` の側です。ドキュメントには今の状態だけを書き、なぜその形にしたか・採らなかった案は PR の本文とコミットに書きます（[AGENTS.md の「判断の理由を残す」](./AGENTS.md#判断の理由を残す)）。実装が入ったら、同じ PR で PRD と architecture（手順が変われば runbooks、プロダクト全体の目的が変われば product.md も）を更新します。

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

### 4. Cloudflare D1

データベースは Cloudflare D1 です。接続情報は env ではなく Worker の binding で渡すため、`.env` には何も足しません。

Cloudflare 上にデータベースを作ります。**場所を選べるのは作るときだけ**なので、`--location apac` を付けます（[手順と理由](docs/runbooks/create-d1.md)）。

```sh
pnpm -F app exec wrangler d1 create <your-database> --location apac
```

出力された `database_name` と `database_id` を、`apps/app/wrangler.jsonc` と `apps/admin/wrangler.jsonc` の `d1_databases` に書きます。**両アプリで同じ値を指してください。** `binding` の `DB` は `packages/db` が名前で引くので変更しません。

migration の SQL を作り、ローカルのデータベースに当てて seed します。ローカルの状態はアプリごとに分かれているので、`apps/admin` を動かすときはそちらでも当ててください。

```sh
pnpm -F db generate
pnpm -F app db:migrate
pnpm -F app db:seed
pnpm -F admin db:migrate
pnpm -F admin db:seed
```

Cloudflare 上のデータベースに当てる方法、`ENABLE_AUTH` で生成の対象が変わること、seed を流すときの注意は [docs/runbooks/d1-migrations.md](docs/runbooks/d1-migrations.md) にあります。

**D1 では `db.transaction()` が使えません。** 複数の文をまとめたいときは `db.batch()` を使います（[docs/architecture/overview.md](docs/architecture/overview.md#使えないもの)）。

## Environment variables

環境変数は [packages/env/src/index.ts](./packages/env/src/index.ts) の schema で検証します。アプリケーションのコードから `process.env` を直接読まず、検証済みの `env` を import してください。

```ts
import { env } from '@packages/env'
```

検証の規則（必須の値・既定値・受け付ける値）、変数の増やし方、ブラウザに渡す値の扱いは [docs/architecture/overview.md の環境変数](./docs/architecture/overview.md#環境変数)にあります。

## Better Auth

認証の要件と振る舞い（認証の有効・無効、メールとパスワード、対応している OAuth provider）は [docs/prds/auth.md](./docs/prds/auth.md) に、設定ファイルの場所・import の仕方・OAuth の環境変数の名前は [docs/architecture/overview.md の認証](./docs/architecture/overview.md#認証)にあります。

### OAuth provider を有効にする

provider ごとに `*_CLIENT_ID` と `*_CLIENT_SECRET` の両方を `.env` に書くと、その provider が有効になります。たとえば GitHub を有効にする場合:

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

## Deploy

デプロイは `main` へのマージをトリガーに自動で実行されます。事前に、Cloudflare の secret を次回デプロイ向けに登録してください。

```sh
pnpm -F app cf:set-env
```

このコマンドは `apps/app/wrangler.jsonc` の `secrets.required` に並ぶキーだけを、`apps/app` から見た `.env.production` から読んで登録します（`apps/app/package.json` の script が引数で渡しています）。`wrangler versions secret put` を使うため、その場では本番反映されず、`main` マージ後の自動デプロイで反映されます。

D1 を新しく作ったときは、デプロイの前にリモートの D1 へ migration を当ててください（[docs/runbooks/d1-migrations.md](docs/runbooks/d1-migrations.md)）。
