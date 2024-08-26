import { Hono } from 'hono'
import { animalsApp } from './animals'
import type { Bindings } from './types'

const app = new Hono<{ Bindings: Bindings }>().route('/animals', animalsApp)

export type AppType = typeof app

export default app
