import path from 'node:path'
import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
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
        'src/native-fetch-shim.ts',
      ),
    },
  },
  plugins: [
    cloudflare({
      viteEnvironment: {
        name: 'ssr',
      },
    }),
    tanstackStart(),
    viteReact(),
    tailwindcss(),
  ],
})
