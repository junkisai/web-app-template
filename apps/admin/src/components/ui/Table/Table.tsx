import type { FC, PropsWithChildren } from 'react'

export const Table: FC<PropsWithChildren> = ({ children }) => {
  return <table className="border-t border-neutral-200">{children}</table>
}
