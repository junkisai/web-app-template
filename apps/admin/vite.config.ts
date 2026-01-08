import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    ...tanstackStart({
      srcDirectory: 'src',
    }),
    react(),
  ],
})
