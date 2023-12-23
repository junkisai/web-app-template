import { globalStyle } from '@vanilla-extract/css'

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
