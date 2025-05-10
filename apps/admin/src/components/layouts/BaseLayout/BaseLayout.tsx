import type { FC, PropsWithChildren } from 'react'
import { css } from 'styled-system/css'
import { Sidebar } from './Sidebar'

const wrapperStyle = css({
  display: 'flex',
  gap: '10',
})

type Props = PropsWithChildren

export const BaseLayout: FC<Props> = ({ children }) => {
  return (
    <div className={wrapperStyle}>
      <Sidebar />
      {children}
    </div>
  )
}
