import { createFileRoute } from '@tanstack/react-router'

import { LoginPage } from '@/screens/login'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  return <LoginPage />
}
