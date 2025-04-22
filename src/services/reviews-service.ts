import { Review, ReviewResponse } from '../types/index.js'
import puppeteer, { Browser, Page } from 'puppeteer'
import { analyzeDOMForReviewElements } from './gemini-service.js'

/**
 * Fetch reviews for an e-commerce product
 * @param url The URL of the e-commerce product
 * @param minRating Optional minimum rating filter
 * @param limit Optional maximum number of reviews to return
 * @returns Promise with the reviews response
 */
export async function fetchReviews(url: string, minRating?: number, limit: number = 20): Promise<ReviewResponse> {
  const browser = await launchBrowser()

  try {
    // For now, only support AliExpress
    if (isAliExpressUrl(url)) {
      return await extractAliExpressReviews(browser, url, minRating, limit)
    } else {
      throw new Error('Currently only AliExpress URLs are supported')
    }
  } finally {
    await browser.close()
  }
}

/**
 * Launch a Puppeteer browser with appropriate settings
 */
async function launchBrowser(): Promise<Browser> {
  return await puppeteer.launch({
    headless: 'shell',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: [
      '--disable-setuid-sandbox',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1366,768'
    ],
    timeout: 60000 // Increase timeout to 60 seconds
  })
}

/**
 * Check if the URL is an AliExpress product URL
 */
export function isAliExpressUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname.includes('aliexpress.com')
  } catch (error) {
    return false
  }
}

/**
 * Extract product ID from AliExpress URL
 * @param url The AliExpress product URL
 * @returns The extracted product ID or null if not found
 */
export function extractProductId(url: string): string | null {
  try {
    const productUrl = new URL(url)
    // Extract from path or search params based on AliExpress URL format
    const idMatch = productUrl.pathname.match(/\/item\/(\d+)\.html/)
    if (idMatch && idMatch[1]) {
      return idMatch[1]
    }

    // Alternative pattern for some AliExpress URLs
    const altMatch = productUrl.pathname.match(/\/(\d+)\.html/)
    if (altMatch && altMatch[1]) {
      return altMatch[1]
    }

    return null
  } catch (error) {
    return null
  }
}

/**
 * Extract reviews from an AliExpress product page with Gemini AI assistance
 */
async function extractAliExpressReviews(
  browser: Browser,
  url: string,
  minRating?: number,
  limit = 20
): Promise<ReviewResponse> {
  const productId = extractProductId(url) || 'unknown'

  const page = await browser.newPage()

  try {
    // Cấu hình trình duyệt để tránh bị phát hiện
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    )

    // Thêm các trường hợp cookie và header
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      Referer: 'https://www.google.com/'
    })

    // Tắt JavaScript để giảm khả năng phát hiện bot
    await page.setJavaScriptEnabled(false)

    // Đặt viewport như người dùng thực
    await page.setViewport({
      width: 1280,
      height: 800
    })

    // Điều hướng đến trang sản phẩm với timeout cao hơn
    try {
      await page.goto(url, {
        timeout: 180000, // 3 phút
        waitUntil: 'domcontentloaded' // Đợi cho đến khi DOM được tải
      })
    } catch (navError) {
      throw new Error(
        `Không thể điều hướng đến trang: ${navError instanceof Error ? navError.message : 'Lỗi không xác định'}`
      )
    }

    try {
      const productInfo = await extractProductInfo(page)

      // Bật lại JavaScript để tương tác với trang
      await page.setJavaScriptEnabled(true)

      // Thêm delay trước khi phân tích trang
      await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 3000)))

      // Sử dụng Gemini AI để phân tích DOM và tìm selectors
      const selectors = await analyzeDOMForReviewElements(page)

      // Sử dụng selectors từ Gemini hoặc phương pháp backup
      const reviewBtnSelector = selectors.reviewButtonSelector || (await findReviewButtonSelector(page))

      if (!reviewBtnSelector) {
        throw new Error('Không tìm thấy nút đánh giá trên trang')
      }

      await page.click(reviewBtnSelector)

      // Đợi modal hoặc section đánh giá xuất hiện
      let modalSelector = selectors.modalSelector
      if (!modalSelector) {
        const modalResult = await findReviewModalSelector(page)
        if (modalResult) {
          modalSelector = modalResult
        } else {
          throw new Error('Không tìm thấy modal đánh giá')
        }
      }

      await page.waitForSelector(modalSelector, { timeout: 30000 })

      // Sử dụng selector item từ Gemini hoặc tìm thủ công
      let reviewItemSelector = selectors.reviewItemSelector
      if (!reviewItemSelector) {
        const itemResult = await findReviewItemSelector(page, modalSelector)
        if (itemResult) {
          reviewItemSelector = itemResult
        } else {
          throw new Error('Không tìm thấy các mục đánh giá')
        }
      }

      // Sử dụng pagination selector từ Gemini hoặc tìm thủ công
      const paginationSelector = selectors.paginationSelector ?? (await findPaginationSelector(page, modalSelector))

      // Trích xuất đánh giá với phân trang
      const reviews = await extractReviewsFromModal(page, reviewItemSelector, minRating, limit, paginationSelector)

      // Tính toán tóm tắt
      const summary = calculateReviewSummary(reviews)

      return {
        productInfo: {
          id: productId,
          title: productInfo.title,
          store: productInfo.store
        },
        summary,
        reviews
      }
    } catch (processingError) {
      throw new Error(
        `Lỗi xử lý trang AliExpress: ${processingError instanceof Error ? processingError.message : 'Lỗi không xác định'}`
      )
    }
  } catch (error) {
    throw new Error(
      `Không thể trích xuất đánh giá AliExpress: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`
    )
  } finally {
    await page.close()
  }
}

