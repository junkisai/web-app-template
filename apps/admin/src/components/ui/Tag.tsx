import { X } from 'lucide-react'
import type { FC, PropsWithChildren } from 'react'

type Props = PropsWithChildren & {
  onClose?: () => void
}

export const Tag: FC<Props> = ({ children, onClose }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-stone-200 text-stone-900 text-sm font-medium leading-none">
      {children}
      {onClose && (
        <button type="button" className="group cursor-pointer" onClick={onClose}>
          <X className="w-3 h-3 text-stone-500 group-hover:text-stone-400" />
        </button>
      )}
    </div>
  )
}
