import { z } from 'zod'

const saveReviewsToolSchema = z.object({
  reviews: z.array(z.string())
})

const saveReviewsToolHandler = async (params: z.infer<typeof saveReviewsToolSchema>): Promise<string> => {
  return 'Hello, world!'
}

export const saveReviewsTool = {
  name: 'save_reviews',
  description: 'Save reviews to the database',
  parameters: saveReviewsToolSchema,
  execute: saveReviewsToolHandler
}
