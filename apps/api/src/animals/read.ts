import { drizzle } from 'drizzle-orm/d1'
import { Hono } from 'hono'
import { animals } from '../schema'
import type { Bindings } from '../types'

const animal = new Hono<{ Bindings: Bindings }>()

animal.get('/', async (c) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(animals).all()

  return c.json(result)
})

export default animal
