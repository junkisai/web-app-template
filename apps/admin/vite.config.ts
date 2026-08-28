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
    //
    // Astryx 自体にこの plugin は要らない（ビルド済みの CSS と JS で配られる）。
    // 入れてあるのは、画面固有の調整で stylex.create を書いたときのため。
    // **StyleX はコンパイラが無くても書けてしまい、本番ビルドでだけスタイルが消える。**
    // 外すとその罠が残る。
    //
    // useCSSLayers は既定の false のまま使う。Astryx の CSS は @layer に入って
    // いるので、layer に入れない StyleX の出力はそれより後ろ（強い）になる。
    // 画面側で書いた調整が Astryx の既定に勝つ、という向きで揃う。
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
