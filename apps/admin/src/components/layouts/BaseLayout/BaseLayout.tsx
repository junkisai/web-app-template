import { ToastProvider } from '@/components/ui/Toast'
import type { FC, PropsWithChildren } from 'react'
import { css } from 'styled-system/css'
import { Sidebar } from './Sidebar'

const wrapperStyle = css({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gap: '10',
})

const mainStyle = css({
  pt: '10',
  pr: '5',
})

type Props = PropsWithChildren

export const BaseLayout: FC<Props> = ({ children }) => {
  return (
    <ToastProvider>
      <div className={wrapperStyle}>
        <Sidebar />
        <div className={mainStyle}>{children}</div>
      </div>
    </ToastProvider>
  )
}
