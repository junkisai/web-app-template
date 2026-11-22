# docs

このリポジトリのドキュメント置き場。**今どうなっているか**を、人間も AI エージェントも取り違えずに読める状態を目指す。**過去に何をなぜ決めたか**は、文書ではなくコミットと PR に残す。

## 5 つの種類

| 種類 | 答える問い | 何の正本か | ライフサイクル |
| --- | --- | --- | --- |
| [product.md](product.md) | このプロダクトは何のためにあるか | プロダクト全体の目的・対象・課題・提供価値・成功条件 | Living Document。目的・価値・成功条件が変わったら更新する |
| [prds/](prds/README.md) | この機能はなぜ要り、何を満たすべきか | 機能ごとの目的・要件・今有効な振る舞い・受け入れ条件 | Living Document。要件・振る舞いが変わったら更新する |
| [architecture/](architecture/overview.md) | 今どう組まれているか | 今の技術構成・開発規約・技術的な制約 | Living Document。構成・規約が変わったら更新する |
| [runbooks/](runbooks/) | どう操作するか | 今有効な開発・運用の手順 | Living Document。手順が変わったら更新する |
| [transcripts/](transcripts/README.md) | 誰が何を話したか | 会話・ヒアリング・録音の原記録 | 原則不変 |

ひとことで分けると次のとおり。

- **product.md** — プロダクト全体の Why
- **PRD** — 機能ごとの Why と What
- **architecture** — 今の How

**なぜその形にしたか、採らなかった案、トレードオフは、PR の本文とコミットに書く。** 判断の記録のための文書（ADR・RFC など）は置かない。PR に何を書くかは [AGENTS.md の「判断の理由を残す」](../AGENTS.md#判断の理由を残す)にある。今使っている技術や構成を、PR やコミットにしか書いていない状態にしない。

## どれを読むか

| 知りたいこと | 読む場所 |
| --- | --- |
| このテンプレートは誰の何のためにあるか、何をやらないか | `product.md` |
| その機能はなぜあり、今どう振る舞うべきか | `prds/` |
| アプリ・パッケージの関係、使っている技術、置き場所・依存の向き・命名の規約 | `architecture/` |
| なぜその形になったのか、ほかに何を検討したか | その変更を入れたコミットと PR（`git log`・`git blame` からたどる） |
| セットアップ以外の操作・運用の手順 | `runbooks/` |
| 打ち合わせやヒアリングで実際に何が話されたか | `transcripts/` |
| 初回のセットアップ・起動・デプロイ | ルートの [README.md](../README.md) |

**過去の PR やコミットは、その時点で何を決めたかの記録で、今の要件や構成の正本ではない。** そこに書かれた要件や構成と今の状態が違うときは、`prds/` と `architecture/` のほうが今の状態を表す。過去の判断は、要件や構成を変えてはいけない理由にならない。

**過去の PR やコミットに残った判断も、今の PRD と architecture に書いた既定の方針も、ユーザーの新しい要求で見直せる。** ただし、安全性や技術的な制約を無視してよいという意味ではない。衝突するなら、影響・リスク・変更案を示して判断を仰ぐ。

`product.md`・`prds/`・`architecture/`・コードが互いに食い違っているときは、どれかを正と決めつけない。食い違いをそのまま報告し、どちらに寄せるかを決めてから直す。コードにあるからといって、それが意図された仕様だとは限らない。

## どこに書くか

| 書きたいこと | 置き場所 |
| --- | --- |
| プロダクト全体の目的・対象・課題・提供価値・成功条件・非ゴール | `product.md` |
| 機能の目的・課題・ゴール、要件・振る舞い・業務ルール・受け入れ条件（実装済みのもの） | `prds/<機能>.md` |
| 変えた理由、実現方法の選び方、検討した他の案、トレードオフ | その変更の PR の本文とコミット |
| 使っている技術、構成、依存の向き、規約、技術的な制約（今そうなっているもの） | `architecture/` |
| 手で叩くコマンドと確かめ方 | `runbooks/<操作>.md` |
| 録音・会話の書き起こし | `transcripts/YYYY-MM-DD-<topic>.md` |

**未実装の変更案を `prds/` に書かない。** `prds/` は実装が入る PR で書き換える。

**実装が入った PR で、変わったものの正本を全部書き換える。** 要件・振る舞いが変われば PRD、技術構成が変われば architecture、手順が変われば runbook、プロダクト全体の目的・価値・成功条件が変われば product.md。

同じ情報を複数の文書に写さない。正本を 1 つ決め、ほかの文書からはリンクする。

## 命名

パスはすべて英小文字の kebab-case。日付を付けるかどうかは、ライフサイクルで決まる。

| 種類 | ファイル名 | 日付 |
| --- | --- | --- |
| product | `product.md` の 1 ファイル | 付けない。内容を更新し続けるため |
| prds | `<機能>.md`（例: `auth.md`） | 付けない。同上 |
| architecture | `<topic>.md`（例: `overview.md`） | 付けない。同上 |
| runbooks | `<操作>.md`（例: `create-d1.md`） | 付けない。同上 |
| transcripts | `YYYY-MM-DD-<topic>.md`（例: `2026-06-29-elink-kickoff.md`） | 録音日。[transcripts/README.md](transcripts/README.md) の規則に従う |

テンプレートは `_template.md`、各ディレクトリの説明は `README.md` に置く。

## ドキュメント一覧

### product

- [product.md](product.md) — テンプレートの目的・対象・課題・提供価値・成功条件・非ゴール・原則

### prds

- [prds/](prds/README.md) — PRD の書き方・更新のしかた
- [auth.md](prds/auth.md) — 認証（メールとパスワード、OAuth、認証の有効・無効）
- [users.md](prds/users.md) — ユーザー一覧（`apps/app` と `apps/admin` の `/`）
- [admin-console.md](prds/admin-console.md) — 管理画面（`apps/admin`）全体の要件と公開範囲

### architecture

- [overview.md](architecture/overview.md) — アプリ・パッケージの関係、実行環境、データベース、認証、環境変数、スタイリング、開発ツール、デプロイ
- [directory-structure.md](architecture/directory-structure.md) — `apps/*` の置き場所の規約（判断フロー・各層の責務・依存の方向・命名）

### runbooks

- [create-d1.md](runbooks/create-d1.md) — 新しい D1 を場所を選んで作る（`--location apac` と確かめ方）
- [d1-migrations.md](runbooks/d1-migrations.md) — migration の生成と、ローカル・リモートの D1 への migration と seed の当て方
- [minimum-release-age.md](runbooks/minimum-release-age.md) — 公開から 7 日未満のバージョンを入れる（pnpm / Renovate の設定と例外の書き方）

### transcripts

- [transcripts/](transcripts/README.md) — 文字起こしデータ置き場（命名規則・テンプレート・音声の扱い）

### アプリごとの README

- [apps/app/README.md](../apps/app/README.md) — `apps/app` の構成の要点
- [apps/admin/README.md](../apps/admin/README.md) — `apps/admin` の起動と Astryx の使い方
