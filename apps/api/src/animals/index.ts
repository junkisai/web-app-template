import { Hono } from 'hono'
import type { Bindings } from '../types'
import read from './read'

const animal = new Hono<{ Bindings: Bindings }>()

animal.route('/', read)

export default animal
