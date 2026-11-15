# app

ディレクトリ構成と置き場所の規約は [docs/architecture/directory-structure.md](../../docs/architecture/directory-structure.md) にある。**新しいファイルを作る前に読む。** 以下は要約で、食い違ったらそちらが正本。アプリ全体の構成（DB・認証・環境変数・スタイリング）は [docs/architecture/overview.md](../../docs/architecture/overview.md)、画面の振る舞いは [docs/specs/](../../docs/specs/README.md) にある。

## 構成の要点

- `src/routes/` は URL と loader の定義だけを書き、画面の中身は `src/screens/<画面>/` に置く
- 画面はまとまりを並べて 1 画面にする。中身のロジックは持たない
- ひとまとまりのものは 1 ディレクトリにまとめる。データ取得も型も表示部品も、そのまとまりのものは全部
- まとまりどうし・画面どうしは参照しない。組み合わせるのは 1 つ上の `index.tsx` の仕事
- 使う画面が 1 つのうちは `src/screens/<画面>/components/<まとまり>/`、2 つ目の画面が使い始めたら `src/features/<ドメイン>/` へ上げる。ただし `@packages/db` を引く `api/` を含むまとまりは、lint の都合で今は画面が 1 つでも `src/features/<ドメイン>/` に置く（[未決](../../docs/architecture/directory-structure.md#未決-db-を引くまとまりの置き場所)）
- ドメインを知らないものだけ `src/components/{ui,layout}/`・`src/hooks/`・`src/utils/`・`src/lib/` に上げる
- `@packages/db` に触るのは、そのまとまりの `api/` だけ

依存の向きの多くは `.oxlintrc.json` で禁止していて、`pnpm lint` で落ちる。lint で止まらないものは [directory-structure.md の lint で強制している](../../docs/architecture/directory-structure.md#lint-で強制している)にある。
