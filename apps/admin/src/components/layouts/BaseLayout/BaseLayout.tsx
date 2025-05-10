import type { FC, PropsWithChildren } from 'react'
import { css } from 'styled-system/css'
import { Sidebar } from './Sidebar'

const wrapperStyle = css({
  display: 'flex',
  gap: '10',
})

const mainStyle = css({
  pt: '10',
})

type Props = PropsWithChildren

export const BaseLayout: FC<Props> = ({ children }) => {
  return (
    <div className={wrapperStyle}>
      <Sidebar />
      <div className={mainStyle}>{children}</div>
    </div>
  )
}
