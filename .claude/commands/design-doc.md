---
description: |
  Write a design doc under docs/design-docs/ before implementing a feature.
  Fills the template with what is known, and surfaces what is not. Never implements.
argument-hint: [TOPIC="これから作るもの"]
---

`$ARGUMENTS` について、実装に入る前の design doc を作る。**このコマンドでは実装しない。**

## 実行ルール

### 1. 前提を読む

以下を読んでから書き始める。

- [docs/design-docs/README.md](../../docs/design-docs/README.md) — 書くタイミング・各節の役割・`status` の進め方
- [docs/design-docs/_template.md](../../docs/design-docs/_template.md) — テンプレート
- [docs/architecture/20260819_directory-structure.md](../../docs/architecture/20260819_directory-structure.md) — 置き場所の判断フロー

### 2. 書かなくていい変更でないか確認する

文言修正・スタイル調整・リファクタリング・バグ修正だけなら、design doc は作らない。
その旨を伝えて終了する。**迷う場合は作る。**

### 3. ファイルを作る

`_template.md` をコピーして `docs/design-docs/<YYYYMMDD>_<topic>.md` を作る。

```bash
date +%Y%m%d
```

- `<YYYYMMDD>` は上のコマンドで得た今日の日付
- `<topic>` は内容がわかる短い kebab-case（英小文字とハイフン）
- 同名のファイルがすでにあるなら、新規に作らず既存を更新するか確認する

### 4. 埋める

現時点でわかっていることを本文に書く。

- 既存コードを読み、影響範囲と置き場所は**リポジトリの実態に合わせて**書く
- 「置き場所」はディレクトリのパスまで決める。判断フローに当てはめた結果を書く
- 「検討した他の案」は最低 1 案。採らなかった理由まで書く
- 該当しない節は「なし」と書く。**節ごと消さない**
- **わからないことを推測で埋めない。**「未決事項」に質問として書く
- `status` は `draft`、`author` はコミット時の author 名

### 5. 一覧に追記する

`docs/design-docs/README.md` の「一覧」の**先頭**に 1 行足す。

```md
- [<YYYYMMDD>_<topic>.md](<YYYYMMDD>_<topic>.md) — <1 行の説明>
```

### 6. 未決事項を質問する

作成したファイルのパスを伝え、「未決事項」に挙げた点を質問として提示する。

- 回答が返ったら、本文の該当する節に反映し、「未決事項」から消す
- 「未決事項」が空になったら `status` を `review` に上げる
- **`approved` に上げるのはユーザーの判断。こちらで上げない**
- 合意が取れるまで実装には入らない
