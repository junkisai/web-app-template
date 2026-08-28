# admin

管理画面。構成は `apps/app` と同じ TanStack Start + Vite + Cloudflare Workers で、**UI だけ [Astryx](https://astryx.atmeta.com/docs/getting-started) のコンポーネントで組む。**

置き場所の規約は [docs/architecture/20260819_directory-structure.md](../../docs/architecture/20260819_directory-structure.md) にある。**新しいファイルを作る前に読む。** 導入の経緯と検討した他の案は [docs/design-docs/20260828_admin-app-astryx.md](../../docs/design-docs/20260828_admin-app-astryx.md) にある。

## 起動

```sh
pnpm -F admin dev     # http://localhost:3001
```

`apps/app` は 3000、`apps/admin` は 3001 を使う。`.env` のシンボリックリンクがこの package にも要る。

```sh
ln -s ../../.env ./.env
```

## Astryx

### 何を入れているか

| package                       | 役割                                                      |
| ----------------------------- | --------------------------------------------------------- |
| `@astryxdesign/core`          | コンポーネント本体。ビルド済みの JS と CSS で配られる     |
| `@astryxdesign/theme-neutral` | トークン（色・余白・角丸・タイポグラフィ）。無彩色        |
| `@astryxdesign/cli`           | コンポーネントの API を引くための CLI。ビルドには要らない |

**version は 3 つとも揃える。** `theme-neutral` が `core` を版指定の peer dependency に取っているため、ずれると install が落ちる。

### 配線は 2 か所だけ

Astryx はビルド済みで配られるので、Vite のプラグインは要らない。

1. [src/styles/globals.css](src/styles/globals.css) — CSS を 3 枚 import する。**順番に意味がある**（reset → astryx → theme の順で後ろほど強い）
2. [src/lib/astryx-provider.tsx](src/lib/astryx-provider.tsx) — `Theme` でトークンを流し込む。テーマの CSS は `@scope` で `data-astryx-theme` の中に閉じているので、**これを通さないとトークンが 1 つも効かない**

### コンポーネントの API を調べる

ドキュメントサイトを読むより CLI が速い。props・variant・用例・テーマの当て方が出る。

```sh
pnpm -F admin exec astryx component --list      # 一覧
pnpm -F admin exec astryx component Table       # 1 つ分の全 API
pnpm -F admin exec astryx template --list       # ページ単位のテンプレート
pnpm -F admin exec astryx docs tokens           # トークンの一覧
```

### 自前でスタイルを書くとき

**まず Astryx のコンポーネントと props で足りないかを見る。** `Stack` の `gap` / `padding`、`Card` の `elevation` のように、間隔と装飾はほぼ props で足りる。自前の `Button` や `Table` を作ると、同じものが 2 系統になる。

どうしても要るときは `stylex.create` で書く（`apps/app` と同じ）。値は Astryx のトークンを CSS 変数で参照する。

```ts
const styles = stylex.create({
  panel: {
    backgroundColor: 'var(--color-background-surface)',
    borderRadius: 'var(--radius-container)',
  },
})
```

`components/ui/` は作らない。ドメインを知らない表示部品は Astryx が持っている。

## まだ無いもの

- **認証・認可。** この app は誰でも見られる。`@packages/auth` は `apps/app` に配線済みなので、運用に乗せる前にそこから移す
- **`LinkProvider`。** Astryx の Link は差し替え先に `href` を渡すが、TanStack Router の `Link` が取るのは `to` で `href` を受けない。素通しすると実行時に壊れるため、既定の `<a>`（フルリロード）のままにしてある。画面が増えて内部リンクが要るようになったら、`href` を `to` へ移すアダプタを書いて `LinkProvider` に渡す
- **Cloudflare へのデプロイ。** `wrangler.jsonc` の `name` は TODO のまま
