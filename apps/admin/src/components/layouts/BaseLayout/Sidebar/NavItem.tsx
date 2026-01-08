'use client'

import { Link, useLocation } from '@tanstack/react-router'
import type { FC } from 'react'

export type Props = {
  label: string
  href: string
}

export const NavItem: FC<Props> = ({ label, href }) => {
  const location = useLocation()
  const isActive = href === location.pathname

  return (
    <Link
      to={href}
      className={`px-2 py-1 rounded-md text-sm hover:bg-stone-300 ${
        isActive ? 'bg-stone-200 font-semibold' : ''
      }`}
    >
      {label}
    </Link>
  )
}
