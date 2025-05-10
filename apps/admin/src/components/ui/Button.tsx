import Link from 'next/link'
import type { FC, PropsWithChildren } from 'react'
import { type RecipeVariantProps, cva } from 'styled-system/css'
import { styled } from 'styled-system/jsx'
import { match } from 'ts-pattern'

const buttonStyle = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: 'md',
  },
  variants: {
    variant: {
      solid: {
        bg: 'stone.800',
        color: 'white',
        _hover: {
          bg: 'stone.700',
        },
        _active: {
          bg: 'stone.600',
        },
      },
      outline: {
        borderWidth: '1px',
        borderColor: 'stone.300',
        _hover: {
          bg: 'stone.100',
        },
        _active: {
          bg: 'stone.200',
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
    | ({
        as?: 'button'
      } & React.ButtonHTMLAttributes<HTMLButtonElement>)
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
    .otherwise((props) => {
      const Button = styled('button', buttonStyle)
      return <Button {...props}>{children}</Button>
    })
}
