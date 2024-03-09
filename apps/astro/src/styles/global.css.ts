import { globalStyle } from '@vanilla-extract/css'

/** プロダクト固有 */

/** 共通 */
globalStyle('*, *::before, *::after', {
  backgroundRepeat: 'no-repeat',
  boxSizing: 'border-box',
})

globalStyle('*', {
  padding: 0,
  margin: 0,
  lineHeight: 1,
})

globalStyle('html', {
  wordBreak: 'normal',
})

globalStyle('button, input, select, textarea', {
  backgroundColor: 'transparent',
  borderStyle: 'none',
})

globalStyle(
  'button, [type="button"], [type="reset"], [type="submit"], [role="button"]',
  {
    cursor: 'pointer',
  },
)
