'use client'

import { Check, X } from 'lucide-react'
import { type FC, useCallback, useState } from 'react'
import { css } from 'styled-system/css'
import type { TextFieldProps } from '../types'

const wrapperStyle = css({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
})

const inputStyle = css({
  px: 2,
  h: 8,
  borderRadius: 'md',
  bg: 'stone.100',
  outline: 'none',
})

const buttonsStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: 1,
})

const buttonStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  w: 8,
  h: 8,
  borderRadius: 'md',
  bg: 'stone.900',
  cursor: 'pointer',
  _hover: {
    bg: 'stone.800',
  },
  _active: {
    bg: 'stone.700',
  },
})

const iconStyle = css({
  w: 4,
  h: 4,
  color: 'white',
})

type Props = TextFieldProps & {
  onCancel: () => void
}

export const Field: FC<Props> = ({ initialValue, onSave, onCancel }) => {
  const [value, setValue] = useState(initialValue)

  const handleClickSave = useCallback(() => {
    onSave(value)
  }, [onSave, value])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value)
    },
    [],
  )

  return (
    <div className={wrapperStyle}>
      <input
        type="text"
        value={value}
        className={inputStyle}
        onChange={handleChange}
      />
      <div className={buttonsStyle}>
        <button type="button" className={buttonStyle} onClick={handleClickSave}>
          <Check className={iconStyle} />
        </button>
        <button type="button" className={buttonStyle} onClick={onCancel}>
          <X className={iconStyle} />
        </button>
      </div>
    </div>
  )
}
