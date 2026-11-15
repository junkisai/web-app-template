---
title: 認証
scope: [apps/app, packages/auth]
design_docs: []
---

## 概要

`apps/app` の利用者は、メールアドレスとパスワードでアカウントを作り、ログインできる。OAuth のログインは、資格情報が設定された provider だけが有効になる。認証は `ENABLE_AUTH` で丸ごと無効にできる。

## 対象

| アプリ | URL | 画面 |
| --- | --- | --- |
| `apps/app` | `/api/auth/*` | なし（認証 API） |
| `apps/app` | `/login` | ログイン画面 |
| `apps/app` | `/` | トップ（セッションの状態を表示する） |

**`apps/admin` は対象外。** 管理画面には今、認証が無い（[管理画面の spec](admin-console.md)）。

## 振る舞い

根拠はルートの [README.md](../../README.md) の Better Auth の節と、画面に出している案内文。

### 認証の有効・無効

`ENABLE_AUTH` で切り替える。

| `ENABLE_AUTH` | `/api/auth/*` |
| --- | --- |
| `true`、または未設定 | 認証 API として動く |
| `false` | `404` を返し、本文の `code` が `AUTH_DISABLED` になる |

受け付ける値は `1` / `true` / `yes` / `on` と `0` / `false` / `no` / `off`。それ以外の値は、`env` を最初に import した時点の検証でエラーになる（[architecture/overview.md の環境変数](../architecture/overview.md#環境変数)）。

### メールアドレスとパスワード

メールアドレスとパスワードによるアカウント作成とログインが有効になっている。

### OAuth

次の provider は、`<PROVIDER>_CLIENT_ID` と `<PROVIDER>_CLIENT_SECRET` が**両方**設定されているときだけ有効になる。片方だけなら有効にならない。

| provider | 環境変数の接頭辞 |
| --- | --- |
| Apple | `APPLE` |
| Discord | `DISCORD` |
| Facebook | `FACEBOOK` |
| GitHub | `GITHUB` |
| GitLab | `GITLAB` |
| Google | `GOOGLE` |
| LinkedIn | `LINKEDIN` |
| Microsoft | `MICROSOFT` |
| Slack | `SLACK` |
| Spotify | `SPOTIFY` |
| Twitch | `TWITCH` |
| X | `X` |

### 認証の URL

認証の base URL には `BETTER_AUTH_URL` を使う。

### 動作確認用の画面

`/login` は、アカウントを作ってセッションの状態を確かめるための画面として置いている（`/` の案内文 "Use the login screen to create an account and confirm the session state."、`/login` の案内文 "This screen exists to validate the flow end to end"）。

## 制約

- `ENABLE_AUTH` が `false` のとき、認証 API は応答を返さず `404` / `AUTH_DISABLED` に固定される
- OAuth の provider は、資格情報がそろっていないかぎり有効にしない

## 受け入れ条件

- `ENABLE_AUTH` が未設定または `true` のとき、`/api/auth/*` が認証 API として応答する
- `ENABLE_AUTH` が `false` のとき、`GET` / `POST` の `/api/auth/*` が `404` と `code: "AUTH_DISABLED"` を返す
- `/login` でメールアドレスとパスワードのアカウントを作り、同じ資格情報でログインできる
- provider の `*_CLIENT_ID` と `*_CLIENT_SECRET` がそろったときだけ、その provider が有効になる

## 実装から読み取れる現状

**ここに書いたものは仕様ではなく、今そう動いているという記録。** 変更を禁じる制約でもない。変更を頼まれたら、その要求を新しい判断の起点にする（[扱い](README.md#実装から読み取れる現状の扱い)）。

- **base URL の予備。** `BETTER_AUTH_URL` が無いと `APP_BASE_URL`、それも無いと `http://localhost:3000` を使う（`packages/auth/src/lib/auth.ts`）
- **`/login` の画面。** 未ログインのときは「Sign in」と「Create account」を切り替えて使う。Create account は表示名・メールアドレス・パスワードを、Sign in はメールアドレス・パスワードと「Keep the session alive on this browser」（既定でオン）を受け取る。パスワード欄はブラウザ側で 8 文字以上を求める。成功するとセッションを取り直して `/` へ移る。失敗すると、返ってきたエラーの文言を画面に出す
- **ログイン中の表示。** `/login` と `/` は、ログイン中なら名前・メールアドレス・ユーザー ID と「Sign out」を出す。未ログインなら、`/` はログイン画面へのリンクと案内を出す
- **失敗の記録。** `/api/auth/*` が失敗の応答を返したときと、処理が例外で落ちたときは、メソッド・パス・ステータス・`cf-ray`・応答本文（または例外）をサーバーのログに出す（`apps/app/src/routes/api/auth/$.ts`）
- **画面の文言は英語。** `apps/admin` の画面は日本語

## 未確認事項

- `ENABLE_AUTH` が `false` のとき、`/login` と `/` のセッション表示がどう振る舞うべきか。今は画面がそのまま出て、裏の API が `404` を返す
- パスワードの要件（長さ・文字種）を仕様として決めているか。見えているのは画面側の 8 文字以上だけ
- ログインで作ったアカウントは、ユーザー一覧には出ない。一覧が読むテーブルと認証のテーブルが別になっている（[ユーザー一覧の spec の未確認事項](users.md#未確認事項)）
- `apps/admin` に認証をいつ・どの方式で入れるか。「外部に公開して運用する前に必ず要る」ことだけが決まっている（[管理画面の spec](admin-console.md)）

## 関連

- architecture: [overview.md の認証](../architecture/overview.md#認証)（設定の置き場所・import の仕方）、[overview.md の環境変数](../architecture/overview.md#環境変数)
- design doc: なし（認証は design doc の運用を始める前に入った。導入は [#150](https://github.com/junkisai/web-app-template/pull/150)）
- 手順: OAuth の資格情報の入れ方はルートの [README.md](../../README.md#better-auth)
