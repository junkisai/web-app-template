export type InlineEditFieldType = 'text' | 'number'

type BaseInlineEditField = {
  label: string
}

type TextInlineEditField = BaseInlineEditField & {
  type: 'text'
  initialValue: string
  onSave: (value: string) => void
}

type NumberInlineEditField = BaseInlineEditField & {
  type: 'number'
  initialValue: number
  onSave: (value: number) => void
}

export type InlineEditField = TextInlineEditField | NumberInlineEditField
