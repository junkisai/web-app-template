import { Link } from '@tanstack/react-router'
import type { FC, PropsWithChildren } from 'react'
import { match } from 'ts-pattern'
import { Spinner } from './Spinner'

type ButtonVariant = 'solid' | 'outline'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

const variantStyles: Record<ButtonVariant, string> = {
  solid:
    'bg-stone-800 text-white disabled:bg-stone-300 disabled:text-white/70 hover:bg-stone-700 hover:disabled:bg-stone-300 active:bg-stone-600',
  outline:
    'border border-stone-300 disabled:text-stone-300 hover:bg-stone-100 hover:disabled:bg-transparent active:bg-stone-200 active:disabled:bg-transparent',
}

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-xs',
  sm: 'h-8 px-3.5 text-sm',
  md: 'h-9 px-4 text-base',
  lg: 'h-10 px-5 text-lg',
}

type Props = PropsWithChildren & {
  variant?: ButtonVariant
  size?: ButtonSize
} & (
    | (React.ButtonHTMLAttributes<HTMLButtonElement> & {
        as?: 'button'
        isLoading?: boolean
        isDisabled?: boolean
      })
    | {
        as: 'a'
        href: string
      }
  )

export const Button: FC<Props> = ({
  children,
  variant = 'outline',
  size = 'md',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center cursor-pointer rounded-md shadow-md'
  const className = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`

  return match(props)
    .with({ as: 'a' }, ({ href }) => (
      <Link to={href} className={className}>
        {children}
      </Link>
    ))
    .otherwise(({ isLoading, isDisabled, ...buttonProps }) => {
      const isInactive = isLoading || isDisabled

      return (
        <button
          type="button"
          {...buttonProps}
          disabled={isInactive}
          className={`${className} ${isInactive ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isLoading ? <Spinner size="sm" /> : children}
        </button>
      )
    })
}
