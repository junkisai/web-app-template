# app

## 技術スタック

- Astro
- CSS Modules (SCSS)

### 静的解析

- Biome
  - 静的解析・フォーマット解析
- Prettier
  - Biomeで対応していないファイル拡張子（astro,md,yml,yaml,json）のフォーマット解析
  - AstroのBiomeサポートはまだ完全ではないため、Prettierに任せています
    - ref. <https://biomejs.dev/internals/language-support/#html-super-languages-support>
- TypeScript
  - 型チェック
