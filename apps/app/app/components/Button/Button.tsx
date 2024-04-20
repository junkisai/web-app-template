import type { FC } from 'react'
import * as styles from './Button.module.scss'

export const Button: FC = () => {
  return (
    <button type="button" className={styles.root}>
      ボタンを押す
    </button>
  )
}
