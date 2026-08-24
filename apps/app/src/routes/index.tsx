import { createFileRoute } from '@tanstack/react-router'

import { TopPage } from '@/screens/top'
import { getUsers } from '@/features/users/api/get-users'

export const Route = createFileRoute('/')({
  loader: async () => await getUsers(),
  component: Home,
})

function Home() {
  const users = Route.useLoaderData()

  return <TopPage users={users} />
}
