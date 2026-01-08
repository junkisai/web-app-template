'use client'

import { Check, X } from 'lucide-react'
import { type FC, useCallback, useState } from 'react'
import type { NumberFieldProps } from '../types'

type Props = NumberFieldProps & {
  onCancel: () => void
}

export const Field: FC<Props> = ({ initialValue, onSave, onCancel }) => {
  const [value, setValue] = useState(initialValue)

  const handleClickSave = useCallback(() => {
    onSave(value)
  }, [onSave, value])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(Number(event.target.value))
    },
    [],
  )

  return (
    <div className="flex-1 flex items-center gap-2">
      <input
        type="number"
        value={value}
        className="px-2 h-8 rounded-md bg-stone-100 outline-none"
        onChange={handleChange}
      />
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded-md bg-stone-900 cursor-pointer hover:bg-stone-800 active:bg-stone-700"
          onClick={handleClickSave}
        >
          <Check className="w-4 h-4 text-white" />
        </button>
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded-md bg-stone-900 cursor-pointer hover:bg-stone-800 active:bg-stone-700"
          onClick={onCancel}
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )
}
