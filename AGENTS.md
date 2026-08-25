# AGENTS.md

## 実装の前に読む

`apps/app` にファイルを追加・移動するときは [docs/architecture/20260819_directory-structure.md](docs/architecture/20260819_directory-structure.md) に従う。判断フロー・各ディレクトリの責務・依存の方向・命名がそこにある。

## 守ること

**URL の定義は `src/routes/`、画面の実体は `src/screens/<画面>/`。** 画面はまとまりを並べる場所で、中身のロジックは持たない。

**ひとまとまりのものは 1 ディレクトリにまとめる。** データ取得も型も表示部品も、そのまとまりのものは全部。名前は企画やデザインの会話に出てくる言葉で付ける。技術で振り分けると、1 つ直すのに何か所も開くことになる。

**まとまりどうし・画面どうしは参照しない。** 参照した瞬間、片方を触るともう片方が壊れる。組み合わせるのは 1 つ上の `index.tsx` の仕事。

**2 つ目の参照元が現れてから外に出す。** 使う画面が 1 つのうちは `screens/<画面>/components/<まとまり>/` に置き、2 つ目の画面が使い始めたら `src/features/<ドメイン>/` へ上げる。出す前と後で中の形は変わらないので、移動だけで済む。

## 置き場所（要約）

上から順に当てはめて、最初に該当したところに置く。

1. ビルド時・運用時にしか動かない（Node API を使う、Vite plugin、生成スクリプト） → `apps/app/scripts/`
2. URL を増やす・変える → `apps/app/src/routes/`
3. 画面そのもの → `apps/app/src/screens/<画面>/index.tsx`
4. ひとまとまりで名前が付く → 使う画面が 1 つなら `apps/app/src/screens/<画面>/components/<まとまり>/`、2 つ以上なら `apps/app/src/features/<ドメイン>/`
5. その画面の組み立てにしか意味がない → `apps/app/src/screens/<画面>/` の `components/`・`hooks/`・`types/`・`utils/`
6. ドメインを知らない表示部品 → `apps/app/src/components/ui/`（単体で完結する部品）か `apps/app/src/components/layout/`（サイト共通の枠）
7. ドメインを知らない hooks → `apps/app/src/hooks/`
8. 副作用のない汎用関数 → `apps/app/src/utils/`
9. 外部ライブラリの設定・ラッパー → `apps/app/src/lib/`

**迷ったら 4。** 企画やデザインの会話で名前が出てくるなら、そのまとまりで 1 ディレクトリにする。

`src/components/ui`・`src/components/layout`・`src/hooks`・`src/utils` は空の状態で始まる。必要になったらこのパスに作り、別名のディレクトリを新設しない。`apps/app/scripts/` はフラットに置き、サブディレクトリを作らない。

**`screens/<画面>/api/` は作らない。** 取得は `routes/` の `loader` からそのまとまりの `api/` を呼ぶ。複数のまとまりをまたぐ画面も、組み合わせるのは `loader` の仕事。

## 破ってはいけない依存の向き

```text
routes/ → screens/ → features/ → components/, hooks/, utils/, lib/
        → features/           → @packages/db
```

`features/` は 2 つ目の画面が同じドメインを使い始めてから作る。

- `src/` から `scripts/` を import しない
- まとまりどうしを import しない（組み合わせるのは `screens/<画面>/index.tsx` の仕事）
- `screens/a` から `screens/b` を import しない。他の画面が欲しがったら、それが `features/` へ上げる合図
- `screens/` から `routes/` を import しない
- `features/` から `screens/`・`routes/`・他の `features/` を import しない
- 共有層（`components/`・`hooks/`・`utils/`・`lib/`）から `features/`・`screens/`・`routes/` を import しない
- `@packages/db` に触るのは、そのまとまりの `api/` だけ
- `routes/` にロジックを書かない

最後の 1 つと「まとまりどうし」以外は `.oxlintrc.json` の `overrides` + `no-restricted-imports` で `pnpm lint` が落ちる。**`@/` エイリアス形と相対パス形の両方を塞いである**ので、`../../screens/top` のような書き方でも落ちる。画面の中のまとまりどうしの参照は相対パスなので機械的に区別できず、レビューで見る。

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
