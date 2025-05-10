import React, { forwardRef, type InputHTMLAttributes } from 'react'
import { css } from 'styled-system/css'
import { useFieldContext } from './context'

type Props = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, type = 'text', ...props }, ref) => {
    const { inputId, isInvalid, helperId, errorId } =
      useFieldContext('Field.Input')

    return (
      <input
        type={type}
        ref={ref}
        id={inputId}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? errorId : helperId}
        className={css({
          h: '10',
          px: '3',
          borderRadius: 'md',
          border: 'solid 1px',
          borderColor: 'stone.300',
          fontSize: 'sm',
        })}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'
