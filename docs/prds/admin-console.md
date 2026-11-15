---
title: 管理画面
scope: [apps/admin]
design_docs:
  - ../design-docs/20260828_admin-app-astryx.md
---

## 概要・提供価値

`apps/admin` は、プロダクト側（`apps/app`）とは別に配信する管理画面。今の画面はユーザー一覧の 1 枚だけ。

テンプレートを使う開発者にとっては、**管理画面が必要になったときに、既成の部品で画面を足し始められる入口**になる。

**外部に公開して運用する前に、認証・認可を入れる必要がある。** 今は入っていない（実装から読み取れる現状）。

## 背景・解決する課題

- 管理画面は「作り込む価値が低いのに、部品の点数だけは多い」画面の代表で、プロダクト側と同じように 1 つずつ手でスタイルを書くと、社内しか見ない画面にプロダクト側と同じコストを払うことになる。そこで、管理画面が必要になったアプリのための入口として、既成の部品で組む管理画面を足した（[20260828_admin-app-astryx.md](../design-docs/20260828_admin-app-astryx.md) の「概要」と「背景」）
- 管理画面はプロダクト側と「配布先と権限が違う」。同じアプリに入れると管理画面のコードが一般の利用者に配られ、片方のデプロイでもう片方が落ちる。そのため、プロダクト側とは分けて置いた（同 design doc の「検討した他の案」）。どう分けているかは [architecture/overview.md の全体像](../architecture/overview.md#全体像)

## 対象ユーザー・スコープ

### 対象ユーザー

| 利用者 | 立場 |
| --- | --- |
| テンプレートを使う開発者 | 管理画面に画面を足す |
| 管理画面を使う運営者 | 管理画面で情報を見る。利用者は社内に限られる想定（[20260828_admin-app-astryx.md](../design-docs/20260828_admin-app-astryx.md) の「影響範囲」）。ロールと権限の区別は決まっていない |

### 対象のアプリ・画面・URL

| アプリ | URL | 画面 |
| --- | --- | --- |
| `apps/admin` | `/` | ユーザー一覧（[ユーザー一覧の PRD](users.md)） |

### できる操作

- 登録済みのユーザーを一覧で見る（[ユーザー一覧の PRD](users.md)）

### 対象外

- **プロダクト側（`apps/app`）と画面を共有すること。** 「この先もやらない」と決めている（[20260828_admin-app-astryx.md](../design-docs/20260828_admin-app-astryx.md) の「やらないこと」）

## ゴール・成功条件

- 管理画面に画面を足すとき、部品を自前で書かずに既成のコンポーネントで組める（[20260828_admin-app-astryx.md](../design-docs/20260828_admin-app-astryx.md) の「背景」と「ゴール」。何を使っているかは [architecture/overview.md のスタイリング](../architecture/overview.md#スタイリング)）
- 管理画面のコードが、プロダクトの一般の利用者に配られない
- 外部に公開して運用するときには、権限のない人が管理画面の画面にも情報にも届かない

測定指標は定めていない。

## 振る舞い

- **検索エンジンに載せない。** 全ページで、検索エンジンに索引させない指定（robots の `noindex, nofollow`）を出す（`apps/admin/src/routes/__root.tsx` のコメント「管理画面は検索結果に出す意味がない」）
- **配色は OS の設定に従って light / dark が切り替わる**（`apps/admin/src/lib/astryx-provider.tsx` のコメント）
- **プロダクト側の URL からは届かない。** 管理画面はプロダクト側とは別に配信する

## 業務ルール・制約

### 公開範囲・権限

- **外部に公開して運用する前に、認証・認可を必ず入れる**（[20260828_admin-app-astryx.md](../design-docs/20260828_admin-app-astryx.md) の「やらないこと」）。公開して運用するときは、権限のある人だけが管理画面の画面と、そこに出す情報に届くようにする
- **検索エンジンに載せない指定は、アクセス制御にならない。** 検索結果に出さないための指定で、URL を知っている人は開ける
- **管理画面のコードを、プロダクト側（`apps/app`）の利用者に配らない。** 管理画面はプロダクト側とは別に配信する。どう分けているか（別のアプリ・別の Worker）は [architecture/overview.md の全体像](../architecture/overview.md#全体像)

## 状態遷移

なし。

## 例外・境界条件

「現状」と付けた行は、今そう動いているという記録で、要件として決まったものではない（[扱い](README.md#実装から読み取れる現状の扱い)）。

| 条件 | 結果 |
| --- | --- |
| 外部に公開して運用している管理画面を、権限のない人が開く | 画面も情報も見せない |
| 認証・認可が無いまま、外から届く場所に置く | 現状は、誰でもユーザー一覧を見られる。上の要件を満たさないので、運用に乗せられない状態 |
| 検索エンジンのクローラーが来る | 索引させない指定を返す |
| プロダクト側の URL から管理画面の画面を開こうとする | 届かない |
| 画面の中のリンクをたどる | 現状は、遷移のたびにページ全体を読み直す（理由は [architecture/overview.md のスタイリング](../architecture/overview.md#appsadmin--astryx)） |

## 受け入れ条件

- `apps/admin` のどのページにも `noindex, nofollow` の robots メタタグが出ている
- `apps/app` の URL から、管理画面の画面には届かない
- 外部に公開して運用する環境では、権限のない人が管理画面の画面にも、そこに出す情報にも届かない

## 実装から読み取れる現状・未確認事項

### 実装から読み取れる現状

**ここに書いたものは要件ではなく、今そう動いているという記録。** 変更を禁じる制約でもない。変更を頼まれたら、その要求を新しい判断の起点にする（[扱い](README.md#実装から読み取れる現状の扱い)）。「例外・境界条件」の表で「現状」と付けた行も同じ扱い。

- **認証・認可が無い。** `/` の `loader`（`apps/admin/src/routes/index.tsx`）は、認証を確かめずにユーザー一覧を返す。外から届く場所にデプロイすると、誰でもユーザー一覧を見られる。管理画面を作ったときに後回しにしたもので、保ち続ける状態ではない（[20260828_admin-app-astryx.md](../design-docs/20260828_admin-app-astryx.md)、[apps/admin/README.md の「まだ無いもの」](../../apps/admin/README.md#まだ無いもの)）
- **公開されていない。** 2026-11-15 に確かめたところ、`apps/app` がデプロイされている Cloudflare アカウントに、管理画面の Worker は無かった。[apps/admin/README.md の「まだ無いもの」](../../apps/admin/README.md#まだ無いもの)も「Cloudflare へのデプロイ」を挙げている
- **画面の文言は日本語。** `apps/app` は英語

### 未確認事項

- **認証・認可をいつ・どの方式で入れるか。** 認証の仕組みは今、プロダクト側にだけ配線されている（[architecture/overview.md の認証](../architecture/overview.md#認証)）。管理画面を作ったときは「中途半端に『ゲートだけあってログイン画面がない』状態にするほうが危ない」として、どちらも入れなかった（[20260828_admin-app-astryx.md](../design-docs/20260828_admin-app-astryx.md) の「やらないこと」）
- **誰にどの権限を与えるか。** 管理画面を使う人の範囲、ロール、ロールごとにできることは決まっていない
- **デプロイの扱い。** 今の設定は、デプロイすればそのまま外から届く形になっている（[architecture/overview.md のデプロイ](../architecture/overview.md#デプロイ)）。認証を入れる前にデプロイが要るようになったとき、どう守るかは決まっていない

## 関連資料

- Product: [product.md](../product.md)
- Architecture: [overview.md の全体像](../architecture/overview.md#全体像)（別のアプリ・別の Worker にしていること）、[overview.md の実行環境](../architecture/overview.md#実行環境)（Worker の名前と preview URL）、[overview.md のデプロイ](../architecture/overview.md#デプロイ)（今デプロイされているもの）、[overview.md の `apps/admin` — Astryx](../architecture/overview.md#appsadmin--astryx)（配色、リンクが読み直しになる理由）、[directory-structure.md](../architecture/directory-structure.md)（`apps/app` と画面を共有しない規約）
- Design Docs: [20260828_admin-app-astryx.md](../design-docs/20260828_admin-app-astryx.md)
- Runbooks: なし。起動と Astryx の使い方は [apps/admin/README.md](../../apps/admin/README.md)
- API 契約: なし
- 関連する PRD: [users.md](users.md)、[auth.md](auth.md)
- 根拠となる実装・テスト: `apps/admin/src/routes/__root.tsx`、`apps/admin/src/routes/index.tsx`、`apps/admin/src/lib/astryx-provider.tsx`、`apps/admin/wrangler.jsonc`。テストは無い
