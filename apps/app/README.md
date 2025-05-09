# app

## ディレクトリ構成

```md
/
└─ src
   ├─ app: Next.js固有の実装のみ書く。components/pages/XXXPageを呼ぶ。
   ├─ components
   │  ├─ pages: ページコンポーネント
   │  │  └─ XXXPage
   │  │     ├─ index.ts
   │  │     ├─ XXXPage.tsx
   │  │     ├─ services: XXXPageに必要なデータを取得して成形したり・Actionを実行する関数群
   │  │     ├─ components: XXXPageに必要なコンポーネント群
   │  │     └─ hooks: XXXPageに必要なカスタムhooks群
   │  ├─ layouts: レイアウトコンポーネント
   │  │  └─ BaseLayout
   │  └─ ui: 複数ページで使用するUIコンポーネント群
   │     └─ Button
   ├─ types.ts
   ├─ libs
   │  └─ xxx
   │     └─ utils
   └─ features
      └─ xxx
         ├─ hooks
         ├─ types.ts
         └─ constants.ts
```