/**
 * Extract basic product information from the page
 */
async function extractProductInfo(page: Page): Promise<{ title: string; store: string }> {
  // Use AI-driven selectors to find product title and store
  const productSelectors = await findProductInfoSelectors(page)

  let title = 'Unknown Product'
  let store = 'Unknown Store'

  try {
    if (productSelectors.titleSelector) {
      title = await page.$eval(productSelectors.titleSelector, (el) => el.textContent?.trim() || 'Unknown Product')
    }

    if (productSelectors.storeSelector) {
      store = await page.$eval(productSelectors.storeSelector, (el) => el.textContent?.trim() || 'Unknown Store')
    }
  } catch (error) {
    // Silent error - use defaults
  }

  return { title, store }
}

/**
 * Use AI-driven analysis to find product info selectors
 */
async function findProductInfoSelectors(page: Page): Promise<{ titleSelector: string; storeSelector: string }> {
  // List of common selectors for product title and store
  const titleSelectors = ['h1.product-title', '.product-title-text', '.product-name', '[data-pl="product-title"]', 'h1']

  const storeSelectors = ['.shop-name', '.store-name', '.shop-info-name', '[data-pl="store-info"]', '.seller-info']

  // Find the first selector that exists on the page
  const titleSelector = await findFirstExistingSelector(page, titleSelectors)
  const storeSelector = await findFirstExistingSelector(page, storeSelectors)

  return {
    titleSelector: titleSelector || 'h1',
    storeSelector: storeSelector || '.shop-name'
  }
}

/**
 * Find the first selector from a list that exists on the page
 */
async function findFirstExistingSelector(page: Page, selectors: string[]): Promise<string | null> {
  for (const selector of selectors) {
    const exists = (await page.$(selector)) !== null
    if (exists) return selector
  }
  return null
}

/**
 * Use AI-driven analysis to find the review button selector
 */
