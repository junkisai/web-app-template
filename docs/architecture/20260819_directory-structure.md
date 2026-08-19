# ディレクトリ構成

`apps/app` の置き場所の規約。**新しいファイルを作る前にここを読み、下の判断フローで置き場所を決める。**

基本は Feature 型（画面ごとにまとめる）で、共通化したいものだけ Layer 型（技術ごとにまとめる）に上げる。

## 設計の考え方

ディレクトリの分け方には 2 つの軸がある。

| 軸 | 何で分けるか | 例 | 強い点 | 弱い点 |
| --- | --- | --- | --- | --- |
| Layer 型 | 技術 | `components/`, `hooks/`, `lib/`、Atomic Design、MVC | 階層を作ることで、共通化によって生じる依存の向きを整理できる | 階層の定義が曖昧になり、必要以上の階層ができて依存が複雑になる |
| Feature 型 | ドメイン | `pages/<Page>/` に部品・hooks・server function を同居させる | 疎結合・高凝集になり、影響範囲が限定される | ドメインの境界が曖昧になり、ドメイン間で処理が重複する |

どちらかが正しいのではない。**弱点が互い違いなので、組み合わせて打ち消す。**

方針は 2 つ。

1. **基本は Feature 型で考える。** 凝集度が上がり、変更の影響範囲が読める
2. **共通化したいものだけ Layer 型に上げる。** 共通化すると複数箇所から参照されて依存が生まれるので、技術単位の階層に置いて向きを一方向に固定する

この構成では `pages/<Page>/` が Feature、`components/`・`server/`・`hooks/`・`lib/` が Layer にあたる。判断フローの 3 が Feature 側、4〜7 が Layer 側。

**入れ子になっているのが要点。** `pages/Top/components/` は「Feature の中の Layer」。逆に `components/layout/SiteHeader/` は「Layer の中の小さな Feature」で、必要ならスタイルやテストを同居させられる。この入れ子はどの深さでも同じ考え方で繰り返せるので、階層が深くなっても判断の仕方は変わらない。

### 表に載っていないものを置くとき

判断フローに当てはまらないものが出たら、次の順で考える。

1. **いくつの場所から使われるか。** 1 つなら Feature 側（使う場所の中）に閉じる
2. 2 つ以上から使われるなら、**何の技術か**で Layer を選ぶ
3. どの Layer にも当てはまらないとき、**Layer を新設する前に一番近い Layer に置く。** 同種が 3 つ目に現れてから切り出す
4. それでも迷ったら、**依存の向きが一方向に保てる置き方**を選ぶ

**先に共通化しない。** 「あとで使うかも」で Layer に上げると、参照元が 1 つのまま依存だけが増える。Feature 型の強み（影響範囲が読める）を捨てて、Layer 型の弱み（階層が増えて依存が複雑になる）だけを受け取ることになる。

この「組み合わせる」判断の根拠として、参考記事はコンウェイの法則を挙げている。組織が最終的にハイブリッド形態に落ち着くのと同じように、システムの構造もハイブリッドに落ち着くという見立てである。

