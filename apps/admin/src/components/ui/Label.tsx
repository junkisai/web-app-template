import type { FC, PropsWithChildren } from 'react'
import { cva } from 'styled-system/css'

const tagStyle = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1.5,
    px: 2,
    py: 1,
    borderRadius: 'sm',
    fontSize: 'sm',
    fontWeight: 'medium',
    lineHeight: 1,
  },
  variants: {
    color: {
      base: {
        bg: 'stone.200',
        color: 'stone.900',
      },
      green: {
        bg: 'green.200',
        color: 'green.900',
      },
      red: {
        bg: 'rose.200',
        color: 'rose.900',
      },
      yellow: {
        bg: 'yellow.200',
        color: 'yellow.900',
      },
    },
  },
  defaultVariants: {
    color: 'base',
  },
})

type Props = PropsWithChildren & {
  color?: 'base' | 'green' | 'red' | 'yellow'
}

export const Label: FC<Props> = ({ children, color = 'base' }) => {
  return <div className={tagStyle({ color })}>{children}</div>
}
