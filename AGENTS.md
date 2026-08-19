# AGENTS.md

## 実装の前に読む

`apps/app` にファイルを追加・移動するときは [docs/architecture/20260819_directory-structure.md](docs/architecture/20260819_directory-structure.md) に従う。判断フロー・各層の責務・依存の方向・命名がそこにある。

## なぜこの形か

分け方には Layer 型（技術で分ける。依存の向きを整理できるが階層が増えて複雑になる）と Feature 型（ドメインで分ける。高凝集で影響範囲が読めるが境界が曖昧になり重複しやすい）がある。弱点が互い違いなので組み合わせる。

**基本は Feature 型（`src/pages/<Page>/`）で考え、複数の画面から使うものだけ Layer 型（`components/`, `server/`, `hooks/`, `lib/`）に上げる。** 共通化すると複数箇所から参照されて依存が生まれるため、技術単位の階層に置いて向きを一方向に固定する。

`src/pages/<Page>/components/` のように入れ子にできる。「Feature の中の Layer」で、この考え方はどの深さでも同じ。

**先に共通化しない。** 参照元が 1 つのまま Layer に上げると、Feature 型の強みを捨てて Layer 型の弱みだけを受け取る。表に載っていないものは「いくつの場所から使われるか」→「何の技術か」→「依存の向きが一方向に保てるか」の順で決める。詳細は architecture のドキュメントにある。

## 置き場所（要約）

上から順に当てはめて、最初に該当したところに置く。

1. ビルド時・運用時にしか動かない（Node API を使う、Vite plugin、生成スクリプト） → `apps/app/scripts/`
2. URL を増やす・変える → `apps/app/src/routes/`
3. 1 つの画面でしか使わない → `apps/app/src/pages/<Page>/` の `components/`・`hooks/`・`server/`
4. 複数の画面から使うコンポーネント → `apps/app/src/components/ui/`（ドメインを知らない部品）か `apps/app/src/components/layout/`（サイト共通の枠）
5. 複数の画面から使う server function → `apps/app/src/server/`
6. 複数の画面から使う hooks → `apps/app/src/hooks/`
7. 複数の画面から使う純粋な関数 → `apps/app/src/lib/`

迷ったら 3 に置く。2 つ目の画面から使いたくなった時点で上に上げる。先に共通化しない。

`src/components/ui`・`src/components/layout`・`src/hooks` は空の状態で始まる。必要になったらこのパスに作り、別名のディレクトリを新設しない。`apps/app/scripts/` はフラットに置き、サブディレクトリを作らない。

## 破ってはいけない依存の向き

```text
routes/ → pages/  → components/{ui,layout}, hooks/, lib/
        → server/ → @packages/*
```

- `src/` から `scripts/` を import しない
- `pages/a` から `pages/b` を import しない
- `components/` は `server/` と `@packages/db` を import しない
- `server/` から `pages/`・`components/`・`routes/` を import しない
- `routes/` にロジックを書かない

最後の 1 つ以外は `.oxlintrc.json` の `overrides` + `no-restricted-imports` で `pnpm lint` が落ちる。**判定は import 文の文字列に対するパターンマッチなので、ディレクトリを越える import には必ず `@/` エイリアスを使う。** 相対パスで書くと検出をすり抜ける。

## 命名

**そのディレクトリが React コンポーネント 1 つ、または画面 1 つを指すなら PascalCase。それ以外は小文字。**

- コンポーネント・画面のディレクトリ → PascalCase（`pages/Top/`, `layout/SiteHeader/`）
- 分類のディレクトリ → 小文字（`pages/`, `components/`, `ui/`, `layout/`, `server/`, `hooks/`, `lib/`, `scripts/`）
- コンポーネントは `<Name>/index.tsx` に置き、named export する
- コンポーネント以外のモジュール → kebab-case（`lib/native-fetch-shim.ts`）
- URL になるもの（`routes/` の中）→ 小文字とハイフンのみ

macOS は大文字小文字を区別しないが CI は区別する。**import のパスは `git ls-files` の表記と一字一句合わせる。**
