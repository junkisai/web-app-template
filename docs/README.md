# docs

このリポジトリのドキュメント置き場。人間・AIエージェントのどちらが実装する場合でも、ここを読めば目的通りのものが作れる状態を目指す。

## 分類

| ディレクトリ | 答える問い | 更新タイミング |
| --- | --- | --- |
| [architecture/](architecture/) | 全体はどうなってる? | 構成が変わったとき（常に最新を維持） |
| [design-docs/](design-docs/README.md) | 何を・なぜ・どう作る? | 実装前に書く（実装後は凍結） |
| [runbooks/](runbooks/) | どう操作する? | 手順が変わったとき（常に最新を維持） |
| [references/](references/README.md) | 何を参考にした? | デザイン・構成を検討したとき |
| [transcripts/](transcripts/) | 誰が何を話した? | 録音・文字起こししたとき |

## ファイル命名ルール

ファイル名は作成日（`YYYYMMDD`）を prefix にし、続けて内容がわかる英小文字の kebab-case を付ける。

```text
<YYYYMMDD>_<topic>.md
```

例:

- `20260619_auth-flow.md`
- `20260619_db-schema.md`

## ドキュメント一覧

### architecture

- [20260819_directory-structure.md](architecture/20260819_directory-structure.md) — `apps/app` の置き場所の規約（判断フロー・各層の責務・依存の方向・命名）

### design-docs

- [design-docs/](design-docs/README.md) — 実装前に「何を・なぜ・どう作るか」をまとめる場所（書くタイミング・テンプレート・status の進め方）

### runbooks

- [20260825_minimum-release-age.md](runbooks/20260825_minimum-release-age.md) — 公開から 7 日未満のバージョンを入れる手順（pnpm / Renovate の設定と例外の書き方）

### references

- [references/](references/README.md) — デザイン・構成を決めるときに参考にしたものの置き場所（何を置くか・書き方）

### transcripts

- [transcripts/](transcripts/README.md) — ボイスレコーダーの文字起こしデータ置き場（命名規則・テンプレ・音声の扱い）
