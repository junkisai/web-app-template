import type { FC, PropsWithChildren } from 'react'
import { css } from 'styled-system/css'

export const Th: FC<PropsWithChildren> = ({ children }) => {
  return (
    <th
      className={css({
        position: 'sticky',
        top: 0,
        zIndex: 1,
        bg: 'white',
        h: '9',
        px: '2',
        color: 'neutral.600',
        fontSize: 'sm',
        fontWeight: 'normal',
        textAlign: 'left',
        whiteSpace: 'nowrap',
      })}
    >
      {children}
    </th>
  )
}
