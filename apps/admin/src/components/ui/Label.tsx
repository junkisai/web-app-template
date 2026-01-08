import type { FC, PropsWithChildren } from 'react'

type LabelColor = 'base' | 'green' | 'red' | 'yellow'

const colorStyles: Record<LabelColor, string> = {
  base: 'bg-stone-200 text-stone-900',
  green: 'bg-green-200 text-green-900',
  red: 'bg-rose-200 text-rose-900',
  yellow: 'bg-yellow-200 text-yellow-900',
}

type Props = PropsWithChildren & {
  color?: LabelColor
}

export const Label: FC<Props> = ({ children, color = 'base' }) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-sm font-medium leading-none ${colorStyles[color]}`}
    >
      {children}
    </div>
  )
}
