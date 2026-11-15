# プロダクト

`web-app-template` が**何のためにあり、誰に何を届けるか**の正本。プロダクト全体の目的・提供価値・成功条件が変わったら、その変更を入れる PR でここを書き換える。

- 機能ごとの目的・要件・振る舞いは [prds/](prds/README.md) にある。ここには機能の一覧や振る舞いを写さない
- 技術の構成と開発規約は [architecture/](architecture/overview.md) にある。ここには技術スタックの詳細を書かない
- なぜその形にしたかは [design-docs/](design-docs/README.md) にある

**この文書は、既存の README・design doc・PR の説明から読み取れることだけで書いている。** プロダクトの目的を作者が明文化した記録はまだ無い。根拠のある記述には出どころを添え、決まっていないことは[未確認事項・仮説](#未確認事項仮説)に分けた。

## プロダクト概要

`web-app-template` は、Web アプリケーションを新しく作るときの土台になる**開発テンプレート**。特定のエンドユーザーに向けたサービスではない。

- GitHub のテンプレートリポジトリとして公開している
- 使う人は、テンプレートから自分のリポジトリを作り、デプロイ先の名前やデータベースを自分のものに差し替えて使う（`wrangler.jsonc` の TODO コメント、[20260906_db-turso-to-cloudflare-d1.md](design-docs/20260906_db-turso-to-cloudflare-d1.md) の「やらないこと」）
- 中身は、プロダクト側のアプリ、管理画面のアプリ、それらが共有する DB・認証・環境変数の土台、開発の規約とそれを止める lint、ドキュメントの体系。構成の正本は [architecture/overview.md](architecture/overview.md#全体像)
- 認証・ユーザー一覧・管理画面は、テンプレートの基礎として組み込んだ機能で、配線が端から端まで動くことを確かめる見本を兼ねている（各 [PRD](prds/README.md) の「背景・解決する課題」）

## ターゲットユーザー

| 利用者 | 何をする人か | 根拠 |
| --- | --- | --- |
| テンプレートを使う開発者 | このテンプレートから新しい Web アプリを始め、自分のアプリに作り替えていく | テンプレートリポジトリであること。design doc の「テンプレートを使う人」「テンプレートを clone した人」（[20260906_db-turso-to-cloudflare-d1.md](design-docs/20260906_db-turso-to-cloudflare-d1.md)） |
| コードを書く AI エージェント | 開発者の指示で、このリポジトリのコードとドキュメントを書く | 「このリポジトリのコードを書くのは主にエージェント」（[20260826_tailwind-to-stylex.md](design-docs/20260826_tailwind-to-stylex.md)、[20260828_admin-app-astryx.md](design-docs/20260828_admin-app-astryx.md)）。[docs/README.md](README.md) の「人間も AI エージェントも取り違えずに読める状態を目指す」 |

テンプレートから作られたアプリの利用者（プロダクトの一般利用者、管理画面を使う運営者）は、このテンプレートの直接の利用者ではない。テンプレートが渡すのは、その人たちに向けた機能を作るための土台。

開発者が作者本人だけなのか、外部の開発者も含むのかは確かめていない（[未確認事項・仮説](#未確認事項仮説)）。

## 解決する課題

既存の記録から読み取れる課題。テンプレートの目的を一文で述べた記録は無いので、各機能や判断を入れたときの理由から拾っている。

1. **新しい Web アプリを始めるたびに、同じ土台を組み直すことになる。** フレームワーク・実行環境・DB・認証・管理画面・lint・デプロイを選び、つなぎ、動くことを確かめる手間が毎回かかる。認証は「認証テンプレート」として、サインアップからセッションの確認までを動作確認できる状態で足した（[#150](https://github.com/junkisai/web-app-template/pull/150)）。管理画面は「管理画面が必要になったアプリのための入口」として足した（[20260828_admin-app-astryx.md](design-docs/20260828_admin-app-astryx.md)）
2. **AI エージェントが書くコードは、仕組みで縛らないとばらつく。** それらしいけれど間違った書き方が lint も型検査も通り抜け、レビューでしか止まらなくなる（[20260826_tailwind-to-stylex.md](design-docs/20260826_tailwind-to-stylex.md) の背景）
3. **運用先や選択肢の多いテンプレートは、使う人の負担になる。** 運用先が 2 つに分かれる構成は「テンプレートとして配る構成としては重い」。やり方を 2 つ置くと「使う人が毎回決めることになる」（[20260906_db-turso-to-cloudflare-d1.md](design-docs/20260906_db-turso-to-cloudflare-d1.md) の背景と「検討した他の案」）
4. **文書だけでは、今の仕様と過去の決定を取り違える。** 実装後に凍結した design doc を今の仕様だと読んだり、それを理由に変更を止めたりしてしまう（[#280](https://github.com/junkisai/web-app-template/pull/280) の「なぜ」、[docs/README.md](README.md)）

## 提供価値

- **動く状態から始められる。** ルートの [README.md](../README.md) の手順を踏めば、プロダクト側と管理画面の 2 つのアプリ、DB、認証が手元で動く
- **書き方が最初から決まっている。** 置き場所・依存の向き・命名・スタイルの書き方が規約と lint・型検査で決まっていて、人間が書いてもエージェントが書いても同じ形に寄る（[architecture/directory-structure.md](architecture/directory-structure.md)、[20260826_tailwind-to-stylex.md](design-docs/20260826_tailwind-to-stylex.md)）
- **運用の足場が 1 つで済む。** 実行環境もデータベースも同じ基盤に置き、接続情報を secrets で配らなくてよい（[20260906_db-turso-to-cloudflare-d1.md](design-docs/20260906_db-turso-to-cloudflare-d1.md)）。何を使っているかは [architecture/overview.md](architecture/overview.md)
- **今の姿と経緯を取り違えずに読める。** 今の要件・構成と、そこに至った判断を、文書の種類で分けて持つ（[docs/README.md](README.md)）

## コア体験

テンプレートを使う開発者が通る流れ。手順の正本はルートの [README.md](../README.md) と [runbooks/](runbooks/)。

1. テンプレートから自分のリポジトリを作り、依存を入れ、`.env` を用意する
2. 自分のデータベースを作って両アプリの設定に書き、migration と seed を当てる
3. 2 つのアプリを立ち上げ、`/login` でアカウント作成・ログイン・ログアウトを試し、`/` でセッションの状態とユーザー一覧を確かめる（[prds/auth.md](prds/auth.md)、[prds/users.md](prds/users.md)）
4. 規約に沿って、自分のアプリの画面と機能を足していく。設計上の判断が要る変更は design doc で合意してから実装し、実装と同じ PR で PRD と architecture を更新する（[AGENTS.md](../AGENTS.md)）
5. README の手順でデプロイする

## ゴール・成功指標

**数値の目標（KPI）は定めていない。** 既存の文書から読み取れる、テンプレートとして保ちたい状態を挙げる。どれも、測り方までは決まっていない。

- テンプレートを使う人が、README の手順どおりに新規セットアップを終えられる（[20260906_db-turso-to-cloudflare-d1.md](design-docs/20260906_db-turso-to-cloudflare-d1.md) の完了の判定）
- セットアップの直後に、認証（アカウント作成・ログイン・ログアウト・セッションの確認）と、DB から読んだデータの表示が、画面で端から端まで動く（[#150](https://github.com/junkisai/web-app-template/pull/150)、[20260828_admin-app-astryx.md](design-docs/20260828_admin-app-astryx.md) と [20260906_db-turso-to-cloudflare-d1.md](design-docs/20260906_db-turso-to-cloudflare-d1.md) のゴール）
- 型検査・lint・未使用の検出と、各アプリのビルドが通る状態を保つ（各 design doc のゴール、push 前の検査）
- テンプレート自身が、`main` から Cloudflare にデプロイできる状態を保つ（「このリポジトリは Workers Builds でデプロイされている」、[20260906_db-turso-to-cloudflare-d1.md](design-docs/20260906_db-turso-to-cloudflare-d1.md) の「やらないこと」）
- 人間も AI エージェントも、今の要件・構成と過去の判断を取り違えずに読める（[docs/README.md](README.md)）

## スコープ・非ゴール

### スコープ

テンプレートが受け持つもの。

- Web アプリの土台: プロダクト側のアプリと管理画面のアプリ、共有の DB・認証・環境変数（[architecture/overview.md](architecture/overview.md)）
- 基礎機能と見本: [認証](prds/auth.md)、[ユーザー一覧](prds/users.md)、[管理画面](prds/admin-console.md)
- 開発の規約と、それを機械的に止める lint・型検査（[architecture/directory-structure.md](architecture/directory-structure.md)）
- ドキュメントの体系と、AI エージェント向けの運用ルール（[docs/README.md](README.md)、[AGENTS.md](../AGENTS.md)）
- セットアップ・デプロイ・運用の手順（ルートの [README.md](../README.md)、[runbooks/](runbooks/)）

### 意図的な非ゴール

記録に「この先もやらない」と書かれているもの。これも、新しい要求があれば見直せる（[AGENTS.md](../AGENTS.md)）。

- **基盤を差し替えられる構成にすること。** データベースの driver を設定で切り替える両対応にはしない。分岐が残ると回避策も残り続けるため（[20260906_db-turso-to-cloudflare-d1.md](design-docs/20260906_db-turso-to-cloudflare-d1.md) の「この先もやらないこと」）
- **プロダクト側と管理画面で画面を共有すること**（[20260828_admin-app-astryx.md](design-docs/20260828_admin-app-astryx.md) の「この先もやらないこと」）

### 今は無いもの（非ゴールではない）

後回しにしているだけで、やらないと決めたものではない。

- 管理画面の認証・認可。外部に公開して運用する前に必ず要る（[prds/admin-console.md](prds/admin-console.md)）
- 管理画面の Cloudflare へのデプロイ（[prds/admin-console.md](prds/admin-console.md)）
- ユーザーの作成・編集・削除の画面（[prds/users.md](prds/users.md)）
- テストを走らせる仕組み。置き場所の規約だけがある（[architecture/overview.md の開発ツール](architecture/overview.md#開発ツール)）
- プロダクト側のダークモード（[20260826_tailwind-to-stylex.md](design-docs/20260826_tailwind-to-stylex.md) の「やらないこと」）

## プロダクト原則

既存の design doc と規約で繰り返し使われてきた判断の軸。**原則として合意したものではなく、過去の判断から抜き出したもの。** 新しい判断の材料にはするが、新しい要求を断る理由にはしない。

1. **規約は仕組みで止める。** 誰が書いても同じ形になるよう、文書でお願いするより lint と型検査で止める（[20260826_tailwind-to-stylex.md](design-docs/20260826_tailwind-to-stylex.md) の背景、[architecture/directory-structure.md の lint で強制している](architecture/directory-structure.md#lint-で強制している)）
2. **使う人に選ばせる箇所を増やさない。** やり方を 2 つ用意せず、1 つに決めて配る（[20260906_db-turso-to-cloudflare-d1.md](design-docs/20260906_db-turso-to-cloudflare-d1.md) の「検討した他の案」）
3. **運用の足場を増やさない。** 実行環境と同じ基盤にデータも置き、配る secrets を減らす（[20260906_db-turso-to-cloudflare-d1.md](design-docs/20260906_db-turso-to-cloudflare-d1.md) の背景）
4. **プロダクトの利用者に、要らないものを配らない。** 管理画面はプロダクト側とは別に配信する（[prds/admin-console.md](prds/admin-console.md)）
5. **共通化は 2 つ目が要るようになってから。** 参照元が 1 つのうちは器を作らない（[architecture/directory-structure.md](architecture/directory-structure.md#2-つ目の参照元が現れてから外に出す)）
6. **今の姿と経緯を分けて残す。** 今の要件は PRD、今の構成は architecture、決めた過程は design doc に置く（[docs/README.md](README.md)）

## 未確認事項・仮説

- **誰のためのテンプレートか。** 作者が自分の新しいアプリを始めるためのものか、外部の開発者にも使ってもらうことを狙うものか。公開のテンプレートリポジトリだが、README に対象者の記述は無く、ルートの `package.json` の `license` は `UNLICENSED` のまま
- **どんなアプリの土台を想定しているか。** 一般向けのサービス、社内ツールなど、想定するアプリの種類は書かれていない。管理画面の design doc は「管理画面は利用者が社内に限られ」と書いていて、運営者が社内にいるアプリを想定しているようにも読める（仮説。確かめていない）
- **成功をどう測るか。** 数値の指標は無い。測るとしたら何を測るか（テンプレートから作ったアプリの数、セットアップにかかる時間など）も決まっていない
- **上の原則を、原則として認めるか。** 過去の判断から抜き出したもので、合意を取っていない
- **基礎機能と見本の境目。** 認証・ユーザー一覧・管理画面のうち、テンプレートから作るアプリでもそのまま育てる前提のものと、作り替える前提の見本はどれか。各 PRD の未確認事項にも挙げている
- **R2 をテンプレートの範囲に入れるか。** README はセットアップで R2 を用意させているが、R2 を使う機能もコードも無い（[architecture/overview.md の既知の食い違い](architecture/overview.md#既知の食い違い)）

## 関連資料

- 機能ごとの目的・要件・振る舞い: [prds/](prds/README.md)
- 今の技術構成と開発規約: [architecture/overview.md](architecture/overview.md)、[architecture/directory-structure.md](architecture/directory-structure.md)
- 過去の設計判断: [design-docs/](design-docs/README.md)
- セットアップ・起動・デプロイ: ルートの [README.md](../README.md)、[runbooks/](runbooks/)
- エージェント向けの運用ルール: [AGENTS.md](../AGENTS.md)
- 根拠にした PR: [#150](https://github.com/junkisai/web-app-template/pull/150)（認証）、[#234](https://github.com/junkisai/web-app-template/pull/234)（管理画面）、[#257](https://github.com/junkisai/web-app-template/pull/257)（D1）、[#280](https://github.com/junkisai/web-app-template/pull/280)（ドキュメントの体系）
