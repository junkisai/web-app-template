import { Link } from '@tanstack/react-router'
import type { FC } from 'react'

type Props = {
  currentPage: number
  totalPages: number
  href: (page: number) => string
}

export const Pagination: FC<Props> = ({ currentPage, totalPages, href }) => {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex gap-2">
      {pages.map((page) => {
        const isActive = page === currentPage
        return (
          <Link
            key={page}
            to={href(page)}
            className={`flex items-center justify-center min-w-8 h-8 px-2 border border-neutral-200 rounded-md text-sm font-medium ${
              isActive
                ? 'bg-stone-800 text-white pointer-events-none'
                : 'bg-white text-stone-800 hover:bg-stone-100'
            }`}
          >
            {page}
          </Link>
        )
      })}
    </div>
  )
}