async function findReviewButtonSelector(page: Page): Promise<string> {
  // Common selectors for review buttons
  const reviewButtonSelectors = [
    '.product-reviewer-reviews .view-more-btn',
    '.product-review-entrance .view-more',
    '[data-pl="product-reviews"] .view-more',
    '.reviews-more',
    '.feedback-show-all',
    // Add selectors for Vietnamese version
    '[data-pl="product-review-view-more"]',
    '.Product_PC_Reviews_More__m3mbn',
    '.tab-header span[data-anchor="feedback"]',
    '.pdp-review-summary a',
    '.review-counts',
    '[data-spm-anchor-id*="feedback"]',
    'a[href*="feedback"]',
    '.overview-rating-average',
    '.buyer-feedback a',
    '.product-reviewer a',
    '.product-dynamic-info a[href*="feedback"]',
    '.pdp-review a',
    '.product-reviewer-reviews a',
    '.pdp-review-count a',
    '.reviews-link'
  ]

  // Find the first selector that exists on the page
  const selector = await findFirstExistingSelector(page, reviewButtonSelectors)

  if (!selector) {
    // If no predefined selector works, try to find it by text content
    const buttonByText = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a, span, div'))

      // List of text fragments to look for (including Vietnamese)
      const textFragments = [
        'review',
        'đánh giá',
        'feedback',
        'phản hồi',
        'reviews',
        'nhận xét',
        'xem thêm',
        'view more',
        'see all',
        'xem tất cả'
      ]

      const reviewButton = buttons.find((btn) => {
        const text = btn.textContent?.toLowerCase() || ''
        return textFragments.some((fragment) => text.includes(fragment))
      })

      if (reviewButton) {
        // Create a unique selector for this element
        const tag = reviewButton.tagName.toLowerCase()
        const classes = Array.from(reviewButton.classList).join('.')
        return classes ? `${tag}.${classes}` : null
      }

      return null
    })

    if (buttonByText) return buttonByText

    // Try taking a screenshot for debugging
    try {
      await page.screenshot({ path: 'debug-aliexpress-page.png', fullPage: true })
    } catch (e) {
      // Silent error
    }

    // Last resort: look for elements with review-related classes
    const elementsWithReviewClasses = await page.evaluate(() => {
      const elements = document.querySelectorAll(
        '[class*="review"], [class*="feedback"], [id*="review"], [class*="rating"], [class*="stars"], [class*="đánh-giá"]'
      )

      if (elements.length > 0) {
        const el = elements[0]
        const tag = el.tagName.toLowerCase()
        const classes = Array.from(el.classList).join('.')
        return classes ? `${tag}.${classes}` : null
      }

      return null
    })

    if (elementsWithReviewClasses) {
      return elementsWithReviewClasses
    }

    // Final fallback
    return '.product-reviewer-reviews .view-more-btn'
  }

  return selector
}

/**
 * Use AI-driven analysis to find the review modal selector
 */
async function findReviewModalSelector(page: Page): Promise<string | null> {
  // Common selectors for review modals
  const modalSelectors = [
    '.feedback-dialog',
    '.review-modal',
    '.review-popup',
    '.feedback-container',
    '.review-wrapper'
  ]

  // Wait for any modal to appear
  await page.waitForFunction(
    () => {
      const elements = document.querySelectorAll(
        '.feedback-dialog, .review-modal, [class*="review"][class*="dialog"], [class*="feedback"][class*="modal"]'
      )
      return elements.length > 0
    },
    { timeout: 30000 }
  )

  // Find the first selector that exists on the page
  const selector = await findFirstExistingSelector(page, modalSelectors)

  if (!selector) {
    // If no predefined selector works, look for newly appeared elements
    const modalElement = await page.evaluate(() => {
      // Look for modal-like elements that contain reviews
      const potentialModals = document.querySelectorAll('[class*="dialog"], [class*="modal"], [class*="popup"]')

      for (const modal of potentialModals) {
        // Check if it contains review-like elements
        const hasReviews =
          modal.querySelectorAll('[class*="review"], [class*="feedback"], [class*="rating"]').length > 0
        if (hasReviews) {
          const tag = modal.tagName.toLowerCase()
          const classes = Array.from(modal.classList).join('.')
          return classes ? `${tag}.${classes}` : null
        }
      }

      return null
    })

    if (modalElement) return modalElement

    // Final fallback
    return '.feedback-dialog'
  }

  return selector
}

/**
 * Find the selector for review items in the modal
 */
