# api

## 最初の1回のみ

はじめに`web-app-template`となっている箇所をリポジトリ名に変更してください。
また、`bunx wrangler login`を実行して、CloudflareをCLIベースで操作できるようにします。

次に `bunx wrangler d1 create XXXX`を実行し、`wrangler.toml`出力された情報に更新します。

```toml
[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "XXXXX"
database_id = "XXX-XXX-XXX-XXX"
migrations_dir = "migrations"
```

最後に`.env.sample`をコピーして`.env`ファイルを作成して、値を埋めます。

## Development

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.30. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
