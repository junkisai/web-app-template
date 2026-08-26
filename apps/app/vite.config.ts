import path from 'node:path'

import { cloudflare } from '@cloudflare/vite-plugin'
import stylex from '@stylexjs/unplugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    // Cloudflare Vite Plugin が workerd resolve condition を強制するため、
    // @libsql/client の依存ツリーに含まれる node-fetch が SSR バンドルに含まれてしまう。
    // バンドルされた node-fetch は Node.js の内部 HTTP モジュールと非互換でクラッシュするため、
    // ネイティブ fetch を使う shim に差し替える。
    alias: {
      'node-fetch': path.resolve(
        import.meta.dirname,
        'src/lib/native-fetch-shim.ts',
      ),
    },
  },
  plugins: [
    // React plugin より前に置く（Fast Refresh を壊さないため）。
    // useCSSLayers は既定の false のまま使う。@layer に入れると
    // globals.css の reset のほうが強くなり、StyleX のスタイルが負ける。
    stylex.vite({
      unstable_moduleResolution: {
        type: 'commonJS',
        rootDir: import.meta.dirname,
      },
      // StyleX は theme ファイル（*.stylex.ts）の実体を自前で解決するため、
      // tsconfig の paths ではなくここにも @/ を教える必要がある。
      aliases: {
        '@/*': [path.join(import.meta.dirname, 'src', '*')],
      },
    }),
    cloudflare({
      viteEnvironment: {
        name: 'ssr',
      },
    }),
    tanstackStart(),
    viteReact(),
  ],
})
