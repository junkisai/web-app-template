import { animals } from '@/drizzleSchema'
import type { Bindings } from '@/types'
import { drizzle } from 'drizzle-orm/d1'
import type { Handler } from 'hono'

export const getAnimalsHandler: Handler<{ Bindings: Bindings }> = async (c) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(animals).all()

  return c.json(result)
}