async function findReviewItemSelector(page: Page, modalSelector: string): Promise<string | null> {
  // Common selectors for review items
  const reviewItemSelectors = [
    `${modalSelector} .feedback-item`,
    `${modalSelector} .review-item`,
    `${modalSelector} [class*="review-item"]`,
    `${modalSelector} [class*="feedback-item"]`,
    `${modalSelector} .review-wrapper`
  ]

  // Find the first selector that exists on the page
  const selector = await findFirstExistingSelector(page, reviewItemSelectors)

  if (!selector) {
    // If no predefined selector works, look for review-like elements in the modal
    const reviewElements = await page.evaluate((modalSel) => {
      const modal = document.querySelector(modalSel)
      if (!modal) return null

      // Look for elements that might be reviews
      const candidates = modal.querySelectorAll('[class*="review"], [class*="feedback"], [class*="comment"]')

      // Find the most common parent class that could represent review items
      const parentClasses = new Map()

      for (const candidate of candidates) {
        // Find parent that might be a review item container
        let parent = candidate.parentElement
        let depth = 0

        while (parent && depth < 3) {
          const classes = Array.from(parent.classList)

          if (classes.length > 0) {
            for (const cls of classes) {
              if (cls.includes('item') || cls.includes('review') || cls.includes('feedback')) {
                parentClasses.set(cls, (parentClasses.get(cls) || 0) + 1)
              }
            }
          }

          parent = parent.parentElement
          depth++
        }
      }

      // Find the most common class
      let mostCommonClass = null
      let maxCount = 0

      for (const [cls, count] of parentClasses.entries()) {
        if (count > maxCount) {
          mostCommonClass = cls
          maxCount = count
        }
      }

      return mostCommonClass ? `${modalSel} .${mostCommonClass}` : null
    }, modalSelector)

    if (reviewElements) return reviewElements

    // Final fallback
    return `${modalSelector} .feedback-item`
  }

  return selector
}

/**
 * Find the selector for pagination in the modal
 */
async function findPaginationSelector(page: Page, modalSelector: string): Promise<string | null> {
  // Common selectors for pagination
  const paginationSelectors = [
    `${modalSelector} .feedback-pagination`,
    `${modalSelector} .review-pagination`,
    `${modalSelector} .pagination`,
    `${modalSelector} [class*="page"][class*="nation"]`,
    `${modalSelector} .page-container`
  ]

  // Find the first selector that exists on the page
  return await findFirstExistingSelector(page, paginationSelectors)
}

/**
 * Check if there's a next page button in the pagination
 */
async function hasNextPageButton(page: Page, paginationSelector: string): Promise<boolean> {
  return await page.evaluate((selector) => {
    const pagination = document.querySelector(selector)
    if (!pagination) return false

    // Look for next button patterns
    const nextButton = pagination.querySelector('.next-btn, .next, [class*="next"], [aria-label*="Next"]')

    // Check if it exists and is not disabled
    return nextButton !== null && !nextButton.classList.contains('disabled') && !nextButton.hasAttribute('disabled')
  }, paginationSelector)
}

/**
 * Click the next page button
 */
async function clickNextPageButton(page: Page, paginationSelector: string): Promise<boolean> {
  return await page.evaluate((selector) => {
    const pagination = document.querySelector(selector)
    if (!pagination) return false

    // Look for next button patterns
    const nextButton = pagination.querySelector('.next-btn, .next, [class*="next"], [aria-label*="Next"]')

    // Check if it exists and is not disabled
    if (nextButton && !nextButton.classList.contains('disabled') && !nextButton.hasAttribute('disabled')) {
      // Click the next button
      ;(nextButton as HTMLElement).click()
      return true
    }

    return false
  }, paginationSelector)
}

/**
 * Extract reviews from the modal with pagination handling
 */
async function extractReviewsFromModal(
  page: Page,
  reviewItemSelector: string,
  minRating?: number,
  limit = 20,
  paginationSelector?: string | null
): Promise<Review[]> {
  const reviews: Review[] = []

  let _currentPage = 1
  let shouldContinue = true

  while (shouldContinue && reviews.length < limit) {
    // Wait for review items to load
    await page.waitForSelector(reviewItemSelector, { timeout: 30000 })

    // Extract reviews from current page
    const pageReviews = await extractReviewsFromPage(page, reviewItemSelector)

    // Filter by minimum rating if specified
    const filteredReviews = minRating ? pageReviews.filter((review) => review.rating >= minRating) : pageReviews

    // Add reviews to the list (up to the limit)
    for (const review of filteredReviews) {
      if (reviews.length < limit) {
        reviews.push(review)
      } else {
        shouldContinue = false
        break
      }
    }

    // Check if we need to go to the next page
    if (shouldContinue && paginationSelector) {
      const hasNextPage = await hasNextPageButton(page, paginationSelector)

      if (hasNextPage) {
        const success = await clickNextPageButton(page, paginationSelector)

        if (!success) {
          shouldContinue = false
        } else {
          _currentPage++
          // Wait for new content to load
          await page.waitForFunction(() => true, { timeout: 1000 })
        }
      } else {
        shouldContinue = false
      }
    } else {
      shouldContinue = false
    }
  }

  return reviews
}

