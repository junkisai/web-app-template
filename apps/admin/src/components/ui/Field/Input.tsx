import { forwardRef, type InputHTMLAttributes } from 'react'
import { useFieldContext } from './context'

type Props = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ type = 'text', ...props }, ref) => {
    const { inputId } = useFieldContext('Field.Input')

    return (
      <input
        type={type}
        ref={ref}
        id={inputId}
        className="h-10 px-3 rounded-md border border-stone-300 text-sm"
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'
