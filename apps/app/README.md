# app

ディレクトリ構成と置き場所の規約は [docs/architecture/20260819_directory-structure.md](../../docs/architecture/20260819_directory-structure.md) にある。**新しいファイルを作る前に読む。**

## 構成の要点

- `src/routes/` は URL と loader の定義だけを書き、画面の中身は `src/pages/<Page>/` に置く
- データ取得は `src/server/` の server function にまとめ、`routes/` の loader から呼ぶ
- 複数の画面から使うものだけ `src/components/{ui,layout}/`・`src/hooks/`・`src/lib/` に上げる
