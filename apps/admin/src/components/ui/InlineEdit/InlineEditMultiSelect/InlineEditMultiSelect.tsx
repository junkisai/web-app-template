'use client'

import { Tag } from '@/components/ui/Tag'
import { type FC, useCallback, useState } from 'react'
import { css } from 'styled-system/css'
import { ValueDisplay } from '../ValueDisplay'
import type { MultiSelectFieldProps } from '../types'
import { Field } from './Field'

const tagListStyle = css({
  display: 'inline-flex',
  gap: 1,
  alignItems: 'center',
  justifyContent: 'flex-start',
})

type Props = MultiSelectFieldProps

export const InlineEditMultiSelect: FC<Props> = ({
  type,
  initialValue,
  options,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false)

  const selectedLabels = options
    .filter((option) => initialValue.includes(option.id))
    .map((option) => option.label)

  const handleSave = useCallback(
    (value: string[]) => {
      onSave(value)
      setIsEditing(false)
    },
    [onSave],
  )

  const handleCancel = useCallback(() => {
    setIsEditing(false)
  }, [])

  return isEditing ? (
    <Field
      type={type}
      initialValue={initialValue}
      options={options}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  ) : (
    <ValueDisplay
      value={
        <div className={tagListStyle}>
          {selectedLabels.map((label) => (
            <Tag key={label}>{label}</Tag>
          ))}
        </div>
      }
      onClick={() => setIsEditing(true)}
    />
  )
}
