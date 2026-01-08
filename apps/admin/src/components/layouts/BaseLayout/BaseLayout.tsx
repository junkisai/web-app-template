import { ToastProvider } from '@/components/ui/Toast'
import type { FC, PropsWithChildren } from 'react'
import { Sidebar } from './Sidebar'

type Props = PropsWithChildren

export const BaseLayout: FC<Props> = ({ children }) => {
  return (
    <ToastProvider>
      <div className="grid grid-cols-[auto_1fr] gap-10 h-full">
        <Sidebar />
        <div className="min-h-0 pt-10 pr-5">{children}</div>
      </div>
    </ToastProvider>
  )
}
