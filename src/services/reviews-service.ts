import { Review, ReviewResponse } from '../types/index.js'

/**
 * Fetch reviews for an AliExpress product
 * @param url The URL of the AliExpress product
 * @param minRating Optional minimum rating filter
 * @param limit Optional maximum number of reviews to return
 * @returns Promise with the reviews response
 */
export async function fetchReviews(url: string, minRating?: number, limit: number = 20): Promise<ReviewResponse> {
  // Mock implementation - would be replaced with real API call or scraping
  // Extract product ID from URL or use a mock ID for now
  const productId = extractProductId(url) || 'mock-product-id'

  return generateMockReviews(productId, url, limit, minRating)
}

/**
 * Extract product ID from AliExpress URL
 * @param url The AliExpress product URL
 * @returns The extracted product ID or null if not found
 */
function extractProductId(url: string): string | null {
  try {
    const productUrl = new URL(url)
    // Example: extract from path or search params - would need to match AliExpress URL format
    const idMatch = productUrl.pathname.match(/\/item\/(\d+)\.html/)
    if (idMatch && idMatch[1]) {
      return idMatch[1]
    }
    return null
  } catch (error) {
    console.error('Invalid URL', error)
    return null
  }
}

/**
 * Generate mock reviews for testing
 * @param productId The product ID
 * @param productUrl The product URL
 * @param limit Maximum number of reviews to generate
 * @param minRating Optional minimum rating filter
 * @returns Mock review response
 */
function generateMockReviews(productId: string, productUrl: string, limit: number, minRating?: number): ReviewResponse {
  // Extract store and title from URL for demonstration
  const url = new URL(productUrl)
  const storeName = url.hostname.split('.')[0] || 'AliExpress Store'
  const pathParts = url.pathname.split('/')
  const productTitle = pathParts[pathParts.length - 1].replace(/-/g, ' ').replace('.html', '') || 'Product'

  // Generate random reviews
  const reviews: Review[] = []
  const countries = ['United States', 'Vietnam', 'Australia', 'Germany', 'Brazil', 'Canada', 'France']
  const maxReviews = Math.min(limit, 100)

  for (let i = 0; i < maxReviews; i++) {
    const rating = Math.floor(Math.random() * 5) + 1
    const isVerified = Math.random() > 0.3
    const hasImages = Math.random() > 0.7

    // Only add if it meets the minimum rating filter
    if (minRating === undefined || rating >= minRating) {
      const reviewDate = new Date()
      reviewDate.setDate(reviewDate.getDate() - Math.floor(Math.random() * 60))

      reviews.push({
        id: `review-${productId}-${i}`,
        username: `user${Math.floor(Math.random() * 1000)}`,
        rating,
        date: reviewDate.toISOString().split('T')[0],
        content: getRandomReviewContent(rating),
        helpful: Math.floor(Math.random() * 50),
        verified: isVerified,
        country: countries[Math.floor(Math.random() * countries.length)],
        ...(hasImages && {
          images: [
            `https://example.com/reviews/image${i}_1.jpg`,
            ...(Math.random() > 0.5 ? [`https://example.com/reviews/image${i}_2.jpg`] : [])
          ]
        })
      })
    }
  }

  // Calculate summary statistics
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = reviews.length > 0 ? parseFloat((totalRating / reviews.length).toFixed(1)) : 0

  return {
    productInfo: {
      id: productId,
      title: productTitle,
      store: storeName
    },
    summary: {
      totalReviews: reviews.length,
      averageRating,
      ratingDistribution: {
        '5': reviews.filter((r) => r.rating === 5).length,
        '4': reviews.filter((r) => r.rating === 4).length,
        '3': reviews.filter((r) => r.rating === 3).length,
        '2': reviews.filter((r) => r.rating === 2).length,
        '1': reviews.filter((r) => r.rating === 1).length
      },
      verifiedReviews: reviews.filter((r) => r.verified).length
    },
    reviews
  }
}

/**
 * Get random review content based on rating
 * @param rating The review rating
 * @returns Random review content
 */
function getRandomReviewContent(rating: number): string {
  const positiveReviews = [
    'Great product! Exactly as described and arrived on time.',
    'Very happy with my purchase. Good quality for the price.',
    'Excellent value. Would definitely buy again.',
    'Fast shipping and product works perfectly.',
    'Love it! Better than expected.'
  ]

  const neutralReviews = [
    'Product is okay. Not amazing but does the job.',
    'Decent quality for the price. Some minor issues but overall satisfied.',
    'Arrived on time but packaging was damaged. Product works though.',
    'Average quality. Might buy again.'
  ]

  const negativeReviews = [
    'Disappointed with the quality. Not worth the money.',
    'Arrived late and was damaged. Would not recommend.',
    'Product stopped working after a few days.',
    'Not as described. Color is different from the photos.',
    'Poor quality. Will be asking for a refund.'
  ]

  if (rating >= 4) {
    return positiveReviews[Math.floor(Math.random() * positiveReviews.length)]
  } else if (rating >= 3) {
    return neutralReviews[Math.floor(Math.random() * neutralReviews.length)]
  } else {
    return negativeReviews[Math.floor(Math.random() * negativeReviews.length)]
  }
}
