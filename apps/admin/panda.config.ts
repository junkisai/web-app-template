import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  include: [
    './app/routes/**/*.{ts,tsx,js,jsx}',
    './app/components/**/*.{ts,tsx,js,jsx}',
  ],
  exclude: [],
  theme: {
    extend: {},
  },
  outdir: 'styled-system',
})
