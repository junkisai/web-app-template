import { errorSchema } from '@/schemas'
import { createRoute } from '@hono/zod-openapi'
import { animalsSchema } from '../schemas'

export const getAnimalsRoute = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      description: 'Ok',
      content: {
        'application/json': {
          schema: animalsSchema,
        },
      },
    },
    404: {
      description: 'Not Found',
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
    },
  },
})
