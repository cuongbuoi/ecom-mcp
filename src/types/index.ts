/**
 * Types for service responses and parameters
 */

/**
 * Interface for review data
 */
export interface Review {
  id: string
  username: string
  rating: number
  date: string
  content: string
  helpful: number
  images?: string[]
  verified: boolean
  country?: string
}

/**
 * Interface for review summary data
 */
export interface ReviewSummary {
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    '5': number
    '4': number
    '3': number
    '2': number
    '1': number
  }
  verifiedReviews: number
}

/**
 * Interface for API response
 */
export interface ReviewResponse {
  productInfo: {
    id: string
    title: string
    store: string
  }
  summary: ReviewSummary
  reviews: Review[]
}

/**
 * Type for get_reviews tool parameters
 */
export interface GetReviewsParams {
  url: string
  minRating?: number
  limit?: number
}
