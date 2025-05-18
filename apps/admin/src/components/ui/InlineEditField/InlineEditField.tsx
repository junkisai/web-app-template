'use client'

import { type FC, useCallback, useState } from 'react'
import { css } from 'styled-system/css'
import { EditModeField } from './EditModeField'
import { InlineEditButton } from './InlineEditButton'
import type { InlineEditField as InlineEditFieldProps } from './types'

const wrapperStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
})

const labelStyle = css({
  fontSize: 'sm',
  fontWeight: 'bold',
  color: 'stone.700',
})

type Props = InlineEditFieldProps

export const InlineEditField: FC<Props> = ({
  label,
  type,
  initialValue,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleClick = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleSave = useCallback(
    (value: string) => {
      if (type === 'number') {
        onSave(Number(value))
      } else if (type === 'text') {
        onSave(value)
      }

      setIsEditing(false)
    },
    [type, onSave],
  )

  const handleCancel = useCallback(() => {
    setIsEditing(false)
  }, [])

  return (
    <div className={wrapperStyle}>
      <span className={labelStyle}>{label}: </span>
      {isEditing ? (
        <EditModeField
          type={type}
          initialValue={initialValue.toString()}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <InlineEditButton value={initialValue} onClick={handleClick} />
      )}
    </div>
  )
}
