import type { FC } from 'react'
import { match } from 'ts-pattern'
import { InlineEditMultiSelect } from './InlineEditMultiSelect'
import { InlineEditNumber } from './InlineEditNumber'
import { InlineEditText } from './InlineEditText'
import type { FieldProps } from './types'

type Props = FieldProps & {
  label: string
}

export const InlineEdit: FC<Props> = ({ label, ...props }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold text-stone-700">{label}: </span>
      {match(props)
        .with({ type: 'text' }, (props) => <InlineEditText {...props} />)
        .with({ type: 'number' }, (props) => <InlineEditNumber {...props} />)
        .with({ type: 'multi-select' }, (props) => (
          <InlineEditMultiSelect {...props} />
        ))
        .exhaustive()}
    </div>
  )
}
