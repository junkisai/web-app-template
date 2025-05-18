import { X } from 'lucide-react'
import type { FC, PropsWithChildren } from 'react'
import { css } from 'styled-system/css'

const tagStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1.5,
  px: 2,
  py: 1,
  borderRadius: 'sm',
  bg: 'stone.200',
  color: 'stone.900',
  fontSize: 'sm',
  fontWeight: 'medium',
  lineHeight: 1,
})

const buttonStyle = css({
  cursor: 'pointer',
})

const iconStyle = css({
  w: 3,
  h: 3,
  color: 'stone.500',
  _groupHover: {
    color: 'stone.400',
  },
})

type Props = PropsWithChildren & {
  onClose?: () => void
}

export const Tag: FC<Props> = ({ children, onClose }) => {
  return (
    <div className={tagStyle}>
      {children}
      {onClose && (
        <button
          type="button"
          className={`group ${buttonStyle}`}
          onClick={onClose}
        >
          <X className={iconStyle} />
        </button>
      )}
    </div>
  )
}
