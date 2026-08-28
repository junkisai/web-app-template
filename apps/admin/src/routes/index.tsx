import { createFileRoute } from '@tanstack/react-router'

import { getUsers } from '@/features/users/api/get-users'
import { UserListPage } from '@/screens/user-list'

export const Route = createFileRoute('/')({
  loader: async () => await getUsers(),
  component: UserList,
})

function UserList() {
  const users = Route.useLoaderData()

  return <UserListPage users={users} />
}
