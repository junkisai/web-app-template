import type { FC, PropsWithChildren } from 'react'
import { css } from 'styled-system/css'

export const Table: FC<PropsWithChildren> = ({ children }) => {
  return (
    <table
      className={css({ borderTop: 'solid 1px', borderColor: 'neutral.200' })}
    >
      {children}
    </table>
  )
}
