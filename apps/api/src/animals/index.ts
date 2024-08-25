import { OpenAPIHono } from '@hono/zod-openapi'
import type { Bindings } from '../types'
import { getAnimalsHandler } from './handlers'
import { getAnimalsRoute } from './routes'

const animal = new OpenAPIHono<{ Bindings: Bindings }>()

animal.openapi(getAnimalsRoute, getAnimalsHandler)

export default animal
