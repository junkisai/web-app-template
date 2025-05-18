import { Check, X } from 'lucide-react'
import { type FC, useCallback, useState } from 'react'
import { css } from 'styled-system/css'
import type { InlineEditFieldType } from './types'

const wrapperStyle = css({
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

type Props = {
  type?: InlineEditFieldType
  initialValue: string
  onSave: (value: string) => void
  onCancel: () => void
}

export const EditModeField: FC<Props> = ({
  type = 'text',
  initialValue,
  onSave,
  onCancel,
}) => {
  const [value, setValue] = useState(initialValue)

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value)
    },
    [],
  )

  const handleClickSave = useCallback(() => {
    onSave(value)
  }, [onSave, value])

  return (
    <div className={wrapperStyle}>
      <input
        type={type}
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
