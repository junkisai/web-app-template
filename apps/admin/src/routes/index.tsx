import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <>
      <h1 className="text-2xl font-bold text-red-400">
        Hello, TanStack Start!
      </h1>
    </>
  )
}
