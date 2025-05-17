import { cva } from 'styled-system/css'
import { styled } from 'styled-system/jsx'

const spinnerStyle = cva({
  base: {
    display: 'inline-block',
    border: '2px solid',
    borderColor: 'transparent',
    borderTopColor: 'stone.100',
    borderRadius: 'full',
    animation: 'spin 0.8s linear infinite',
  },
  variants: {
    size: {
      sm: { width: '4', height: '4' },
      md: { width: '6', height: '6' },
      lg: { width: '8', height: '8' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const Spinner = styled('div', spinnerStyle)
