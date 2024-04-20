import { useAuth0 } from '@auth0/auth0-react'

export const Login: React.FC = () => {
  const { loginWithRedirect } = useAuth0()

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <button type="button" onClick={() => loginWithRedirect()}>
        Sign in
      </button>
      <p>
        Powered by
        <img
          style={{ padding: '0 5px' }}
          alt="Auth0"
          src="https://refine.ams3.cdn.digitaloceanspaces.com/superplate-auth-icons%2Fauth0-2.svg"
        />
        Auth0
      </p>
    </div>
  )
}
