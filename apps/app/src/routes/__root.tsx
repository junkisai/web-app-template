import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'

import { stylexDevLinks, stylexDevScripts } from '@/lib/stylex-dev-head'
import appCss from '@/styles/globals.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start App',
      },
      {
        name: 'description',
        content: 'TanStack Start and TanStack Router application',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      ...stylexDevLinks,
    ],
    scripts: stylexDevScripts,
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="ja">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
