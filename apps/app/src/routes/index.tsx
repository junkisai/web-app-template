import { createFileRoute } from '@tanstack/react-router'
import { getUsers } from '@/server/queries/users'

export const Route = createFileRoute('/')({
  loader: async () => await getUsers(),
  component: Home,
})

function Home() {
  const users = Route.useLoaderData()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-emerald-500">
          Hello, TanStack Start!
        </h1>
      </div>
      <section className="space-y-3">
        <ul>
          {users.map((row) => (
            <li key={row.id}>{row.name}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
