---
title: 管理画面
scope: [apps/admin]
design_docs:
  - ../design-docs/20260828_admin-app-astryx.md
---

## 概要

`apps/admin` は、プロダクト側（`apps/app`）とは別のアプリとして置く管理画面。今の画面はユーザー一覧の 1 枚だけ。**今は認証も認可も入っておらず、外部に公開して運用する前に入れる必要がある。**

## 対象

| アプリ | URL | 画面 |
| --- | --- | --- |
| `apps/admin` | `/` | ユーザー一覧（[ユーザー一覧の spec](users.md)） |

## 振る舞い

- **検索エンジンに載せない。** 全ページの head に `robots: noindex, nofollow` を出す（`apps/admin/src/routes/__root.tsx` のコメント「管理画面は検索結果に出す意味がない」）
- **配色は OS の設定に従って light / dark が切り替わる**（`apps/admin/src/lib/astryx-provider.tsx` のコメント）

## 制約

- **外部に公開して運用する前に、認証・認可を必ず入れる**（[20260828_admin-app-astryx.md](../design-docs/20260828_admin-app-astryx.md) の「やらないこと」）。`noindex` は検索結果に載せないための指定で、アクセス制御にはならない
- **管理画面のコードを、プロダクト側（`apps/app`）の利用者に配らない。** 管理画面はプロダクト側とは別に配信する。どう分けているか（別のアプリ・別の Worker）は [architecture/overview.md](../architecture/overview.md#全体像) にある

## 受け入れ条件

- `apps/admin` のどのページにも `noindex, nofollow` の robots メタタグが出ている
- `apps/app` の URL から、管理画面の画面には届かない

## 実装から読み取れる現状

**ここに書いたものは仕様ではなく、今そう動いているという記録。** 変更を禁じる制約でもない。変更を頼まれたら、その要求を新しい判断の起点にする（[扱い](README.md#実装から読み取れる現状の扱い)）。

- **認証・認可が無い。** `/` の `loader`（`apps/admin/src/routes/index.tsx`）は、認証を確かめずに `getUsers()` を呼び、D1 のユーザー一覧を返す。外から届く場所にデプロイすると、誰でもユーザー一覧を見られる。管理画面を作ったときに後回しにしたもので、保ち続ける状態ではない（[20260828_admin-app-astryx.md](../design-docs/20260828_admin-app-astryx.md)、[apps/admin/README.md](../../apps/admin/README.md#まだ無いもの)）
- **画面の中のリンクは、遷移のたびにページ全体を読み直す。** Astryx の `LinkProvider` を設定していないため（[apps/admin/README.md](../../apps/admin/README.md#まだ無いもの)）
- 画面の文言は日本語（`apps/app` は英語）
- `apps/admin/wrangler.jsonc` は `preview_urls: true` で、`secrets` を持たない

## 未確認事項

- **認証・認可をいつ・どの方式で入れるか。** `@packages/auth` は `apps/app` にだけ配線されていて、`apps/admin` は依存していない
- **デプロイの扱い。** 2026-11-15 に確かめたところ、`apps/app`（`web-app-template`）がデプロイされている Cloudflare アカウントに `web-app-template-admin` という Worker は無く、管理画面は公開されていなかった。[apps/admin/README.md](../../apps/admin/README.md#まだ無いもの) も「Cloudflare へのデプロイ」を「まだ無いもの」に挙げている。ただし `wrangler.jsonc` には `name` と `preview_urls: true` が入っていて、デプロイすればそのまま外から届く。認証を入れる前にデプロイが要るようになったとき、どう守るかは決まっていない

## 関連

- design doc: [20260828_admin-app-astryx.md](../design-docs/20260828_admin-app-astryx.md)
- architecture: [overview.md](../architecture/overview.md)（別のアプリ・別の Worker にしていること）、[directory-structure.md](../architecture/directory-structure.md)（`apps/app` と画面を共有しない規約）
- Astryx の使い方: [apps/admin/README.md](../../apps/admin/README.md)
