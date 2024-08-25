import { animals } from '@/drizzleSchema'
import type { Bindings } from '@/types'
import type { RouteHandler } from '@hono/zod-openapi'
import { drizzle } from 'drizzle-orm/d1'
import type { getAnimalsRoute } from '../routes'

export const getAnimalsHandler: RouteHandler<
  typeof getAnimalsRoute,
  { Bindings: Bindings }
> = async (c) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(animals).all()

  return c.json(result)
}
