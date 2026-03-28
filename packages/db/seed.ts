import { reset } from 'drizzle-seed'
import * as schema from './src/schema'
import { db } from './src/client'

async function main() {
  await reset(db, schema)

  await db.insert(schema.users).values({
    id: 1,
    name: 'Alice',
    createdAt: '2026-03-25T17:49:50.847Z',
    updatedAt: '2026-03-25 18:57:39',
  })
}

main()
