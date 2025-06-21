import Link from 'next/link'
import type { FC } from 'react'
import { css, cva } from 'styled-system/css'
import { styled } from 'styled-system/jsx'

const listStyle = css({
  display: 'flex',
  gap: 2,
})

const itemStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
    h: '8',
    px: '2',
    borderWidth: '1px',
    borderColor: 'neutral.200',
    borderRadius: 'md',
    fontSize: 'sm',
    fontWeight: 'medium',
  },
  variants: {
    active: {
      true: {
        bg: 'stone.800',
        color: 'white',
        pointerEvents: 'none',
      },
      false: {
        bg: 'white',
        color: 'stone.800',
        _hover: { bg: 'stone.100' },
      },
    },
  },
  defaultVariants: { active: false },
})

const Item = styled(Link, itemStyle)

type Props = {
  currentPage: number
  totalPages: number
  href: (page: number) => string
}

export const Pagination: FC<Props> = ({ currentPage, totalPages, href }) => {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className={listStyle}>
      {pages.map((page) => (
        <Item key={page} href={href(page)} active={page === currentPage}>
          {page}
        </Item>
      ))}
    </div>
  )
}
