import { EmptyState } from '@astryxdesign/core/EmptyState'
import { Table, pixel, proportional } from '@astryxdesign/core/Table'
import { Text } from '@astryxdesign/core/Text'

import type { User } from '../types/user'

import type { TableColumn } from '@astryxdesign/core/Table'

type Props = {
  users: User[]
}

/**
 * ユーザーの一覧。列の定義がこの表の中身そのものなので、ここに置いている。
 *
 * 幅は `proportional()` / `pixel()` で明示する。省くと最小幅の下限が効かず、
 * 狭い画面で列が潰れる。
 */
export function UserTable({ users }: Props) {
  return (
    <Table
      data={users}
      columns={columns}
      dividers="rows"
      hasHover
      emptyState={
        <EmptyState
          title="ユーザーがいません"
          description="seed を流すか、アプリ側からユーザーを作成してください。"
        />
      }
    />
  )
}

const columns: TableColumn<User>[] = [
  {
    key: 'id',
    header: 'ID',
    width: pixel(80),
    align: 'end',
    renderCell: (user) => (
      <Text color="secondary" hasTabularNumbers>
        {user.id}
      </Text>
    ),
  },
  {
    key: 'name',
    header: '名前',
    width: proportional(2),
    renderCell: (user) => <Text weight="semibold">{user.name}</Text>,
  },
  {
    key: 'createdAt',
    header: '登録日時',
    width: proportional(1),
    renderCell: (user) => (
      <Text color="secondary" hasTabularNumbers>
        {formatDateTime(user.createdAt)}
      </Text>
    ),
  },
  {
    key: 'updatedAt',
    header: '更新日時',
    width: proportional(1),
    renderCell: (user) => (
      <Text color="secondary" hasTabularNumbers>
        {formatDateTime(user.updatedAt)}
      </Text>
    ),
  },
]

/**
 * DB には ISO 8601 の文字列で入っている。読めない値はそのまま出して、
 * 表示のために握りつぶさない。
 */
function formatDateTime(value: string) {
  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('ja-JP', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Tokyo',
  }).format(parsed)
}
