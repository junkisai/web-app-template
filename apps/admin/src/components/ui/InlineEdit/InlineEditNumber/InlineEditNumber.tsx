import { type FC, useCallback, useState } from 'react'
import { ValueDisplay } from '../ValueDisplay'
import type { NumberFieldProps } from '../types'
import { Field } from './Field'

type Props = NumberFieldProps

export const InlineEditNumber: FC<Props> = ({ type, initialValue, onSave }) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = useCallback(
    (value: number) => {
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
      onSave={handleSave}
      onCancel={handleCancel}
    />
  ) : (
    <ValueDisplay value={initialValue} onClick={() => setIsEditing(true)} />
  )
}
