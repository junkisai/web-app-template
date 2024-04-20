import { Hono } from 'hono'
import animals from './animals'
import type { Bindings } from './types'

const app = new Hono<{ Bindings: Bindings }>()

app.route('/animals', animals)

export default app
