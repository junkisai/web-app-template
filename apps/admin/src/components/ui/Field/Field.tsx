'use client'

import React, {
  type ReactNode,
  type HTMLAttributes,
  useId,
  type PropsWithChildren,
} from 'react'
import { css } from 'styled-system/css'
import { Input } from './Input'
import { FieldContext, useFieldContext } from './context'

type FieldRootProps = PropsWithChildren &
  HTMLAttributes<HTMLDivElement> & {
    isInvalid?: boolean
  }

const Root = ({ children, isInvalid = false, ...props }: FieldRootProps) => {
  const reactId = useId()
  const inputId = `field-${reactId}`
  const helperId = `${inputId}-helper`
  const errorId = `${inputId}-error`

  return (
    <FieldContext.Provider value={{ isInvalid, inputId, helperId, errorId }}>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5',
          mb: '4',
        })}
        {...props}
      >
        {children}
      </div>
    </FieldContext.Provider>
  )
}

const Label = ({ children }: { children: ReactNode }) => {
  const { inputId } = useFieldContext('Field.Label')
  return (
    <label htmlFor={inputId} className={css({ fontSize: 'sm' })}>
      {children}
    </label>
  )
}

const ErrorMessage = ({ children }: { children: ReactNode }) => {
  const { isInvalid, errorId } = useFieldContext('Field.ErrorMessage')
  if (!isInvalid) return null
  return (
    <p id={errorId} className={css({ fontSize: 'xs', color: 'red.600' })}>
      {children}
    </p>
  )
}

const Control = ({
  children,
}: {
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>
}) => {
  const { inputId, isInvalid, helperId, errorId } =
    useFieldContext('Field.Control')
  return React.cloneElement(children, {
    id: inputId,
    'aria-invalid': isInvalid,
    'aria-describedby': isInvalid ? errorId : helperId,
  })
}

export const Field = {
  Root,
  Label,
  ErrorMessage,
  Control,
  Input,
}
