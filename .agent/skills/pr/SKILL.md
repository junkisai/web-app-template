---
name: pr
description: |
  main ブランチ上の現在の変更をもとに、新しい作業ブランチを作成し、
  コミットして GitHub Pull Request までまとめて実行するスキル。
  main 以外のブランチでは必ず処理を断る。

  以下の文脈で積極的に使うこと：
  - 「今の変更をブランチ切ってコミットしてPRまで出して」
  - 「main からブランチ作ってそのまま PR を作りたい」
  - 「現在の差分を見て branch / commit / PR を一気にやって」
---

# pr スキル

現在の変更を見て、`main` から新しいブランチを切り、コミットし、PR 作成まで進める。

`commit` と `create-pr` の既存ルールに従いながら、以下の順で処理する。

## Step 1: `main` ブランチか確認する

```bash
git branch --show-current
git status --short
```

- 現在のブランチが `main` 以外なら、その場で終了する
- 必ず次の形式で伝える

```text
このコマンドは main ブランチ上でのみ実行できます。
現在のブランチ: <branch-name>
main に切り替えてから再実行してください。
```

- 変更がない場合も終了し、「コミット対象の変更がない」と伝える

## Step 2: 差分を読む

```bash
git diff --staged
git diff
```

- ステージ済み変更がある場合は、そのスコープを優先する
- 未ステージ変更のみなら、関連ファイルを個別指定でステージする
- `git add .` と `git add -A` は使わない
- `.env` などの機密情報は含めない

## Step 3: ブランチ名を作成する

差分から短い英語の kebab-case ブランチ名を作る。

- 機能追加: `feature/<topic>`
- バグ修正: `fix/<topic>`
- リファクタリング: `refactor/<topic>`
- ドキュメント: `docs/<topic>`
- その他: `chore/<topic>`

```bash
git switch -c <branch-name>
```

## Step 4: コミットする

`commit` スキルのルールに従う。

- 絵文字プレフィックス付きの日本語メッセージ
- 要約は簡潔に 1 行
- 必要なら本文を付ける
- amend しない
- フックはスキップしない

## Step 5: push する

```bash
git push -u origin <branch-name>
```

## Step 6: PR を作る

`create-pr` スキルのルールに従う。

- ベースブランチは `gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name'` で確認
- 取得できなければ `main`
- PR タイトルは変更全体を表す日本語で簡潔にまとめる
- PR 本文には必ず次を含める

```md
## 変更概要

## スクリーンショット
```

## Step 7: 結果を報告する

最後に以下を伝える。

- 作成したブランチ名
- コミットメッセージ
- PR URL

失敗した場合は、どの段階で止まったかと原因を簡潔に伝える。
