import { auth } from '@packages/auth/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        return await handleAuthRequest(request)
      },
      POST: async ({ request }: { request: Request }) => {
        return await handleAuthRequest(request)
      },
    },
  },
})

async function handleAuthRequest(request: Request) {
  try {
    const response = await auth.handler(request)

    if (!response.ok) {
      await logAuthFailure(request, response)
    }

    return response
  } catch (error) {
    const url = new URL(request.url)

    console.error('Better Auth request crashed', {
      method: request.method,
      pathname: url.pathname,
      cfRay: request.headers.get('cf-ray') ?? undefined,
      error: serializeError(error),
    })

    throw error
  }
}

async function logAuthFailure(request: Request, response: Response) {
  const url = new URL(request.url)

  console.error('Better Auth request failed', {
    method: request.method,
    pathname: url.pathname,
    status: response.status,
    statusText: response.statusText,
    cfRay: request.headers.get('cf-ray') ?? undefined,
    body: await parseResponseBody(response.clone()),
  })
}

async function parseResponseBody(response: Response) {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    try {
      return await response.json()
    } catch {
      return '<invalid-json>'
    }
  }

  try {
    return await response.text()
  } catch {
    return '<unreadable-body>'
  }
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }

  return error
}
