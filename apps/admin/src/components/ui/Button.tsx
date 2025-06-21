import Link from 'next/link'
import type { FC, PropsWithChildren } from 'react'
import { type RecipeVariantProps, css, cva } from 'styled-system/css'
import { styled } from 'styled-system/jsx'
import { match } from 'ts-pattern'
import { Spinner } from './Spinner'

const buttonStyle = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: 'md',
    boxShadow: 'md',
  },
  variants: {
    variant: {
      solid: {
        bg: 'stone.800',
        color: 'white',
        _disabled: {
          bg: 'stone.300',
          color: 'whiteAlpha.700',
        },
        _hover: {
          bg: 'stone.700',
          _disabled: {
            bg: 'stone.300',
            color: 'whiteAlpha.700',
          },
        },
        _active: {
          bg: 'stone.600',
        },
      },
      outline: {
        borderWidth: '1px',
        borderColor: 'stone.300',
        _disabled: {
          color: 'stone.300',
        },
        _hover: {
          bg: 'stone.100',
          _disabled: {
            bg: 'transparent',
          },
        },
        _active: {
          bg: 'stone.200',
          _disabled: {
            bg: 'transparent',
          },
        },
      },
    },
    size: {
      xs: {
        h: '7',
        px: '2.5',
        fontSize: 'xs',
      },
      sm: {
        h: '8',
        px: '3.5',
        fontSize: 'sm',
      },
      md: {
        h: '9',
        px: '4',
        fontSize: 'md',
      },
      lg: {
        h: '10',
        px: '5',
        fontSize: 'lg',
      },
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md',
  },
})

type ButtonVariants = RecipeVariantProps<typeof buttonStyle>

type Props = PropsWithChildren &
  ButtonVariants &
  (
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

export const Button: FC<Props> = ({ children, ...props }) => {
  return match(props)
    .with({ as: 'a' }, (props) => {
      const ButtonLink = styled(Link, buttonStyle)

      return <ButtonLink {...props}>{children}</ButtonLink>
    })
    .otherwise(({ isLoading, isDisabled, ...props }) => {
      const Button = styled('button', buttonStyle)
      const isInactive = isLoading || isDisabled

      return (
        <Button
          {...props}
          disabled={isInactive}
          className={css({ cursor: isInactive ? 'not-allowed' : 'pointer' })}
        >
          {isLoading ? <Spinner size="sm" /> : children}
        </Button>
      )
    })
}
