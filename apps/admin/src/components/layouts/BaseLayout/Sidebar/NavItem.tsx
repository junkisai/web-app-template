'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { FC } from 'react'
import { css } from 'styled-system/css'

const navItemStyle = css.raw({
  px: '2',
  py: '1',
  borderRadius: 'md',
  _hover: {
    bg: 'stone.300',
  },
})

const navItemActiveStyle = css.raw({
  bg: 'stone.200',
})

export type Props = {
  label: string
  href: string
}

export const NavItem: FC<Props> = ({ label, href }) => {
  const pathname = usePathname()
  const isActive = href === pathname

  return (
    <Link
      data-active={isActive}
      href={href}
      className={css(navItemStyle, {
        '&[data-active=true]': navItemActiveStyle,
      })}
    >
      {label}
    </Link>
  )
}
