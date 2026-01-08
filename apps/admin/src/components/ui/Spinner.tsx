import type { FC } from 'react'

type SpinnerSize = 'sm' | 'md' | 'lg'

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

type Props = {
  size?: SpinnerSize
}

export const Spinner: FC<Props> = ({ size = 'md' }) => {
  return (
    <div
      className={`inline-block border-2 border-transparent border-t-stone-100 rounded-full animate-spin ${sizeStyles[size]}`}
    />
  )
}
