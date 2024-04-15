import {
  type AuthBindings,
  GitHubBanner,
  Refine,
  WelcomePage,
} from '@refinedev/core'
import { DevtoolsPanel, DevtoolsProvider } from '@refinedev/devtools'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'

import { useAuth0 } from '@auth0/auth0-react'
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from '@refinedev/react-router-v6'
import dataProvider from '@refinedev/simple-rest'
import axios from 'axios'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

function App() {
  const { isLoading, user, logout, getIdTokenClaims } = useAuth0()

  if (isLoading) {
    return <span>loading...</span>
  }

  const authProvider: AuthBindings = {
    login: async () => {
      return {
        success: true,
      }
    },
    logout: async () => {
      logout({ returnTo: window.location.origin })
      return {
        success: true,
      }
    },
    onError: async (error) => {
      console.error(error)
      return { error }
    },
    check: async () => {
      try {
        const token = await getIdTokenClaims()
        if (token) {
          axios.defaults.headers.common = {
            Authorization: `Bearer ${token.__raw}`,
          }
          return {
            authenticated: true,
          }
        }

        return {
          authenticated: false,
          error: {
            message: 'Check failed',
            name: 'Token not found',
          },
          redirectTo: '/login',
          logout: true,
        }
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (error: any) {
        return {
          authenticated: false,
          error: new Error(error),
          redirectTo: '/login',
          logout: true,
        }
      }
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      if (user) {
        return {
          ...user,
          avatar: user.picture,
        }
      }
      return null
    },
  }

  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <DevtoolsProvider>
          <Refine
            dataProvider={dataProvider('https://api.fake-rest.refine.dev')}
            routerProvider={routerBindings}
            authProvider={authProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: 'aUd0Dq-nzwOZL-o1fgZ3',
            }}
          >
            <Routes>
              <Route index element={<WelcomePage />} />
              <Route path="hoge" element={<div>Hi!!!!!</div>} />
            </Routes>
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
          <DevtoolsPanel />
        </DevtoolsProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  )
}

export default App
