# web-app-template

| Kind        |                           |                           |
| ----------- | ------------------------- | ------------------------- |
| **app**     | Astro                     | React                     |
|             | Panda CSS                 | destyle.css               |
|             | Prisma (ORM)              | Astro                     |
|             |                           | Astro                     |

| Kind        |                           |                         |                               |
| ----------- | ------------------------- | ----------------------- | ----------------------------- |
| **app**     | Next.js (Framework)       | Tailwind CSS (CSS)      |                               |
|             | React Hook Form (Form)    | Zod (Schema Validator)  |                               |
|             | Prisma (ORM)              | NextAuth.js (Auth)      | OpenTelemetry (Observability) |
|             |                           |                         |                               |
| **Tools**   | TypeScript (Language)     | pnpm (Package Manager)  | NVM (Node Version manager)    |
|             | Biome (Linter, Formatter) | Prettier (Formatter)    |                               |
|             | lint-staged (Pre Commit)  | Docker Compose (Docker) |                               |
|             |                           |                         |                               |
| **Testing** | Vitest (Test Runner)      | Testing Library (React) | Playwright (E2E Testing)      |
|             |                           |                         |                               |
| **Others**  | GitHub Workflows (CI)     | Renovate (Deps Manager) | .vscode (Editor)              |

## Setup

### Install dependencies

```sh
pnpm install
```

### Setup wrangler db

まずwranglerログインをして、CloudflareをCLIベースで操作でるようにします。

```sh
cd apps/api && pnpm dlx wrangler login
```

次に、下記コマンドを実行し、D1 SQLデータベースを作成します。
`XXX`はデータベース名になります。

```sh
pnpm dlx wrangler d1 create XXX
```

作成に成功すると、以下のような設定ファイルが出力されるため、`wrangler.toml`内に追記します。

```toml
[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "XXXXX"
database_id = "XXX-XXX-XXX-XXX"
migrations_dir = "migrations"
```

## Development

```sh
# api
pnpm api dev

# app
pnpm app dev

# admin
pnpm admin dev
```
