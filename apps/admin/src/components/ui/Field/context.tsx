import { createContext, useContext } from 'react'

type FieldContextProps = {
  isInvalid?: boolean
  inputId: string
  helperId?: string
  errorId?: string
}

export const FieldContext = createContext<FieldContextProps | null>(null)

export function useFieldContext(component: string) {
  const context = useContext(FieldContext)
  if (!context) throw new Error(`${component} must be used within <Field.Root>`)
  return context
}
