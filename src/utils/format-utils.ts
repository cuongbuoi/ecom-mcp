import { Review, ReviewResponse } from '../types/index.js'

/**
 * Format a single review into a readable string format
 * @param review The review data to format
 * @returns Formatted review string
 */
export function formatReview(review: Review): string {
  const imagesText = review.images ? `\n[${review.images.length} hình ảnh đính kèm]` : ''
  const verifiedText = review.verified ? '[Đã xác thực]' : ''
  const countryText = review.country ? `từ ${review.country}` : ''
  const helpfulText = review.helpful > 0 ? `${review.helpful} người thấy hữu ích` : ''

  return `
★ ${review.rating}/5 - ${review.username} ${countryText} - ${review.date} ${verifiedText}
${review.content}${imagesText}
${helpfulText}
  `.trim()
}

/**
 * Format review summary into a readable string format
 * @param summary The review summary to format
 * @returns Formatted summary string
 */
export function formatReviewSummary(summary: ReviewResponse['summary']): string {
  return `
Tổng số đánh giá: ${summary.totalReviews}
Đánh giá trung bình: ${summary.averageRating}/5
Phân bố đánh giá:
  ★★★★★ (5): ${summary.ratingDistribution['5']}
  ★★★★☆ (4): ${summary.ratingDistribution['4']}
  ★★★☆☆ (3): ${summary.ratingDistribution['3']}
  ★★☆☆☆ (2): ${summary.ratingDistribution['2']}
  ★☆☆☆☆ (1): ${summary.ratingDistribution['1']}
Đánh giá đã xác thực: ${summary.verifiedReviews}
  `.trim()
}

/**
 * Format product info into a readable string format
 * @param productInfo The product info to format
 * @returns Formatted product info string
 */
export function formatProductInfo(productInfo: ReviewResponse['productInfo']): string {
  return `
Sản phẩm: ${productInfo.title}
Cửa hàng: ${productInfo.store}
ID: ${productInfo.id}
  `.trim()
}

/**
 * Format the complete review response into a readable string
 * @param response The review response to format
 * @returns Formatted review response
 */
export function formatReviewResponse(response: ReviewResponse): string {
  const productInfo = formatProductInfo(response.productInfo)
  const summary = formatReviewSummary(response.summary)
  const reviews = response.reviews.map(formatReview).join('\n\n')

  return `
${productInfo}

${summary}

=== ĐÁNH GIÁ ===
${reviews}
  `.trim()
}
