import { prisma } from '@packages/db'

export default async function Page() {
  const users = await prisma.user.findMany()

  console.log(users)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-red-400">Hello, Next.js!</h1>
        <p className="text-sm text-slate-600">
          Panda CSS を外して Tailwind CSS に移行しました。
        </p>
      </div>
      <section className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <h2 className="font-medium text-slate-900">{user.name}</h2>
          </div>
        ))}
      </section>
    </main>
  )
}
