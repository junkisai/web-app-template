import { reset } from 'drizzle-seed'
import { db } from './src/client'
import * as schema from './src/schema'

async function main() {
  await reset(db, schema)

  await db.insert(schema.users).values({
    id: 1,
    name: 'Alice',
    createdAt: '2026-03-25T17:49:50.847Z',
    updatedAt: '2026-03-25 18:57:39',
  })
}

main().catch((error) => {
  console.error('Failed to seed database', error)
  process.exit(1)
})
