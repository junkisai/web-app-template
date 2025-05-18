import type { FC } from 'react'
import { css } from 'styled-system/css'
import { match } from 'ts-pattern'
import { InlineEditMultiSelect } from './InlineEditMultiSelect'
import { InlineEditNumber } from './InlineEditNumber'
import { InlineEditText } from './InlineEditText'
import type { FieldProps } from './types'

const wrapperStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
})

const labelStyle = css({
  fontSize: 'sm',
  fontWeight: 'bold',
  color: 'stone.700',
})

type Props = FieldProps & {
  label: string
}

export const InlineEdit: FC<Props> = ({ label, ...props }) => {
  return (
    <div className={wrapperStyle}>
      <span className={labelStyle}>{label}: </span>
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
