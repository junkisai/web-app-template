import { OpenAPIHono } from '@hono/zod-openapi'
import animals from './animals'
import type { Bindings } from './types'

const app = new OpenAPIHono<{ Bindings: Bindings }>()

app.route('/animals', animals)

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
})

export default app