参考: [フロントエンドのディレクトリ設計を考える](https://zenn.dev/mybest_dev/articles/c0570e67978673)

## 全体像

```text
apps/app/
├─ scripts/                   ビルド・運用時だけ動くコード。ブラウザに載らない
├─ public/                    そのまま配信される静的ファイル
└─ src/                       ブラウザに載るコード
   ├─ routes/                 URL とページの対応だけを書く薄い層
   ├─ pages/                  画面の実体。1 画面 1 ディレクトリ
   │  └─ <Page>/
   │     ├─ index.tsx         画面のルートコンポーネント
   │     ├─ components/       この画面だけで使うコンポーネント
   │     ├─ hooks/            この画面だけで使う hooks
   │     └─ server/           この画面だけで使う server function
   ├─ components/             複数の画面から使うコンポーネント
   │  ├─ ui/                  ドメインを知らない部品（Button, Modal など）
   │  └─ layout/              サイト共通の枠（Header, Footer など）
   ├─ server/                 複数の画面から使う server function（Data Access Layer）
   ├─ hooks/                  複数の画面から使う hooks
   ├─ lib/                    複数の画面から使う純粋な関数
   ├─ styles/                 グローバル CSS
   ├─ router.tsx              ルーター定義
   └─ routeTree.gen.ts        TanStack Router が生成。手で触らない
```

`components/ui`・`components/layout`・`hooks` は空の状態で始まる。**必要になったらこのパスに作る。別の名前のディレクトリを新設しない。**

`scripts/` はサブディレクトリを作らずフラットに置き、ファイル名で役割を表す。

## 置き場所の判断フロー

新しいファイルを作るとき、上から順に当てはめる。

1. **ビルド時・運用時にしか動かないか**（Vite plugin、生成スクリプト、Node API を使う）→ `scripts/`
2. **URL を増やす／変えるか** → `src/routes/`
3. **1 つの画面でしか使わないか** → `src/pages/<Page>/` の `components/`・`hooks/`・`server/`
4. **複数の画面から使うコンポーネントか**
   - ドメインを知らない部品 → `src/components/ui/`
   - サイト共通の枠 → `src/components/layout/`
5. **複数の画面から使う server function か** → `src/server/`
6. **複数の画面から使う hooks か** → `src/hooks/`
7. **複数の画面から使う純粋な関数か** → `src/lib/`

**迷ったら、まず 3（画面の中）に置く。** 2 つ目の画面から使いたくなった時点で 4〜7 に上げる。先に共通化しない。

## 各層の責務

| 場所 | 責務 | やらないこと |
| --- | --- | --- |
| `scripts/` | 生成処理、デプロイ補助、Vite plugin | React を書く |
| `src/routes/` | URL・loader・`head`（meta / canonical）の定義。中身は `pages/` に委譲する | 画面のマークアップを書く |
| `src/pages/<Page>/` | 画面の組み立て。受け取ったデータを並べる | データ取得の実装（`server/` に置き、loader から呼ぶ） |
| `src/components/ui/` | 単体で完結する見た目の部品 | ドメインの型を知る |
| `src/components/layout/` | 全ページ共通の枠 | ドメインの型を知る |
| `src/server/` | server function、DB / 外部 API とのやりとり | 画面を書く |
| `src/lib/` | 入力と出力だけで完結する関数 | React に依存する |

`packages/db` や `packages/auth` を直接触るのは `src/server/` と `src/routes/` だけにする。コンポーネントから DB を引かない。

## 依存の方向

矢印の向きにだけ import する。逆向きが必要になったら、設計を間違えている。

```text
routes/  →  pages/  →  components/{ui,layout}
                    →  hooks/, lib/
         →  server/  →  @packages/*
```

守るルール。

- **`src/` から `scripts/` を import しない。** ブラウザに Node のコードが載る
- **`pages/a` から `pages/b` を import しない。** 共有したくなったら `components/` に上げる
- **`components/` は `server/` と `@packages/db` を import しない。** データを持たない部品にしておく
- **`server/` から `pages/`・`components/`・`routes/` を import しない。**
- **`routes/` にロジックを書かない。** loader の中で組み立てたくなったら `pages/` か `lib/` に出す

### lint で強制している

最後の 1 つ（`routes/` にロジックを書かない）以外は `.oxlintrc.json` の `overrides` + `no-restricted-imports` で `pnpm lint` が落ちる。違反すると、どこに置くべきかを書いたメッセージが出る。

知っておくべき制約が 2 つある。

- **oxlint の `overrides` は、同じルールが複数のブロックにマッチすると最後のブロックが前のブロックを置き換える**（合成されない）。そのためディレクトリごとのブロックに共通ルールを書き写している。ルールを足すときは該当する全ブロックに入れる
- **判定は import 文の文字列に対するパターンマッチで、解決後のパスではない。** ディレクトリを越える import には必ず `@/` エイリアスを使う。`../../components/...` のような相対パスで書くと検出をすり抜ける

## 命名

**判定基準は 1 つ。そのディレクトリが React コンポーネント 1 つ、または画面 1 つを指すなら PascalCase、それ以外は小文字。**

`ui` と `layout` はコンポーネントではなく分類なので小文字。

| 対象 | 記法 | 例 |
| --- | --- | --- |
| コンポーネント 1 つを指すディレクトリ | PascalCase | `layout/SiteHeader/`, `components/Pagination/` |
| 画面 1 つを指すディレクトリ | PascalCase | `pages/Top/`, `pages/Login/` |
| 分類のディレクトリ | 小文字 | `pages/`, `components/`, `ui/`, `layout/`, `server/`, `hooks/`, `lib/`, `styles/`, `scripts/` |
| コンポーネントのファイル | `index.tsx` 固定 | `pages/Top/index.tsx` |
| コンポーネント以外のモジュール | kebab-case | `lib/native-fetch-shim.ts`, `server/queries/users.ts` |
| URL になるもの | 小文字・ハイフン | `routes/` |

コンポーネントは 1 ディレクトリ 1 ファイルで `index.tsx` に置き、名前付き export にする。コンポーネント名はディレクトリ名と対応させる（`pages/Top/index.tsx` は `TopPage` を export する）。

`routes/` の中身は TanStack Router が URL に対応づけるので、記法を変えられない。

macOS はファイル名の大文字小文字を区別しないが、CI（Linux）は区別する。**import のパスは `git ls-files` の表記と一字一句合わせる。** ローカルで通ってもビルドが落ちる。
