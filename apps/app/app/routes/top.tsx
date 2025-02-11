import type { Route } from '@/react-router/+types/top'
import { css } from 'styled-system/css'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

export default function Home() {
  return (
    <div>
      <h1 className={css({ fontSize: '2xl', fontWeight: 'bold' })}>
        Welcome to the home page
      </h1>
    </div>
  )
}
