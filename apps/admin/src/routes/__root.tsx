import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'

import { AstryxProvider } from '@/lib/astryx-provider'
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
        title: 'Admin',
      },
      {
        name: 'description',
        content: 'Admin console built with Astryx',
      },
      // 管理画面は検索結果に出す意味がない
      {
        name: 'robots',
        content: 'noindex, nofollow',
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
        <AstryxProvider>
          <Outlet />
        </AstryxProvider>
        <Scripts />
      </body>
    </html>
  )
}
