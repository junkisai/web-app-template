---
title: 管理画面
scope: [apps/admin]
design_docs:
  - ../design-docs/20260828_admin-app-astryx.md
---

## 概要

`apps/admin` は、プロダクト側（`apps/app`）とは別のアプリとして置く管理画面。今の画面はユーザー一覧の 1 枚だけで、**認証も認可も無い。**

## 対象

| アプリ | URL | 画面 |
| --- | --- | --- |
| `apps/admin` | `/` | ユーザー一覧（[ユーザー一覧の spec](users.md)） |

## 振る舞い

- **プロダクト側とは別のアプリ・別の Worker として配る。** 管理画面のコードを一般の利用者に配らないため、また片方のデプロイでもう片方が落ちないようにするため（[20260828_admin-app-astryx.md](../design-docs/20260828_admin-app-astryx.md)）。Worker の名前は `apps/app` と重ねない（ルートの [README.md](../../README.md#wrangler)）
- **誰でも見られる。** 認証も認可も入っていない（[apps/admin/README.md](../../apps/admin/README.md#まだ無いもの)）
- **検索エンジンに載せない。** 全ページの head に `robots: noindex, nofollow` を出す（`apps/admin/src/routes/__root.tsx` のコメント「管理画面は検索結果に出す意味がない」）
- **配色は OS の設定に従って light / dark が切り替わる**（`apps/admin/src/lib/astryx-provider.tsx` のコメント）
- **画面の中のリンクは、遷移のたびにページ全体を読み直す。** クライアント側の遷移にはなっていない（[apps/admin/README.md](../../apps/admin/README.md#まだ無いもの)）

## 制約

- **管理画面として運用に乗せる前に、認証・認可を必ず入れる**（[20260828_admin-app-astryx.md](../design-docs/20260828_admin-app-astryx.md) の「やらないこと」）
- **`apps/app` と画面を共有しない。** 両方が欲しがるものが出たら `packages/` へ出す。正本は [architecture/directory-structure.md](../architecture/directory-structure.md#入口が増えたとき)

## 受け入れ条件

- [ ] `apps/admin` のどのページにも `noindex, nofollow` の robots メタタグが出ている
- [ ] `apps/admin` の Worker の名前が `apps/app` と重なっていない

## 実装から読み取れる現状

**ここに書いたものは仕様ではない。** コードにそうなっているだけで、意図は確かめられていない。変える前に確認する。

- 画面の文言は日本語（`apps/app` は英語）
- `apps/admin/wrangler.jsonc` は `preview_urls: true` で、`secrets` を持たない

## 未確認事項

- **認証・認可をいつ・どの方式で入れるか。** `@packages/auth` は `apps/app` にだけ配線されていて、`apps/admin` は依存していない
- **今 Cloudflare 上にデプロイされているか、外から届くか。** [apps/admin/README.md](../../apps/admin/README.md#まだ無いもの) は「Cloudflare へのデプロイ」を「まだ無いもの」に挙げ、「`wrangler.jsonc` の `name` は TODO のまま」と書いている。一方で `name` には `web-app-template-admin` が入っていて、ルートの README は `main` へのマージで自動デプロイされると書いている。**認証が無いまま外から届く状態になっていると、ユーザー一覧が誰にでも見える。** 実際の状態を確かめる必要がある

## 関連

- design doc: [20260828_admin-app-astryx.md](../design-docs/20260828_admin-app-astryx.md)
- architecture: [overview.md](../architecture/overview.md)、[directory-structure.md](../architecture/directory-structure.md)
- Astryx の使い方: [apps/admin/README.md](../../apps/admin/README.md)
