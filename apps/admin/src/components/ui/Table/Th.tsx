import type { FC, PropsWithChildren } from 'react'

export const Th: FC<PropsWithChildren> = ({ children }) => {
  return (
    <th className="sticky top-0 z-[1] bg-white h-9 px-2 text-neutral-600 text-sm font-normal text-left whitespace-nowrap">
      {children}
    </th>
  )
}
