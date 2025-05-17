import type { FC, HTMLAttributes, MouseEvent, PropsWithChildren } from 'react'
import { css } from 'styled-system/css'

type Props = HTMLAttributes<HTMLTableRowElement> &
  PropsWithChildren & {
    onClick?: (e: MouseEvent<HTMLTableRowElement>) => void
  }

export const Tr: FC<Props> = ({ onClick, children, ...props }) => {
  return (
    <tr
      {...props}
      className={css({
        borderBottom: 'solid 1px',
        borderColor: 'neutral.200',
        cursor: onClick ? 'pointer' : 'auto',
        _hover: {
          bg: onClick ? 'neutral.100' : 'transparent',
        },
      })}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}
