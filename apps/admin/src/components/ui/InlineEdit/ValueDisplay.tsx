import { Pencil } from 'lucide-react'
import type { FC, ReactNode } from 'react'

type Props = {
  value: ReactNode
  onClick: () => void
}

export const ValueDisplay: FC<Props> = ({ value, onClick }) => {
  return (
    <button
      type="button"
      className="group flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-colors duration-200 hover:bg-stone-100 active:bg-stone-200"
      onClick={onClick}
    >
      <span>{value}</span>
      <Pencil className="w-4 h-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </button>
  )
}
