import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [
    react({
      experimentalReactChildren: true,
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  server: {
    port: 3001,
  },
})
