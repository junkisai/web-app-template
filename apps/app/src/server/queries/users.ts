import { createServerFn } from '@tanstack/react-start'
import { users, db } from '@packages/db'

export const getUsers = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    return await db.select().from(users).all()
  } catch (error) {
    console.error('Failed to load users', error)
    throw error
  }
})
