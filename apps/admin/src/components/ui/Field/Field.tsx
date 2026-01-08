'use client'

import React, {
  type ReactNode,
  type HTMLAttributes,
  useId,
  type PropsWithChildren,
} from 'react'
import { Input } from './Input'
import { FieldContext, useFieldContext } from './context'

type FieldRootProps = PropsWithChildren & HTMLAttributes<HTMLDivElement>

const Root = ({ children, ...props }: FieldRootProps) => {
  const reactId = useId()
  const inputId = `field-${reactId}`
  const errorId = `${inputId}-error`

  return (
    <FieldContext.Provider value={{ inputId, errorId }}>
      <div className="flex flex-col gap-1.5" {...props}>
        {children}
      </div>
    </FieldContext.Provider>
  )
}

const Label = ({ children }: { children: ReactNode }) => {
  const { inputId } = useFieldContext('Field.Label')
  return (
    <label htmlFor={inputId} className="text-sm">
      {children}
    </label>
  )
}

const ErrorMessage = ({ children }: { children: ReactNode }) => {
  const { errorId } = useFieldContext('Field.ErrorMessage')
  return (
    <p id={errorId} className="text-xs text-red-600">
      {children}
    </p>
  )
}

const Control = ({
  children,
}: {
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>
}) => {
  const { inputId } = useFieldContext('Field.Control')
  return React.cloneElement(children, {
    id: inputId,
  })
}

export const Field = {
  Root,
  Label,
  ErrorMessage,
  Control,
  Input,
}
