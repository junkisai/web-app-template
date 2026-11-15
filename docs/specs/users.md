---
title: ユーザー一覧
scope: [apps/app, apps/admin, packages/db]
design_docs:
  - ../design-docs/20260828_admin-app-astryx.md
  - ../design-docs/20260906_db-turso-to-cloudflare-d1.md
---

## 概要

`apps/app` と `apps/admin` のトップ（`/`）は、登録されているユーザーを一覧で表示する。元データは D1 の `users` テーブル。今は読み取りだけで、画面からユーザーを作ったり変えたりはできない。

## 対象

| アプリ | URL | 画面 |
| --- | --- | --- |
| `apps/app` | `/` | トップ（`screens/top/`）。一覧はページの一部 |
| `apps/admin` | `/` | ユーザー一覧（`screens/user-list/`） |

## 振る舞い

- **両アプリの `/` は、`users` テーブルのユーザーを一覧で出す。** 両アプリは同じ D1 を指すので、Cloudflare 上では同じユーザーが出る（ローカルでは state がアプリごとに分かれる。[architecture/overview.md のデータベース](../architecture/overview.md#データベース)）
- **`apps/admin` の一覧は表で出す。** 管理画面の 1 枚目として置いた画面
- **一覧は読み取りだけ。** 作成・編集・削除の画面は無い。これは「この先もやらない」と決めたものではなく、管理画面を作ったときに後回しにしたもの（[20260828_admin-app-astryx.md](../design-docs/20260828_admin-app-astryx.md) の「やらないこと」）

### ユーザーの持つ情報

`users` テーブルの 1 行が 1 人のユーザー。正本は [`packages/db/src/schema.ts`](../../packages/db/src/schema.ts)。

| 項目 | 列 | 必須 |
| --- | --- | --- |
| ID | `id` | 主キー |
| 名前 | `name` | 必須 |
| 登録日時 | `created_at` | 必須 |
| 更新日時 | `updated_at` | 必須 |

## 制約

- **画面は DB の型をそのまま受け取らない。** 一覧に渡す型は各アプリの `features/users/types/user.ts` で受け直す。これは構成の規約で、正本は [architecture/directory-structure.md](../architecture/directory-structure.md#packages-の扱い)

## 受け入れ条件

- [ ] `users` テーブルに入っているユーザーが、`apps/app` の `/` と `apps/admin` の `/` の両方に出る
- [ ] 一覧の画面から、ユーザーの作成・編集・削除ができない

## 実装から読み取れる現状

**ここに書いたものは仕様ではない。** コードにそうなっているだけで、意図は確かめられていない。変える前に確認する。

- **`apps/app` の `/`** は名前だけを縦に並べる。0 件のときの案内は出さない
- **`apps/admin` の `/`** は見出し「ユーザー」と「登録済みのユーザーが N 件あります。」を出し、表の列は ID・名前・登録日時・更新日時。日時は `ja-JP` の表記・`Asia/Tokyo` で出し、日時として読めない値はそのまま出す。0 件のときは「ユーザーがいません」と、seed を流すかアプリ側から作るよう促す案内を出す
- **並び順とページングは無い。** 全件を取り、並べ替えの指定もしていない（`features/users/api/get-users.ts`）
- **読み込みに失敗したとき**は、例外をログに出してそのまま投げる。画面側に専用のエラー表示は無い
- **seed のデータ**は `Alice` の 1 行（`packages/db/seed.sql`）

## 未確認事項

- **ログインで作ったアカウントは一覧に出ない。** 一覧が読むのは業務側の `users`（`packages/db`）で、`/login` でアカウントを作ると書き込まれるのは認証側の `user`（`packages/auth`）。2 つのテーブルを別のものとして扱うのか、いずれ結び付けるのかは決まっていない。`apps/admin` の 0 件の案内は「アプリ側からユーザーを作成してください」と言っているが、今の実装では作っても一覧には出ない
- **日時の形式が決まっていない。** 表示側のコメントは ISO 8601 を前提にしているが、seed の `created_at` は `2026-03-25T17:49:50.847Z`、`updated_at` は `2026-03-25 18:57:39` と形式が違う
- **並び順・件数の上限・ページングの要件**が決まっていない
- **読み込みに失敗したときに何を見せるか**が決まっていない

## 関連

- design doc: [20260828_admin-app-astryx.md](../design-docs/20260828_admin-app-astryx.md)（`apps/admin` の一覧を作ったとき）、[20260906_db-turso-to-cloudflare-d1.md](../design-docs/20260906_db-turso-to-cloudflare-d1.md)（元データを D1 に移したとき）
- architecture: [overview.md のデータベース](../architecture/overview.md#データベース)、[directory-structure.md](../architecture/directory-structure.md)
- runbook: [d1-migrations.md](../runbooks/d1-migrations.md)（migration と seed の当て方）
