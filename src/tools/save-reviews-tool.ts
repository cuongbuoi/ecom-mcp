import { TextContent, Tool, UserError } from 'fastmcp'
import { z } from 'zod'
import { createImportJob, saveReviews } from '../services/import/index.ts'

const saveReviewsToolSchema = z.object({
  product_id: z.number(),
  link: z.string().describe('The product link from the platform'),
  external_product_id: z.string().describe('The product ID from the platform'),
  reviews: z.array(
    z.object({
      review_id: z.string(),
      author: z.string(),
      star: z.number(),
      country: z.string(),
      content: z.string(),
      platform: z.string(),
      status: z.boolean(),
      created_at: z.string()
    })
  )
})

export const saveReviewsTool: Tool<undefined, typeof saveReviewsToolSchema> = {
  name: 'kds_save_reviews',
  description:
    'Save product reviews to the database. This tool imports reviews for a specific product, processes them, and returns statistics about successfully processed, duplicated, and filtered reviews. Use this to import customer reviews from supported platforms.',
  parameters: saveReviewsToolSchema,
  annotations: {
    title: 'Save Reviews',
  },
  execute: async (args) => {
    try {
      const { job_import_id } = await createImportJob({
        product_id: args.product_id,
        link: args.link,
        external_product_id: args.external_product_id
      })

      if (!job_import_id) {
        throw new UserError('Error: Job import ID is not found')
      }

      const data = await saveReviews({
        platform: 'aliexpress',
        product_id: args.product_id,
        reviews: args.reviews,
        job_import_id,
        link: args.link,
        external_product_id: args.external_product_id
      })
      if (!data.count_processed_reviews && !data.count_duplicated_reviews && !data.count_filtered_reviews) {
        throw new UserError('Something went wrong: Reviews not saved')
      }

      let resultText = `Reviews saved for Job Import ID ${job_import_id} successfully: ${data.count_processed_reviews} processed, ${data.count_duplicated_reviews} duplicated, ${data.count_filtered_reviews} filtered`

      if (data.count_duplicated_reviews) {
        resultText += `\n\nDuplicated reviews: ${data.count_duplicated_reviews}`
      }

      if (data.count_filtered_reviews) {
        resultText += `\n\nFiltered reviews: ${data.count_filtered_reviews}`
      }
      const result: TextContent = {
        type: 'text',
        text: resultText
      }
      return result
    } catch (error) {
      throw new UserError('Error: ' + error)
    }
  }
}
