import type { FC, HTMLAttributes, MouseEvent, PropsWithChildren } from 'react'

type Props = HTMLAttributes<HTMLTableRowElement> &
  PropsWithChildren & {
    onClick?: (e: MouseEvent<HTMLTableRowElement>) => void
  }

export const Tr: FC<Props> = ({ onClick, children, ...props }) => {
  return (
    <tr
      {...props}
      className={`border-b border-neutral-200 ${
        onClick ? 'cursor-pointer hover:bg-neutral-100' : 'cursor-auto'
      }`}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}
