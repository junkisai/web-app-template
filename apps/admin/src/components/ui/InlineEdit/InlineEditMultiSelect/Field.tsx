import { Tag } from '@/components/ui/Tag'
import {
  PopoverContent,
  PopoverPortal,
  Root as PopoverRoot,
  PopoverTrigger,
} from '@radix-ui/react-popover'
import { Check, X } from 'lucide-react'
import { type FC, useCallback, useState } from 'react'
import type { MultiSelectFieldProps } from '../types'

type Props = MultiSelectFieldProps & {
  onCancel: () => void
}

export const Field: FC<Props> = ({
  initialValue,
  options,
  onSave,
  onCancel,
}) => {
  const [value, setValue] = useState(initialValue)

  const handleAddTag = (id: string) => {
    if (value.includes(id)) {
      return
    }

    setValue((prev) => [...prev, id])
  }

  const handleRemoveTag = (id: string) => {
    setValue((prev) => prev.filter((tagId) => tagId !== id))
  }

  const handleClickSave = useCallback(() => {
    onSave(value)
  }, [onSave, value])

  return (
    <div className="flex-1 flex items-center gap-2">
      <PopoverRoot defaultOpen open>
        <PopoverTrigger asChild>
          <div className="flex gap-1 w-full py-1 px-2 rounded-t-md border-t border-l border-r border-stone-200 bg-stone-100">
            {value.map((id) => (
              <Tag key={id} onClose={() => handleRemoveTag(id)}>
                {options.find((option) => option.id === id)?.label}
              </Tag>
            ))}
          </div>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent
            align="start"
            className="w-[var(--radix-popover-trigger-width)]"
          >
            <ul className="flex flex-col gap-0.5 p-1 bg-white rounded-b-md border-l border-r border-b border-stone-200">
              {options.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    className="flex items-center justify-start w-full py-1 px-2 rounded-sm cursor-pointer hover:bg-stone-100"
                    onClick={() => handleAddTag(option.id)}
                  >
                    <Tag>{option.label}</Tag>
                  </button>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </PopoverPortal>
      </PopoverRoot>
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
