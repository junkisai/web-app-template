import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  theme: {
    extend: {
      tokens: {
        shadows: {
          md: {
            value: 'inset 0 0 0 .4px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
  },
  outdir: 'styled-system',
  jsxFramework: 'react',
})
