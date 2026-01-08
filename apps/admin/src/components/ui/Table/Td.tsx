import type { FC, PropsWithChildren } from 'react'

export const Td: FC<PropsWithChildren> = ({ children }) => {
  return (
    <td className="min-w-40 max-w-[440px] h-9 px-2 text-sm font-medium text-left overflow-hidden whitespace-nowrap text-ellipsis">
      {children}
    </td>
  )
}
