# AGENTS.md

## 実装の前に読む

`apps/app` にファイルを追加・移動するときは [docs/architecture/20260819_directory-structure.md](docs/architecture/20260819_directory-structure.md) に従う。判断フロー・各層の責務・依存の方向・命名がそこにある。

## なぜこの形か

分け方には Layer 型（技術で分ける。依存の向きを整理できるが階層が増えて複雑になる）と Feature 型（ドメインで分ける。高凝集で影響範囲が読めるが境界が曖昧になり重複しやすい）がある。弱点が互い違いなので組み合わせる。

**外枠は Layer、内側は Feature。** `src/routes/` `src/screens/` と共有層（`components/`, `hooks/`, `utils/`, `lib/`）で外枠を切り、その内側をドメインの単位で切る。外枠を Layer にするのは、依存の向きを固定する装置が最初から効くから。

**ドメインの言葉で名前が付くものは、1 ディレクトリにまとめる。** データ取得も型も表示部品も、そのドメインのものは全部。付かないものだけ共有層に置く。

**URL の定義は `src/routes/`、画面の実体は `src/screens/<画面>/`。** 画面はドメインを組み合わせて 1 画面にする場所で、ドメインのロジックは持たない。

`screens/<画面>/components/<ドメイン>/` のように、Layer と Feature は交互に入れ子にできる。この考え方はどの深さでも同じ。

**先に共通化しない。ドメインも例外にしない。** そのドメインを使う画面が 1 つのうちは `screens/<画面>/components/<ドメイン>/` に置き、2 つ目の画面が使い始めたら `src/features/<ドメイン>/` へ上げる。上げる前と後で中の形は変わらないので、移動だけで済む。

## 置き場所（要約）

上から順に当てはめて、最初に該当したところに置く。

1. ビルド時・運用時にしか動かない（Node API を使う、Vite plugin、生成スクリプト） → `apps/app/scripts/`
2. URL を増やす・変える → `apps/app/src/routes/`
3. 画面そのもの → `apps/app/src/screens/<画面>/index.tsx`
4. ドメインの言葉で名前が付く → 使う画面が 1 つなら `apps/app/src/screens/<画面>/components/<ドメイン>/`、2 つ以上なら `apps/app/src/features/<ドメイン>/`
5. その画面の組み立てにしか意味がない → `apps/app/src/screens/<画面>/` の `components/`・`hooks/`・`types/`・`utils/`
6. ドメインを知らない表示部品 → `apps/app/src/components/ui/`（単体で完結する部品）か `apps/app/src/components/layout/`（サイト共通の枠）
7. ドメインを知らない hooks → `apps/app/src/hooks/`
8. 副作用のない汎用関数 → `apps/app/src/utils/`
9. 外部ライブラリの設定・ラッパー → `apps/app/src/lib/`

**迷ったら 4。** ドメインの言葉で名前を付けられるなら、ドメインの単位で 1 ディレクトリにまとめる。

`src/components/ui`・`src/components/layout`・`src/hooks`・`src/utils` は空の状態で始まる。必要になったらこのパスに作り、別名のディレクトリを新設しない。`apps/app/scripts/` はフラットに置き、サブディレクトリを作らない。

**`screens/<画面>/api/` は作らない。** 取得は `routes/` の `loader` からドメインの `api/` を呼ぶ。複数ドメインをまたぐ画面も、組み合わせるのは `loader` の仕事。

## 破ってはいけない依存の向き

```text
routes/ → screens/ → features/ → components/, hooks/, utils/, lib/
        → features/           → @packages/db
```

`features/` は 2 つ目の画面が同じドメインを使い始めてから作る。

- `src/` から `scripts/` を import しない
- ドメインどうしを import しない（組み合わせるのは `screens/<画面>/index.tsx` の仕事）
- `screens/a` から `screens/b` を import しない。他の画面が欲しがったら、それが `features/` へ上げる合図
- `screens/` から `routes/` を import しない
- `features/` から `screens/`・`routes/`・他の `features/` を import しない
- 共有層（`components/`・`hooks/`・`utils/`・`lib/`）から `features/`・`screens/`・`routes/` を import しない
- `@packages/db` に触るのはドメインの `api/` だけ
- `routes/` にロジックを書かない

最後の 1 つと「ドメインどうし」以外は `.oxlintrc.json` の `overrides` + `no-restricted-imports` で `pnpm lint` が落ちる。**`@/` エイリアス形と相対パス形の両方を塞いである**ので、`../../screens/top` のような書き方でも落ちる。画面の中のドメインどうしの参照は相対パスなので機械的に区別できず、レビューで見る。

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
