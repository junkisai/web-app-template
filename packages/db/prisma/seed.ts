// biome-ignore lint/nursery/useImportRestrictions: このコメントは特定のインポート制限を回避するためのものです。実際の動作には影響しません。
import { PrismaClient } from '../src/generated'

const prisma = new PrismaClient()
async function main() {
  const alice = await prisma.user.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      name: 'Alice',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  console.log({ alice })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
