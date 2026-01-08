import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@packages/db'

const getUsers = createServerFn({ method: 'GET' }).handler(async () => {
  const users = await prisma.user.findMany()
  return users
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const users = await getUsers()
    return { users }
  },
})

function Home() {
  const { users } = Route.useLoaderData()

  return (
    <>
      <h1 className="text-2xl font-bold text-red-400">Hello, TanStack Start!</h1>
      {users.map((user: { id: string; name: string }) => (
        <div key={user.id}>
          <h2>{user.name}</h2>
        </div>
      ))}
    </>
  )
}
