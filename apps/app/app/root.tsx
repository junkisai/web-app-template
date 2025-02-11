import type { LinksFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts } from '@remix-run/react'
import styles from './index.css?url'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export default function App() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
