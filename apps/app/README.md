# app

ディレクトリ構成と置き場所の規約は [docs/architecture/20260819_directory-structure.md](../../docs/architecture/20260819_directory-structure.md) にある。**新しいファイルを作る前に読む。**

## 構成の要点

- 外枠は Layer（`src/routes/`・`src/screens/`・共有層）、内側は Feature（ドメインの単位）
- ドメインの言葉で名前が付くものは 1 ディレクトリにまとめる。データ取得も型も表示部品も、そのドメインのものは全部
- そのドメインを使う画面が 1 つのうちは `src/screens/<画面>/components/<ドメイン>/`、2 つ目の画面が使い始めたら `src/features/<ドメイン>/` へ上げる
- `src/routes/` は URL と loader の定義だけを書き、画面の中身は `src/screens/<画面>/` に置く
- 画面はドメインを組み合わせて 1 画面にする。ドメインのロジックは持たない
- ドメインを知らないものだけ `src/components/{ui,layout}/`・`src/hooks/`・`src/utils/`・`src/lib/` に上げる
- `@packages/db` に触るのはドメインの `api/` だけ

依存の向きは `.oxlintrc.json` で禁止していて、`pnpm lint` で落ちる。
