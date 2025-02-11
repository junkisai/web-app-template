import { css } from '@/styled-system/css'
import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export default function Index() {
  return (
    <div
      className={css({
        fontSize: '2xl',
        fontWeight: 'bold',
        color: 'ButtonText',
      })}
    >
      Hello 🐼!
    </div>
  )
}
