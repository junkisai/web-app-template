type User = {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

type Props = {
  users: User[]
}

export function TopPage({ users }: Props) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-emerald-500">
          Hello, TanStack Start!
        </h1>
        <p className="text-sm text-slate-600">
          Next.js をやめて TanStack Router ベースに移行しました。
        </p>
      </div>
      <section className="space-y-3">
        <ul>
          {users.map((row) => (
            <li key={row.id}>{row.name}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
