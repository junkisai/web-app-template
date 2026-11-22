# AGENTS.md

## ドキュメントの読み分け

知りたいことに応じて、正本を読む。全体の地図は [docs/README.md](docs/README.md) にある。

| 知りたいこと | 正本 |
| --- | --- |
| プロダクト全体の目的・対象・提供価値・成功条件 | [docs/product.md](docs/product.md) |
| 機能ごとの目的・要件・今有効な振る舞い | [docs/prds/](docs/prds/README.md) |
| 今の技術構成と開発規約（使っている技術・置き場所・依存の向き・命名） | [docs/architecture/](docs/architecture/overview.md) |
| 過去の判断とその理由 | その変更を入れたコミットと PR（`git log`・`git blame` からたどる） |
| 今の操作・運用の手順 | [docs/runbooks/](docs/runbooks/) |
| 会話・ヒアリングの原記録 | [docs/transcripts/](docs/transcripts/README.md) |

- **product.md はプロダクト全体の Why、PRD は機能ごとの Why と What、architecture は今の How**
- **文書には今の状態だけを書き、コードと一緒に直し続ける。** なぜその形にしたかは、コミットと PR に残す
- **今使っている技術や構成を、PR やコミットにしか書いていない状態にしない。** 見つけたら architecture に足す
- product.md・PRD・architecture・コードが互いに食い違っていたら、どれかを正と決めつけずに報告する。**コードにあるからといって、それが意図された仕様だとは限らない**
- 目的・要件がわからないときは、根拠なく補わない。未確認のこととして伝える。背景・課題・KPI を想像で書かない

## 機能を追加・変更するとき

- **関連する PRD を先に読む。** プロダクト全体の価値や方向性に関わる変更なら、[docs/product.md](docs/product.md) も読む
- **ユーザーの新しい要求を、新しい検討の起点にする。** 過去の PR やコミットに残った判断も、今の PRD と architecture に書いた既定の方針も、新しい要求で変更・再検討できる。過去の判断は「当時はこう考えた」という材料として読む
- **PRD の「実装から読み取れる現状」や「未確認事項」にあることも、変更を断る理由にならない。** それは今そう動いているという記録で、制約ではない
- 今の PRD・architecture との違いを把握し、必要な変更と影響範囲をはっきりさせる
- 既存の制約と衝突するなら、影響・リスク・変更案を説明して判断を仰ぐ。安全性や技術的な制約を無視してよいという意味ではない
- **実装が入った PR で、変わったものの正本を書き換える。** 要件・振る舞いが変われば PRD、技術構成が変われば architecture、手順が変われば runbooks、プロダクト全体の目的・提供価値・成功条件が変われば product.md。実装していない案を、実装済みの要件として PRD に書かない
- 同じ機能の要件は、新しい PRD を足さずに既存の PRD を書き換える。PRD の書き方は [docs/prds/README.md](docs/prds/README.md) にある

## 判断の理由を残す

**なぜその形にしたか、採らなかった案、トレードオフは、PR の本文とコミットに書く。** 理由を残すための文書は足さない。後から理由をたどるときは、`git log`・`git blame` から、その変更を入れたコミットと PR を読む。

次の変更では、PR の本文に、採った案・採らなかった案とその理由・今回やらないことを書く。

- 技術選定（ライブラリ・基盤を入れる・替える）
- アーキテクチャの変更（構成・依存の向き・開発規約を変える）
- DB スキーマの変更
- 認証・権限・公開範囲の変更
- 複数の機能にまたがる変更
- 複数の実現方法を比べて選ぶ必要がある変更

## 実装の前に読む

`apps/app`・`apps/admin` にファイルを追加・移動するときは [docs/architecture/directory-structure.md](docs/architecture/directory-structure.md) に従う。判断フロー・各ディレクトリの責務・依存の方向・命名がそこにある。**以下の「守ること」から「命名」までは要約で、食い違ったら directory-structure.md が正本。** 正本を直したら、ここも合わせる。

**新しい D1 は、デプロイの前に `--location apac` を付けて作る。** 手順と理由は [docs/runbooks/create-d1.md](docs/runbooks/create-d1.md) にある。

## 守ること

**URL の定義は `src/routes/`、画面の実体は `src/screens/<画面>/`。** 画面はまとまりを並べる場所で、中身のロジックは持たない。

**ひとまとまりのものは 1 ディレクトリにまとめる。** データ取得も型も表示部品も、そのまとまりのものは全部。名前は企画やデザインの会話に出てくる言葉で付ける。技術で振り分けると、1 つ直すのに何か所も開くことになる。

**まとまりどうし・画面どうしは参照しない。** 参照した瞬間、片方を触るともう片方が壊れる。組み合わせるのは 1 つ上の `index.tsx` の仕事。

