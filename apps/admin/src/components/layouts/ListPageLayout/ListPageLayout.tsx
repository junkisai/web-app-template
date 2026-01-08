import { Button } from '@/components/ui/Button'
import type { FC, PropsWithChildren } from 'react'

type Props = PropsWithChildren & {
  title: string
  addNewLink: string
}

export const ListPageLayout: FC<Props> = ({ children, title, addNewLink }) => {
  return (
    <div className="flex flex-col gap-7 max-w-[720px] h-full mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{title}</h1>
        <Button as="a" href={addNewLink} size="sm">
          新規追加
        </Button>
      </div>
      {children}
    </div>
  )
}
