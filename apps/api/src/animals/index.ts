import { Hono } from 'hono'
import type { Bindings } from '../types'
import { getAnimalsHandler } from './handlers'

export const animalsApp = new Hono<{ Bindings: Bindings }>().get(
  '/',
  getAnimalsHandler,
)
