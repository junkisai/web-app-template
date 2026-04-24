---
description: |
  Create a branch from main, commit current changes, and open a PR.
  Refuse unless the current branch is main.
argument-hint: [NOTES="extra context for branch, commit, and PR"]
---

現在の変更を見て、`main` から以下を順に実行する。

1. 新しいブランチを作成する
2. 変更をコミットする
3. リモートへ push する
4. Pull Request を作成する

`$ARGUMENTS` があれば、ブランチ名・コミットメッセージ・PR本文を考える際の補足要件として使う。

## 実行ルール

### 1. `main` ブランチ確認

最初に以下を確認する。

```bash
git branch --show-current
git status --short
```

- 現在のブランチが `main` **以外**なら、その場で終了する
- その場合は処理を続けず、現在のブランチ名を明記して次のように伝える

```text
このコマンドは main ブランチ上でのみ実行できます。
現在のブランチ: <branch-name>
main に切り替えてから再実行してください。
```

- 変更がない場合も終了し、「コミット対象の変更がない」と伝える

### 2. 差分を把握する

以下で変更内容を読む。

```bash
git diff --staged
git diff
```

- ステージ済み変更がある場合は、その範囲を優先する
- 未ステージ変更しかない場合は、関連ファイルを個別指定でステージする
- `git add .` と `git add -A` は使わない
- `.env` などの機密情報は絶対にステージしない

### 3. ブランチ名を作る

差分の内容から英語の kebab-case で短いブランチ名を作成する。

- 機能追加: `feature/<topic>`
- バグ修正: `fix/<topic>`
- リファクタリング: `refactor/<topic>`
- ドキュメント: `docs/<topic>`
- その他軽微な作業: `chore/<topic>`

ブランチ名を決めたら、`main` から新規ブランチを切る。

```bash
git switch -c <branch-name>
```

### 4. コミットする

既存の `commit` スキルのルールに従い、差分から日本語のコミットメッセージを自動生成してコミットする。

- 絵文字プレフィックス付き
- 要約は 1 行で簡潔に
- 必要なら本文を付ける
- フックはスキップしない
- amend はしない

ステージングが必要なら、ファイルを個別指定してからコミットする。

### 5. push する

新しいブランチをリモートへ push する。

```bash
git push -u origin <branch-name>
```

### 6. PR を作る

既存の `create-pr` スキルのルールに従い、PR タイトルと本文を生成して PR を作成する。

- ベースブランチは `gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name'` で確認し、取得できなければ `main`
- PR タイトルは変更全体を表す日本語で簡潔にまとめる
- PR 本文には少なくとも以下を含める

```md
## 変更概要

## スクリーンショット
```

### 7. 最後に報告する

以下を簡潔に報告する。

- 作成したブランチ名
- コミットメッセージ
- PR URL

途中で失敗した場合は、どの段階で止まったかと原因を明記する。
