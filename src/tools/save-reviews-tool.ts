import { TextContent, Tool, UserError } from 'fastmcp'
import { z } from 'zod'
import { createImportJob, saveReviews } from '../services/import/index.ts'

const saveReviewsToolSchema = z.object({
  product_id: z.number(),
  link: z.string(),
  external_product_id: z.string(),
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
  execute: async (params, { reportProgress }) => {
    try {
      reportProgress({
        progress: 0,
        total: 100
      })
      const { job_import_id } = await createImportJob({
        product_id: params.product_id,
        link: params.link,
        external_product_id: params.external_product_id
      })
      reportProgress({
        progress: 30,
        total: 100
      })
      if (!job_import_id) {
        throw new UserError('Error: Job import ID is not found')
      }

      const data = await saveReviews({
        platform: 'aliexpress',
        product_id: params.product_id,
        reviews: params.reviews,
        job_import_id,
        link: params.link,
        external_product_id: params.external_product_id
      })
      reportProgress({
        progress: 70,
        total: 100
      })
      if (!data.count_processed_reviews && !data.count_duplicated_reviews && !data.count_filtered_reviews) {
        throw new UserError('Something went wrong: Reviews not saved')
      }

      let resultText = `Reviews saved successfully: ${data.count_processed_reviews} processed, ${data.count_duplicated_reviews} duplicated, ${data.count_filtered_reviews} filtered`

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
    } finally {
      reportProgress({
        progress: 100,
        total: 100
      })
    }
  }
}
