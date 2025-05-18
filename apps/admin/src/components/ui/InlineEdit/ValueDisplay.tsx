import { Pencil } from 'lucide-react'
import type { FC, ReactNode } from 'react'
import { css } from 'styled-system/css'

const buttonStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  px: 2,
  py: 1,
  borderRadius: 'md',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  _hover: {
    bg: 'stone.100',
  },
  _active: {
    bg: 'stone.200',
  },
})

const iconStyle = css({
  w: 4,
  h: 4,
  opacity: 0,
  transition: 'opacity 0.2s',
  _groupHover: {
    opacity: 1,
  },
})

type Props = {
  value: ReactNode
  onClick: () => void
}

export const ValueDisplay: FC<Props> = ({ value, onClick }) => {
  return (
    <button type="button" className={`group ${buttonStyle}`} onClick={onClick}>
      <span>{value}</span>
      <Pencil className={iconStyle} />
    </button>
  )
}
