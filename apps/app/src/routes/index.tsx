import { createFileRoute } from '@tanstack/react-router'

import { getUsers } from '@/features/users/api/get-users'
import { TopPage } from '@/screens/top'

export const Route = createFileRoute('/')({
  loader: async () => await getUsers(),
  component: Home,
})

function Home() {
  const users = Route.useLoaderData()

  return <TopPage users={users} />
}
