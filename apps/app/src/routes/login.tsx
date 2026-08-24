import { createFileRoute } from '@tanstack/react-router'

import { LoginPage } from '@/pages/Login'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  return <LoginPage />
}
