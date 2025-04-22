import { isAliExpressUrl, extractProductId, calculateReviewSummary } from '../src/services/reviews-service.js'
import { Review } from '../src/types/index.js'

// These tests focus on the utility functions that can be tested without mocking Puppeteer
describe('Reviews Service Tests', () => {
  describe('isAliExpressUrl', () => {
    // We need to use the private function directly

    it('should return true for valid AliExpress URLs', () => {
      expect(isAliExpressUrl('https://aliexpress.com/item/12345.html')).toBe(true)
      expect(isAliExpressUrl('https://vi.aliexpress.com/item/12345.html')).toBe(true)
      expect(isAliExpressUrl('http://www.aliexpress.com/item/12345.html?param=value')).toBe(true)
    })

    it('should return false for non-AliExpress URLs', () => {
      expect(isAliExpressUrl('https://example.com/item/12345.html')).toBe(false)
      expect(isAliExpressUrl('https://amazon.com/dp/B08N5KWB9H')).toBe(false)
    })

    it('should return false for invalid URLs', () => {
      expect(isAliExpressUrl('invalid-url')).toBe(false)
      expect(isAliExpressUrl('')).toBe(false)
    })
  })

  describe('extractProductId', () => {
    // Access the private function

    it('should extract product ID from standard AliExpress URL', () => {
      expect(extractProductId('https://aliexpress.com/item/1005003077172831.html')).toBe('1005003077172831')
      expect(extractProductId('https://vi.aliexpress.com/item/1005003077172831.html?gatewayAdapt=glo2vnm')).toBe(
        '1005003077172831'
      )
    })

    it('should extract product ID from alternative AliExpress URL format', () => {
      expect(extractProductId('https://aliexpress.com/1005003077172831.html')).toBe('1005003077172831')
    })

    it('should return null for URLs without product ID', () => {
      expect(extractProductId('https://aliexpress.com/category/phones.html')).toBeNull()
      expect(extractProductId('https://aliexpress.com/')).toBeNull()
    })

    it('should return null for invalid URLs', () => {
      expect(extractProductId('invalid-url')).toBeNull()
    })
  })

  describe('calculateReviewSummary', () => {
    // Access the private function

    it('should calculate correct summary stats', () => {
      const reviews: Review[] = [
        { id: '1', username: 'user1', rating: 5, date: '2023-01-01', content: 'Great', helpful: 1, verified: true },
        { id: '2', username: 'user2', rating: 4, date: '2023-01-02', content: 'Good', helpful: 2, verified: true },
        { id: '3', username: 'user3', rating: 3, date: '2023-01-03', content: 'Okay', helpful: 3, verified: false },
        { id: '4', username: 'user4', rating: 2, date: '2023-01-04', content: 'Poor', helpful: 4, verified: true },
        { id: '5', username: 'user5', rating: 1, date: '2023-01-05', content: 'Bad', helpful: 5, verified: false }
      ]

      const summary = calculateReviewSummary(reviews)

      expect(summary.totalReviews).toBe(5)
      expect(summary.averageRating).toBe(3) // (5+4+3+2+1)/5 = 15/5 = 3
      expect(summary.ratingDistribution['5']).toBe(1)
      expect(summary.ratingDistribution['4']).toBe(1)
      expect(summary.ratingDistribution['3']).toBe(1)
      expect(summary.ratingDistribution['2']).toBe(1)
      expect(summary.ratingDistribution['1']).toBe(1)
      expect(summary.verifiedReviews).toBe(3)
    })

    it('should handle empty reviews array', () => {
      const summary = calculateReviewSummary([])

      expect(summary.totalReviews).toBe(0)
      expect(summary.averageRating).toBe(0)
      expect(summary.ratingDistribution['5']).toBe(0)
      expect(summary.ratingDistribution['4']).toBe(0)
      expect(summary.ratingDistribution['3']).toBe(0)
      expect(summary.ratingDistribution['2']).toBe(0)
      expect(summary.ratingDistribution['1']).toBe(0)
      expect(summary.verifiedReviews).toBe(0)
    })
  })

  // Note: For fetchReviews and other functions that depend on Puppeteer,
  // we would need to create a more complex mocking setup that would work with the
  // specific types from Puppeteer. For a comprehensive test, we might also
  // consider integration tests with a running browser instance.
})
