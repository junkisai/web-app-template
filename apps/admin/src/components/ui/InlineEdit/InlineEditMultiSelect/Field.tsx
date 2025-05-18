import { Tag } from '@/components/ui/Tag'
import {
  PopoverContent,
  PopoverPortal,
  Root as PopoverRoot,
  PopoverTrigger,
} from '@radix-ui/react-popover'
import { Check, X } from 'lucide-react'
import { type FC, useCallback, useState } from 'react'
import { css } from 'styled-system/css'
import type { MultiSelectFieldProps } from '../types'

const wrapperStyle = css({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
})

const selectedTagListStyle = css({
  display: 'flex',
  gap: 1,
  w: 'full',
  py: 1,
  px: 2,
  borderTopLeftRadius: 'md',
  borderTopRightRadius: 'md',
  borderTop: '1px solid',
  borderLeft: '1px solid',
  borderRight: '1px solid',
  borderColor: 'stone.200',
  bg: 'stone.100',
})

const optionListStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
  p: 1,
  bg: 'white',
  borderBottomLeftRadius: 'md',
  borderBottomRightRadius: 'md',
  borderLeft: '1px solid',
  borderRight: '1px solid',
  borderBottom: '1px solid',
  borderColor: 'stone.200',
})

const tagButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  w: 'full',
  py: 1,
  px: 2,
  borderRadius: 'sm',
  cursor: 'pointer',
  _hover: {
    bg: 'stone.100',
  },
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
    <div className={wrapperStyle}>
      <PopoverRoot defaultOpen open>
        <PopoverTrigger asChild>
          <div className={selectedTagListStyle}>
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
            className={css({
              width: 'var(--radix-popover-trigger-width)',
            })}
          >
            <ul className={optionListStyle}>
              {options.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    className={tagButtonStyle}
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
