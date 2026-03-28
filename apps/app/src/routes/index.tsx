import { createFileRoute } from '@tanstack/react-router'
import { TopPage } from '@/components/pages/top'
import { getUsers } from '@/server/queries/users'

export const Route = createFileRoute('/')({
  loader: async () => await getUsers(),
  component: Home,
})

function Home() {
  const users = Route.useLoaderData()

  return <TopPage users={users} />
}
