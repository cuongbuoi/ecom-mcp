import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { Page } from 'puppeteer'
import dotenv from 'dotenv'

// Nạp các biến môi trường từ file .env
dotenv.config()

// Lấy API key từ biến môi trường
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''

/**
 * Khởi tạo API của Gemini
 */
function initGemini() {
  if (!GEMINI_API_KEY) {
    throw new Error('API key Gemini không được cấu hình')
  }
  return new GoogleGenerativeAI(GEMINI_API_KEY)
}

/**
 * Interface cho kết quả từ việc phân tích selectors
 */
export interface DOMSelectors {
  reviewButtonSelector?: string
  reviewItemSelector?: string
  modalSelector?: string
  paginationSelector?: string
}

/**
 * Phân tích DOM của trang web để tìm selectors liên quan đến đánh giá sản phẩm
 *
 * @param page Trang web Puppeteer đã được tải
 * @returns Các selectors tìm thấy hoặc object rỗng nếu không tìm thấy
 */
export async function analyzeDOMForReviewElements(page: Page): Promise<DOMSelectors> {
  try {
    // Trích xuất HTML đơn giản từ trang để giảm số token
    const simplifiedHTML = await extractReviewRelatedHTML(page)

    const genAI = initGemini()

    // Cấu hình mô hình Gemini
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
        }
      ]
    })

    // Tạo prompt yêu cầu Gemini phân tích HTML và trả về selectors
    const prompt = `Analyze this HTML snippet from an e-commerce product page (likely AliExpress) and identify the selectors for:

1. Review button: Element that users click to see reviews (usually a button or link with text like "View reviews", "Customer reviews", "See feedback", etc.)
2. Review items: The elements that contain individual reviews (look for repeated patterns of customer comments, ratings, etc.)
3. Review modal: A modal/popup container that appears when users click to see all reviews
4. Pagination: Elements for navigating between pages of reviews

Return ONLY a JSON object with these properties:
- reviewButtonSelector: CSS selector for the review button/link (e.g., ".product-reviews-summary a")
- reviewItemSelector: CSS selector for individual review items (e.g., ".review-item")
- modalSelector: CSS selector for the review modal/container (e.g., ".review-modal")
- paginationSelector: CSS selector for the pagination element (e.g., ".review-pagination")

DO NOT include explanations, just return the JSON. If you can't identify a certain element, omit that property.

HTML snippet:
${simplifiedHTML}`

    // Gửi prompt tới Gemini và nhận kết quả
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse kết quả JSON từ phản hồi
    try {
      // Đảm bảo chỉ lấy phần JSON trong output
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      return {}
    } catch (e) {
      return {}
    }
  } catch (error) {
    return {}
  }
}

/**
 * Trích xuất HTML có liên quan đến đánh giá từ trang
 */
async function extractReviewRelatedHTML(page: Page): Promise<string> {
  return await page.evaluate(() => {
    // Danh sách từ khóa liên quan đến đánh giá sản phẩm
    const reviewRelatedKeywords = ['review', 'feedback', 'comment', 'rating', 'đánh giá', 'nhận xét', 'phản hồi']
    const candidates: string[] = []

    // Tìm những elements có khả năng chứa đánh giá
    for (const keyword of reviewRelatedKeywords) {
      // Tìm theo class hoặc id
      const elements = document.querySelectorAll(`[class*="${keyword}"], [id*="${keyword}"]`)
      elements.forEach((el) => candidates.push(el.outerHTML))

      // Tìm theo nội dung text
      document.querySelectorAll('div, span, a, button').forEach((el) => {
        if (el.textContent?.toLowerCase().includes(keyword)) {
          candidates.push(el.outerHTML)
        }
      })
    }

    // Lấy thêm các tab elements vì đánh giá thường nằm trong tabs
    document.querySelectorAll('.tab, [role="tab"], .tabs, .tab-item').forEach((el) => {
      candidates.push(el.outerHTML)
    })

    // Lọc các kết quả trùng lặp và giới hạn kích thước để tránh vượt quá token limit
    return [...new Set(candidates)].slice(0, 50).join('\n')
  })
}
