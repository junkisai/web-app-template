import * as stylex from '@stylexjs/stylex'

/**
 * 画面から参照する色とフォント。値は移行前に使っていた Tailwind v4 の
 * 既定パレット（slate / emerald / rose）をそのまま写している。
 *
 * `defineVars` は `.stylex.ts` のファイルにしか書けない（StyleX の制約）。
 * 余白や文字サイズはトークンにせず、各 `stylex.create` に直接書く。
 */
export const colors = stylex.defineVars({
  // slate-900
  text: 'oklch(20.8% 0.042 265.755)',
  // slate-700
  textBody: 'oklch(37.2% 0.044 257.287)',
  // slate-600
  textMuted: 'oklch(44.6% 0.043 257.281)',
  // slate-500
  textSubtle: 'oklch(55.4% 0.046 257.417)',
  textInverse: '#fff',

  surface: '#fff',
  // slate-50
  surfaceMuted: 'oklch(98.4% 0.003 247.858)',
  // slate-900
  surfaceInverse: 'oklch(20.8% 0.042 265.755)',
  // slate-800
  surfaceInverseHover: 'oklch(27.9% 0.041 260.031)',

  // slate-200
  border: 'oklch(92.9% 0.013 255.508)',
  // slate-300
  borderStrong: 'oklch(86.9% 0.022 252.894)',
  // slate-400
  borderHover: 'oklch(70.4% 0.04 256.788)',

  // emerald-600
  accent: 'oklch(59.6% 0.145 163.225)',
  // emerald-700
  accentHover: 'oklch(50.8% 0.118 165.612)',
  // emerald-500
  accentText: 'oklch(69.6% 0.17 162.48)',

  // emerald-50
  successSurface: 'oklch(97.9% 0.021 166.113)',
  // emerald-200
  successBorder: 'oklch(90.5% 0.093 164.15)',
  // emerald-900
  successText: 'oklch(37.8% 0.077 168.94)',

  // rose-50
  dangerSurface: 'oklch(96.9% 0.015 12.422)',
  // rose-200
  dangerBorder: 'oklch(89.2% 0.058 10.001)',
  // rose-900
  dangerText: 'oklch(41% 0.159 10.272)',
})

export const fonts = stylex.defineVars({
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
})
