import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  theme: {
    extend: {
      tokens: {
        zIndex: {
          base: { value: 0 },
          dropdown: { value: 1000 },
          sticky: { value: 1100 },
          banner: { value: 1200 },
          overlay: { value: 1300 },
          modal: { value: 1400 },
          popover: { value: 1500 },
          skipLink: { value: 1600 },
          toast: { value: 1700 },
          tooltip: { value: 1800 },
        },
      },
    },
  },
  outdir: 'styled-system',
  jsxFramework: 'react',
})
