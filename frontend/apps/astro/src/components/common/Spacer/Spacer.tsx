type Props = {
  size: number
  horizontal?: boolean
}

export const Spacer: React.FC<Props> = ({ size, horizontal }) => {
  return (
    <div
      style={
        horizontal
          ? {
              width: size,
              height: 'auto',
              display: 'inline-block',
              flexShrink: 0,
            }
          : { width: 'auto', height: size, flexShrink: 0 }
      }
    />
  )
}