/**
 * Extract reviews from the current page
 */
async function extractReviewsFromPage(page: Page, reviewItemSelector: string): Promise<Review[]> {
  return await page.evaluate((selector) => {
    const reviewElements = document.querySelectorAll(selector)
    const reviews = []

    for (let i = 0; i < reviewElements.length; i++) {
      const reviewElement = reviewElements[i]

      // Try to identify review elements with AI-like logic
      const usernameElement = findElementByPattern(reviewElement, ['user', 'buyer', 'author', 'name'])
      const ratingElement = findElementByPattern(reviewElement, ['rating', 'stars', 'score', 'rate'])
      const dateElement = findElementByPattern(reviewElement, ['date', 'time'])
      const contentElement = findElementByPattern(reviewElement, ['content', 'text', 'description', 'comment'])
      const helpfulElement = findElementByPattern(reviewElement, ['helpful', 'useful', 'likes'])
      const verifiedElement = findElementByPattern(reviewElement, ['verified', 'confirmed', 'authentic'])
      const countryElement = findElementByPattern(reviewElement, ['country', 'region', 'location'])

      // Extract data from elements
      const username = usernameElement ? usernameElement.textContent?.trim() || 'Anonymous' : 'Anonymous'

      // Extract rating from stars
      let rating = 5 // Default
      if (ratingElement) {
        // Try to find star elements
        const fullStars = ratingElement.querySelectorAll('[class*="full"]')

        if (fullStars.length > 0) {
          rating = fullStars.length
        } else {
          // Try to parse from text
          const ratingText = ratingElement.textContent?.trim() || ''
          const ratingMatch = ratingText.match(/(\d+(\.\d+)?)/)

          if (ratingMatch) {
            rating = Math.round(parseFloat(ratingMatch[1]))
          }
        }
      }

      // Extract date
      const date = dateElement
        ? dateElement.textContent?.trim() || new Date().toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]

      // Extract content
      const content = contentElement ? contentElement.textContent?.trim() || '' : ''

      // Extract helpful count
      let helpful = 0
      if (helpfulElement) {
        const helpfulText = helpfulElement.textContent?.trim() || '0'
        const helpfulMatch = helpfulText.match(/\d+/)

        if (helpfulMatch) {
          helpful = parseInt(helpfulMatch[0], 10)
        }
      }

      // Extract verification status
      const verified = verifiedElement !== null

      // Extract country
      const country = countryElement ? countryElement.textContent?.trim() : undefined

      // Extract images
      const images = Array.from(reviewElement.querySelectorAll('img'))
        .map((img) => img.getAttribute('src'))
        .filter(Boolean) as string[]

      // Create review object
      reviews.push({
        id: `review-${i}`,
        username,
        rating,
        date,
        content,
        helpful,
        verified,
        country,
        ...(images.length > 0 && { images })
      })
    }

    return reviews

    // Helper function to find elements by pattern
    function findElementByPattern(parent: Element, patterns: string[]): Element | null {
      // First try using class or ID
      for (const pattern of patterns) {
        const elementByClass = parent.querySelector(`[class*="${pattern}"]`)
        if (elementByClass) return elementByClass

        const elementById = parent.querySelector(`[id*="${pattern}"]`)
        if (elementById) return elementById
      }

      // Then try with data attributes
      for (const pattern of patterns) {
        const elementByData = parent.querySelector(`[data-*="${pattern}"]`)
        if (elementByData) return elementByData
      }

      // Finally, look for text content that matches
      const allElements = Array.from(parent.querySelectorAll('*'))

      for (const element of allElements) {
        const text = element.textContent?.toLowerCase() || ''

        if (patterns.some((pattern) => text.includes(pattern.toLowerCase()))) {
          return element
        }
      }

      return null
    }
  }, reviewItemSelector)
}

/**
 * Calculate review summary statistics
 */
export function calculateReviewSummary(reviews: Review[]): ReviewResponse['summary'] {
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = reviews.length > 0 ? parseFloat((totalRating / reviews.length).toFixed(1)) : 0

  return {
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
  }
}
