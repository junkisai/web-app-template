# D1 に migration と seed を当てる

schema から migration の SQL を作り、ローカルと Cloudflare 上の D1 に当てる手順。仕組みは [architecture/overview.md のデータベース](../architecture/overview.md#データベース)にある。

## いつ使うか

- 初めてセットアップするとき
- `packages/db/src/schema.ts` か `packages/auth/src/schema.ts` を変えたとき
- 新しい D1 を作ったとき（作り方は [create-d1.md](create-d1.md)）

## 前提

- ルートの `.env` と、`packages/db` などへのシンボリックリンクがある（ルートの [README.md](../../README.md) のセットアップ）。`pnpm -F db generate` は `.env` の `ENABLE_AUTH` を読む
- `apps/app/wrangler.jsonc` と `apps/admin/wrangler.jsonc` の `d1_databases` が、自分の D1 の `database_name` / `database_id` を指している

## 1. SQL を生成する

```sh
pnpm -F db generate
```

`packages/db/migrations/` に SQL を出すだけで、DB には触らない。

生成の対象は `ENABLE_AUTH` で変わる。

- `ENABLE_AUTH="true"`: `packages/db/src/schema.ts` と `packages/auth/src/schema.ts` の両方
- `ENABLE_AUTH="false"`: `packages/db/src/schema.ts` だけ

`.env` を書き換えずに一時的に切り替えるときは、環境変数を前に置く。

```sh
ENABLE_AUTH=false pnpm -F db generate
```

## 2. ローカルの D1 に当てる

```sh
pnpm -F app db:migrate
pnpm -F admin db:migrate
```

**ローカルの state はアプリごとに分かれている**（`apps/app/.wrangler/state` と `apps/admin/.wrangler/state`）。両方のアプリを動かすなら、両方に当てる。

## 3. Cloudflare 上の D1 に当てる

```sh
pnpm -F app db:migrate --remote
```

両アプリは同じ D1 を指しているので、どちらか一方から当てれば足りる。**デプロイの前に当てる。** リモートの D1 に migration が当たっていないと、デプロイが通っても画面がユーザーを引けずに落ちる。

## seed を流す

```sh
pnpm -F app db:seed
pnpm -F admin db:seed
```

`packages/db/seed.sql` を流す。中身は `users` の `Alice` 1 行。

**`seed.sql` は先頭で `DELETE FROM users;` を流す。** 何度流しても同じ状態になる代わりに、それまでの `users` の行は消える。Cloudflare 上に流すときは `--remote` を付けるが、**本物のデータが入った D1 には流さない。**

```sh
pnpm -F app db:seed --remote
```

## 確かめる

ローカルの D1 にユーザーが入ったかを見る。

```sh
pnpm -F app exec wrangler d1 execute DB --command "SELECT * FROM users"
```

`Alice` が返ればよい。Cloudflare 上を見るときは `--remote` を足す。

## 気をつけること

- **pnpm の後ろに `--` を挟まない。** `pnpm -F app db:migrate -- --remote` と書くと、`--` ごと script の引数として渡り、wrangler が `--remote` をオプションとして読まない
- **script には `--local` を固定していない。** wrangler 4 は `--local` も `--remote` も無いときにローカルへ当てる。`--remote` を足したときだけ Cloudflare 上に当たる
- **`drizzle-kit migrate` は使わない。** 適用は `wrangler d1 migrations apply` が受け持つ。`packages/db/drizzle.config.ts` は SQL の生成だけを担い、接続先を持たない