**2 つ目の参照元が現れてから外に出す。** 使う画面が 1 つのうちは `screens/<画面>/components/<まとまり>/` に置き、2 つ目の画面が使い始めたら `src/features/<ドメイン>/` へ上げる。出す前と後で中の形は変わらないので、移動だけで済む。**ただし `@packages/db` を引く `api/` を含むまとまりは、今は lint の都合で画面が 1 つでも `features/<ドメイン>/` に置く。** 規約と lint のどちらに寄せるかは未決（[directory-structure.md](docs/architecture/directory-structure.md#未決-db-を引くまとまりの置き場所)）。

**静的ファイルはまとまりで決めない。** ソースから参照するなら使う場所の隣に置いて import、参照しない・ファイル名を保つ必要があるなら `public/`。

**`apps/app` のアイコンは `@/lib/icon` の `Icon` を通して描く。** `reicon-react` から import したアイコンを `<Icon icon={Home} />` のように渡す。`<Home />` と直接書くと、ライブラリの既定の太さ 1.5 で描かれてしまう。このアプリの太さ 2 は `Icon` が渡している。

## 置き場所（要約）

上から順に当てはめて、最初に該当したところに置く。パスは `apps/app` で書いているが、`apps/admin` も同じ。

1. ビルド時・運用時にしか動かない（Node API を使う、Vite plugin、生成スクリプト） → `apps/app/scripts/`
2. URL を増やす・変える → `apps/app/src/routes/`
3. 画面そのもの → `apps/app/src/screens/<画面>/index.tsx`
4. ひとまとまりで名前が付く → 使う画面が 1 つなら `apps/app/src/screens/<画面>/components/<まとまり>/`、2 つ以上なら `apps/app/src/features/<ドメイン>/`（`@packages/db` を引くものは今は `features/`。上の「守ること」）
5. その画面の組み立てにしか意味がない → `apps/app/src/screens/<画面>/` の `components/`・`hooks/`・`types/`・`utils/`
6. ドメインを知らない表示部品 → `apps/app/src/components/ui/`（単体で完結する部品）か `apps/app/src/components/layout/`（サイト共通の枠）。`apps/admin` は `components/ui/` を作らず Astryx を使う
7. ドメインを知らない hooks → `apps/app/src/hooks/`
8. 副作用のない汎用関数 → `apps/app/src/utils/`
9. 外部ライブラリの設定・ラッパー → `apps/app/src/lib/`

**迷ったら 4。** 企画やデザインの会話で名前が出てくるなら、そのまとまりで 1 ディレクトリにする。

`src/components/ui`・`src/components/layout`・`src/hooks`・`src/utils` は空の状態で始まる。必要になったらこのパスに作り、別名のディレクトリを新設しない。`scripts/` はフラットに置き、サブディレクトリを作らない。

**`screens/<画面>/api/` は作らない。** 取得は `routes/` の `loader` からそのまとまりの `api/` を呼ぶ。複数のまとまりをまたぐ画面も、組み合わせるのは `loader` の仕事。

## 破ってはいけない依存の向き

```text
routes/ → screens/ → features/ → components/, hooks/, utils/, lib/
        → features/           → @packages/db
```

- `src/` から `scripts/` を import しない
- まとまりどうしを import しない（組み合わせるのは `screens/<画面>/index.tsx` の仕事）
- `screens/a` から `screens/b` を import しない。他の画面が欲しがったら、それが `features/` へ上げる合図
- `screens/` から `routes/` を import しない
- `features/` から `screens/`・`routes/`・他の `features/` を import しない
- 共有層（`components/`・`hooks/`・`utils/`・`lib/`）から `features/`・`screens/`・`routes/` を import しない
- `@packages/db` に触るのは、そのまとまりの `api/` だけ
- `@packages/db` を Node で動く script・`*.config.ts` から import しない（workerd 専用。schema が要るなら `packages/db/src/schema.ts` を直接指す）
- `routes/` にロジックを書かない
- アプリどうし（`apps/app` と `apps/admin`）は参照しない。両方が欲しがるものは `packages/` へ出す

**多くは `.oxlintrc.json` の `overrides` + `no-restricted-imports` で `pnpm lint` が落ちる。** `@/` エイリアス形と相対パス形の両方を塞いであるので、`../../screens/top` のような書き方でも落ちる。**lint で止まらないのは**、まとまりどうしの参照（同じ画面の中は相対パスなので機械的に区別できない）、`features/` の中で `api/` 以外から `@packages/db` を引くこと、Node の script からの `@packages/db`、`routes/` のロジック、アプリどうしの参照。ここはレビューで見る。

`@packages/auth` の `auth-client` は better-auth のクライアント SDK で、性質は `lib/` に置くものと同じ。ドメインではないので画面から直接使ってよい。

## 命名

**パスに現れるものは、ディレクトリもファイルもすべて kebab-case。** PascalCase になるのはコードの中の識別子（コンポーネント名・型名）だけ。

大文字小文字を混ぜないのは、macOS は区別せず CI（Linux）は区別するため。混ぜた時点で「ローカルで通るのにビルドで落ちる」を踏む。

- ディレクトリ → kebab-case（`screens/user-detail/`, `features/users/`, `components/ui/`）
- ファイル → kebab-case（`user-card.tsx`, `get-users.ts`）
- ファイル名と中の識別子は綴りだけ変えて対応させる（`user-card.tsx` が `UserCard` を export）。default export は使わない
- CSS やテストを添えたくなったら kebab-case のディレクトリを切って `index.tsx` に置く
- バレルファイル（再 export だけの `index.ts`）は作らない

**import のパスは `git ls-files` の表記と一字一句合わせる。**

ドキュメントのファイル名の付け方は [docs/README.md](docs/README.md#命名) にある。
