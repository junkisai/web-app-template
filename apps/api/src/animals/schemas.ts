import { z } from '@hono/zod-openapi'

export const animalSchema = z
  .object({
    id: z.number().openapi({
      example: 1,
    }),
    name: z.string().openapi({
      example: 'ライオン',
    }),
  })
  .openapi('Animal')

export const animalsSchema = z.array(animalSchema).openapi('Animals')
