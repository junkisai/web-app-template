import type { ComponentProps } from 'react'

import type { IconComponent } from 'reicon-react'

/**
 * reicon-react のアイコンを、このアプリの線の太さで描く。
 *
 * reicon-react の既定の太さは 1.5 で、ライブラリ全体の既定値を変える設定が無い。
 * 各アイコンに `strokeWidth` を渡せば変わるので、ここで 2 を既定にして渡す。
 * アイコンは `<Home />` と直接書かず、必ずこれを通す。
 *
 * @example
 * import { Home } from 'reicon-react'
 * import { Icon } from '@/lib/icon'
 *
 * <Icon icon={Home} size={20} />
 */

/** このアプリのアイコンの線の太さ */
const DEFAULT_STROKE_WIDTH = 2

type Props = ComponentProps<IconComponent> & {
  /** 描くアイコン。reicon-react から import したものを渡す */
  icon: IconComponent
}

export function Icon({
  icon: Component,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  ...props
}: Props) {
  return <Component strokeWidth={strokeWidth} {...props} />
}
