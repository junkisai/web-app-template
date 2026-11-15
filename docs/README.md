# docs

このリポジトリのドキュメント置き場。**今どうなっているか**と、**過去に何をなぜ決めたか**を、人間も AI エージェントも取り違えずに読める状態を目指す。

## 5 つの種類

| 種類 | 答える問い | 何の正本か | ライフサイクル |
| --- | --- | --- | --- |
| [specs/](specs/README.md) | 何を満たすべきか | 現在有効な仕様・振る舞い・制約・受け入れ条件 | Living Document。仕様が変わったら更新する |
| [architecture/](architecture/) | 今どう組まれているか | 現在のシステム構成と開発規約 | Living Document。構成・規約が変わったら更新する |
| [design-docs/](design-docs/README.md) | どう作ると決めたか、なぜか | 設計の過程・採った案と捨てた案・トレードオフ | 実装前に書き、実装後は原則凍結する |
| [runbooks/](runbooks/) | どう操作するか | 現在有効な開発・運用の手順 | Living Document。手順が変わったら更新する |
| [transcripts/](transcripts/README.md) | 誰が何を話したか | 会話・ヒアリング・録音の原記録 | 原則不変 |

ADR・RFC・PRD・Blueprint の専用ディレクトリは作らない。技術判断の背景と代替案は design doc に書く。

## どれを読むか

| 知りたいこと | 読む場所 |
| --- | --- |
| その機能が今どう振る舞うべきか | `specs/` |
| アプリ・パッケージの関係、置き場所・依存の向き・命名の規約 | `architecture/` |
| なぜその形になったのか、ほかに何を検討したか | `design-docs/` |
| セットアップ以外の操作・運用の手順 | `runbooks/` |
| 打ち合わせやヒアリングで実際に何が話されたか | `transcripts/` |
| 初回のセットアップ・起動・デプロイ | ルートの [README.md](../README.md) |

**design doc は仕様の正本ではない。** 凍結されるのは「その時点で何を決めたか」という記録であって、対象の機能や実装ではない。design doc に書かれた要件と今の仕様が違うときは、`specs/` と `architecture/` のほうが今の状態を表す。過去の design doc は、仕様を変えてはいけない理由にならない。

`specs/`・`architecture/`・コードが互いに食い違っているときは、どれかを正と決めつけない。食い違いをそのまま報告し、どちらに寄せるかを決めてから直す。コードにあるからといって、それが意図された仕様だとは限らない。

## どこに書くか

| 書きたいこと | 置き場所 |
| --- | --- |
| 機能の要件・振る舞い・制約・受け入れ条件（実装済みのもの） | `specs/<機能>.md` |
| これから変える仕様の案、実現方法、検討した他の案 | `design-docs/YYYYMMDD_<topic>.md` |
| 構成・依存の向き・規約（今そうなっているもの） | `architecture/` |
| 手で叩くコマンドと確かめ方 | `runbooks/<操作>.md` |
| 録音・会話の書き起こし | `transcripts/YYYY-MM-DD-<topic>.md` |

**未実装の変更案を `specs/` に書かない。** 変更案は design doc に書き、実装が入ったときに `specs/` を書き換える。

同じ情報を複数の文書に写さない。正本を 1 つ決め、ほかの文書からはリンクする。

## 命名

パスはすべて英小文字の kebab-case。日付を付けるかどうかは、ライフサイクルで決まる。

| 種類 | ファイル名 | 日付 |
| --- | --- | --- |
| specs | `<機能>.md`（例: `auth.md`） | 付けない。内容を更新し続けるため |
| architecture | `<topic>.md`（例: `overview.md`） | 付けない。同上 |
| runbooks | `<操作>.md`（例: `create-d1.md`） | 付けない。同上 |
| design-docs | `YYYYMMDD_<topic>.md`（例: `20260906_db-turso-to-cloudflare-d1.md`） | 書き始めた日。その時点の記録だから |
| transcripts | `YYYY-MM-DD-<topic>.md`（例: `2026-06-29-elink-kickoff.md`） | 録音日。[transcripts/README.md](transcripts/README.md) の規則に従う |

テンプレートは `_template.md`、各ディレクトリの説明は `README.md` に置く。

## ドキュメント一覧

### specs

- [specs/](specs/README.md) — 仕様の書き方・更新のしかた
- [auth.md](specs/auth.md) — 認証（メールとパスワード、OAuth、`ENABLE_AUTH` による切り替え）
- [users.md](specs/users.md) — ユーザー一覧（`apps/app` と `apps/admin` の `/`）とその元データ
- [admin-console.md](specs/admin-console.md) — 管理画面（`apps/admin`）全体の前提と制約

### architecture

- [overview.md](architecture/overview.md) — アプリ・パッケージの関係、実行環境、データベース、認証、環境変数、スタイリング、開発ツール、デプロイ
- [directory-structure.md](architecture/directory-structure.md) — `apps/*` の置き場所の規約（判断フロー・各層の責務・依存の方向・命名）

### design-docs

- [design-docs/](design-docs/README.md) — 書くタイミング・テンプレート・status の進め方と一覧

### runbooks

- [create-d1.md](runbooks/create-d1.md) — 新しい D1 を場所を選んで作る（`--location apac` と確かめ方）
- [d1-migrations.md](runbooks/d1-migrations.md) — migration の生成と、ローカル・リモートの D1 への migration と seed の当て方
- [minimum-release-age.md](runbooks/minimum-release-age.md) — 公開から 7 日未満のバージョンを入れる（pnpm / Renovate の設定と例外の書き方）

### transcripts

- [transcripts/](transcripts/README.md) — 文字起こしデータ置き場（命名規則・テンプレート・音声の扱い）

### アプリごとの README

- [apps/app/README.md](../apps/app/README.md) — `apps/app` の構成の要点
- [apps/admin/README.md](../apps/admin/README.md) — `apps/admin` の起動と Astryx の使い方
