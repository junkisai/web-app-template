import { prisma } from '@packages/db'
import { css } from 'styled-system/css'

export default async function Page() {
  const users = await prisma.user.findMany()

  console.log(users)

  return (
    <>
      <h1
        className={css({
          fontSize: '2xl',
          fontWeight: 'bold',
          color: 'red.400',
        })}
      >
        Hello, Next.js!
      </h1>
      {users.map((user) => (
        <div key={user.id}>
          <h2>{user.name}</h2>
        </div>
      ))}
    </>
  )
}
