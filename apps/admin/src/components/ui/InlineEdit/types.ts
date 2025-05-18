type Option = {
  id: string
  label: string
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type BaseFieldProps = {}

export type TextFieldProps = BaseFieldProps & {
  type: 'text'
  initialValue: string
  onSave: (value: string) => void
}

export type NumberFieldProps = BaseFieldProps & {
  type: 'number'
  initialValue: number
  onSave: (value: number) => void
}

export type MultiSelectFieldProps = BaseFieldProps & {
  type: 'multi-select'
  options: Option[]
  initialValue: string[]
  onSave: (value: string[]) => void
}

export type FieldProps =
  | TextFieldProps
  | NumberFieldProps
  | MultiSelectFieldProps
