import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Stack } from '@astryxdesign/core/Stack'
import { Text } from '@astryxdesign/core/Text'

import { UserTable } from '@/features/users/components/user-table'

import type { User } from '@/features/users/types/user'

type Props = {
  users: User[]
}

/**
 * まとまりを並べて 1 画面にするだけ。整形も集計もここではしない。
 */
export function UserListPage({ users }: Props) {
  return (
    <Stack direction="vertical" gap={6} padding={6} maxWidth={1120}>
      <Stack direction="vertical" gap={1}>
        <Heading level={1}>ユーザー</Heading>
        <Text color="secondary">
          登録済みのユーザーが {users.length} 件あります。
        </Text>
      </Stack>

      <Card padding={0} elevation="low">
        <UserTable users={users} />
      </Card>
    </Stack>
  )
}
