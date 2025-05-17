import type { FC, PropsWithChildren } from 'react'
import { css } from 'styled-system/css'

export const Td: FC<PropsWithChildren> = ({ children }) => {
  return (
    <td
      className={css({
        minW: '160px',
        maxW: '440px',
        h: '9',
        px: '2',
        fontSize: 'sm',
        fontWeight: 'medium',
        textAlign: 'left',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      })}
    >
      {children}
    </td>
  )
}
