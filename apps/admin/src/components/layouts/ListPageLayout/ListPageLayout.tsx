import { Button } from '@/components/ui/Button'
import type { FC, PropsWithChildren } from 'react'
import { css } from 'styled-system/css'

const wrapperStyle = css({
  display: 'flex',
  flexDir: 'column',
  gap: '7',
  maxW: '720px',
  margin: '0 auto',
})

const headStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const titleStyle = css({
  fontSize: 'xl',
  fontWeight: 'bold',
})

type Props = PropsWithChildren & {
  title: string
  addNewLink: string
}

export const ListPageLayout: FC<Props> = ({ children, title, addNewLink }) => {
  return (
    <div className={wrapperStyle}>
      <div className={headStyle}>
        <h1 className={titleStyle}>{title}</h1>
        <Button as="a" href={addNewLink} size="sm">
          新規追加
        </Button>
      </div>
      {children}
    </div>
  )
}
