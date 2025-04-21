# KudosiMCP - Technical Specifications

## JSON Output Format
The system returns review data in a standardized JSON format:

```json
{
  "status": "success",
  "product": {
    "id": "1005001234567890",
    "title": "Product Name",
    "url": "https://www.aliexpress.com/item/1005001234567890.html"
  },
  "review_summary": {
    "average_rating": 4.7,
    "total_reviews": 236,
    "rating_distribution": {
      "5_star": 198,
      "4_star": 25,
      "3_star": 8,
      "2_star": 3,
      "1_star": 2
    }
  },
  "metadata": {
    "collection_timestamp": "2023-10-20T08:15:30Z",
    "total_pages": 12,
    "processing_time_ms": 1453
  },
  "reviews": [
    {
      "review_id": "1285947362",
      "reviewer": {
        "name": "John D.",
        "country": "United States",
        "buyer_account_type": "regular"
      },
      "rating": 5,
      "date": "2023-09-15T14:30:00Z",
      "content": "Great product! Fast shipping and exactly as described.",
      "images": [
        {
          "url": "https://ae01.alicdn.com/kf/Ua8b2874a6e3f4b8b.jpg",
          "thumbnail": "https://ae01.alicdn.com/kf/Ua8b2874a6e3f4b8b_50x50.jpg"
        }
      ],
      "helpful_votes": 12,
      "language": "en",
      "verified_purchase": true,
      "product_attributes": {
        "color": "Blue",
        "size": "XL"
      }
    }
    // Additional reviews...
  ]
}
```

### Field Descriptions

1. **Status Object**
   - `status`: String - Success state of the request (success/error)

2. **Product Object**
   - `id`: String - Unique product identifier on AliExpress
   - `title`: String - Product title as displayed on AliExpress
   - `url`: String - Original product URL

3. **Review Summary Object**
   - `average_rating`: Number - Average product rating (1-5 scale)
   - `total_reviews`: Integer - Total number of reviews collected
   - `rating_distribution`: Object - Distribution of reviews by star rating

4. **Metadata Object**
   - `collection_timestamp`: String (ISO 8601) - When the data was collected
   - `total_pages`: Integer - Total number of review pages processed
   - `processing_time_ms`: Integer - Total processing time in milliseconds

5. **Reviews Array**
   - `review_id`: String - Unique identifier for the review
   - `reviewer`: Object - Information about the reviewer
     - `name`: String - Display name of reviewer (may be partially masked)
     - `country`: String - Country of reviewer
     - `buyer_account_type`: String - Type of buyer account
   - `rating`: Number - Review rating (1-5)
   - `date`: String (ISO 8601) - When the review was posted
   - `content`: String - Text content of the review
   - `images`: Array - Images attached to the review
   - `helpful_votes`: Integer - Number of helpful votes received
   - `language`: String - ISO language code
   - `verified_purchase`: Boolean - Whether this is a verified purchase
   - `product_attributes`: Object - Product variation attributes specific to the purchase

## Error Response Format

```json
{
  "status": "error",
  "error": {
    "code": 400,
    "message": "Invalid URL format: URL must be a valid AliExpress product page",
    "details": "The provided URL does not match the expected AliExpress product URL pattern"
  },
  "timestamp": "2023-10-20T08:15:30Z",
  "request_id": "req-12345-abcde"
}
```

## Error Handling
KudosiMCP implements a robust error handling system that covers:

1. **Input Validation**
   - URL format validation
   - Request parameter validation
   - Rate limiting protection

2. **External Service Errors**
   - AliExpress service unavailability
   - Connection timeouts
   - Unexpected response structures

3. **Processing Errors**
   - Parsing failures
   - Data extraction issues
   - Transformation errors

4. **HTTP Error Codes**
   - 400 - Bad Request (invalid input)
   - 401 - Unauthorized (authentication required)
   - 403 - Forbidden (insufficient permissions)
   - 404 - Not Found (product doesn't exist)
   - 429 - Too Many Requests (rate limit exceeded)
   - 500 - Internal Server Error (unexpected server issues)
   - 502 - Bad Gateway (issues with AliExpress service)
   - 503 - Service Unavailable (server temporarily unavailable)
   - 504 - Gateway Timeout (timed out connecting to AliExpress) 
