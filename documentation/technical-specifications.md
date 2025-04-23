# KudosiMCP - Technical Specifications

## JSON Output Format - Sprint Task Selection

The system returns a list of tasks from the current sprint matching the specified criteria:

```json
{
  "status": "success",
  "sprint": {
    "id": "534",
    "name": "Sprint 22",
    "start_date": "2024-04-01T00:00:00Z",
    "end_date": "2024-04-14T23:59:59Z",
    "status": "active"
  },
  "tasks": [
    {
      "key": "PROJ-123",
      "id": "10001",
      "type": "Story",
      "summary": "Update UI to display numbers with comma separators",
      "status": "Developing",
      "assignee": {
        "account_id": "445566",
        "display_name": "Jane Doe",
        "email": "jane.doe@company.com"
      },
      "priority": "Medium",
      "created_date": "2024-03-25T10:30:00Z",
      "last_status_change": "2024-04-02T09:15:00Z"
    },
    {
      "key": "PROJ-124",
      "id": "10002",
      "type": "Task",
      "summary": "Create API endpoint for user preferences",
      "status": "Specify",
      "assignee": {
        "account_id": "112233",
        "display_name": "John Smith",
        "email": "john.smith@company.com"
      },
      "priority": "High",
      "created_date": "2024-03-26T14:45:00Z",
      "last_status_change": "2024-03-26T14:45:00Z"
    }
  ],
  "filter_applied": {
    "status": ["Specify", "Developing"],
    "type": ["Story", "Task"]
  },
  "metadata": {
    "total_tasks_in_sprint": 12,
    "tasks_matching_filter": 2,
    "query_timestamp": "2024-04-03T08:10:30Z",
    "processing_time_ms": 432
  }
}
```

## JSON Output Format - Structured Jira Task Analysis

The system returns structured Jira task data in a standardized JSON format:

```json
{
  "status": "success",
  "task": {
    "key": "PROJ-123",
    "id": "10001",
    "url": "https://company.atlassian.net/browse/PROJ-123",
    "project": {
      "key": "PROJ",
      "name": "Project X"
    },
    "summary": "Update UI to display numbers with comma separators",
    "assignee": {
      "account_id": "445566",
      "display_name": "Jane Doe",
      "email": "jane.doe@company.com"
    },
    "created_date": "2023-09-15T10:30:00Z",
    "updated_date": "2023-10-20T15:45:30Z",
    "due_date": "2023-11-15",
    "status": {
      "name": "In Progress",
      "category": "In Progress"
    }
  },
  "structured_description": {
    "background": "Update the UI across the Kudosi app to display large numbers with comma separators for better readability.",
    "requirements": {
      "summary": "Apply number formatting to all numerical values where applicable (e.g., 1,000 instead of 1000; 10,000 instead of 10000).",
      "formatting_rules": "Formatting should follow standard rules.",
      "examples": ["1,000", "10,000", "100,000", "1,000,000"],
      "locale_handling": "The commas (dot or semicolon) is depend on the user's browser locale",
      "target_components": [
        "Number of imported reviews",
        "Average rating star",
        "Store growth visibility",
        "Number of published reviews",
        "Number of unpublished reviews"
      ]
    },
    "acceptance_criteria": [
      {
        "id": "AC1",
        "given": "a number is displayed in the UI",
        "when": "the number is 1,000 or greater",
        "then": "it should be formatted with comma separators (e.g., 1,000; 10,000; 1,000,000)."
      },
      {
        "id": "AC2",
        "given": "the number formatting uses locale methods",
        "when": "numbers are rendered",
        "then": "they should follow the user's locale"
      }
    ],
    "edge_cases": [],
    "related_documents": {
      "designs": "N/A",
      "prd": ""
    }
  },
  "linked_resources": {
    "confluence_pages": [
      {
        "id": "123456",
        "title": "Number Formatting Guidelines",
        "url": "https://company.atlassian.net/wiki/spaces/PROJ/pages/123456",
        "relevance": "high"
      }
    ],
    "gitlab_repositories": [
      {
        "url": "https://gitlab.com/company/project-x",
        "branch": "main",
        "relevant_paths": ["src/components/UI/", "src/utils/formatters.js"]
      }
    ]
  },
  "implementation_plan": {
    "summary": "Implement locale-aware number formatting across all specified UI components",
    "approach": "Create a central formatting utility and apply it consistently across components",
    "estimated_effort": "medium",
    "recommended_steps": [
      "Create or update number formatting utility function",
      "Identify all UI components displaying numerical values",
      "Apply formatting to all target components",
      "Add unit tests for formatting with various locales",
      "Verify implementation against acceptance criteria"
    ],
    "technical_considerations": [
      "Use browser's Intl.NumberFormat for locale-aware formatting",
      "Consider performance implications for large datasets",
      "Ensure consistent application across all specified UI components"
    ]
  },
  "metadata": {
    "analysis_timestamp": "2023-10-22T08:15:30Z",
    "processing_time_ms": 932
  }
}
```

## JSON Output Format - Confluence Integration Results

The system returns integrated Confluence content relevant to the Jira task:

```json
{
  "status": "success",
  "jira_task": {
    "key": "PROJ-123",
    "summary": "Update UI to display numbers with comma separators"
  },
  "confluence_content": [
    {
      "page": {
        "id": "123456",
        "title": "Number Formatting Guidelines",
        "url": "https://company.atlassian.net/wiki/spaces/PROJ/pages/123456",
        "last_modified": "2023-10-15T11:30:00Z"
      },
      "relevant_sections": [
        {
          "heading": "Locale-Specific Formatting",
          "content": "Number formatting should respect the user's locale settings...",
          "relevance_score": 0.92
        },
        {
          "heading": "Implementation Guidelines",
          "content": "When implementing number formatting, ensure consistent application...",
          "relevance_score": 0.88
        }
      ],
      "extracted_business_context": {
        "importance": "Number formatting is critical for financial data readability",
        "stakeholder_requirements": "Marketing team has requested this change to improve user experience",
        "business_impact": "Expected to reduce user confusion and improve data comprehension"
      }
    }
  ],
  "metadata": {
    "integration_timestamp": "2023-10-22T08:20:45Z",
    "processing_time_ms": 1245
  }
}
```

## JSON Output Format - GitLab Analysis Results

The system returns analysis of GitLab repositories referenced in the Jira task:

```json
{
  "status": "success",
  "jira_task": {
    "key": "PROJ-123",
    "summary": "Update UI to display numbers with comma separators"
  },
  "gitlab_analysis": {
    "repository": {
      "url": "https://gitlab.com/company/project-x",
      "analyzed_branch": "main",
      "last_commit": "8f7e6d5c4b3a2a1b0c9d8e7f6a5b4c3d2e1f0a9b"
    },
    "relevant_code_analysis": {
      "existing_formatting_utils": [
        {
          "file_path": "src/utils/formatters.js",
          "signature": "function formatNumber(value, locale = 'en-US') { ... }",
          "usage_count": 12,
          "relevance_score": 0.95
        }
      ],
      "target_components": [
        {
          "file_path": "src/components/Dashboard/ReviewCounter.jsx",
          "code_snippet": "const displayCount = review.count;  // Needs formatting",
          "implementation_difficulty": "low"
        },
        {
          "file_path": "src/components/Stats/RatingSummary.jsx",
          "code_snippet": "return <div>{averageRating} ({totalReviews})</div>;  // Needs formatting",
          "implementation_difficulty": "low"
        }
      ],
      "dependency_analysis": {
        "has_intl_support": true,
        "relevant_packages": ["intl", "react-intl"]
      }
    },
    "implementation_recommendations": {
      "approach": "Extend existing formatNumber utility in formatters.js",
      "estimated_changes": [
        {
          "file": "src/utils/formatters.js",
          "change_type": "modify",
          "description": "Update formatNumber to handle all requirements"
        },
        {
          "file": "src/components/Dashboard/ReviewCounter.jsx",
          "change_type": "modify",
          "description": "Apply formatNumber to review count display"
        }
      ]
    }
  },
  "metadata": {
    "analysis_timestamp": "2023-10-22T08:25:15Z",
    "processing_time_ms": 3245
  }
}
```

## JSON Output Format - Implementation Results

The system returns results of automated implementation based on the task analysis:

```json
{
  "status": "success",
  "jira_task": {
    "key": "PROJ-123",
    "summary": "Update UI to display numbers with comma separators"
  },
  "implementation_results": {
    "summary": "Successfully implemented number formatting across all specified components",
    "approach_used": "Extended existing formatNumber utility and applied across components",
    "changes_made": [
      {
        "file": "src/utils/formatters.js",
        "change_type": "modify",
        "lines_changed": 15,
        "description": "Enhanced formatNumber function to support all locale formats"
      },
      {
        "file": "src/components/Dashboard/ReviewCounter.jsx",
        "change_type": "modify",
        "lines_changed": 3,
        "description": "Applied formatNumber to review count display"
      },
      {
        "file": "src/components/Stats/RatingSummary.jsx",
        "change_type": "modify",
        "lines_changed": 5,
        "description": "Applied formatNumber to total reviews display"
      }
    ],
    "tests_added": [
      {
        "file": "tests/utils/formatters.test.js",
        "test_cases": [
          "formats 1000 with en-US locale correctly",
          "formats 1000 with de-DE locale correctly",
          "handles edge cases correctly"
        ]
      }
    ],
    "acceptance_criteria_verification": [
      {
        "id": "AC1",
        "status": "passed",
        "verification_method": "Unit tests and manual verification"
      },
      {
        "id": "AC2",
        "status": "passed",
        "verification_method": "Unit tests with multiple locales"
      }
    ]
  },
  "pull_request": {
    "url": "https://gitlab.com/company/project-x/-/merge_requests/123",
    "branch": "feature/PROJ-123-number-formatting",
    "status": "open"
  },
  "metadata": {
    "implementation_timestamp": "2023-10-22T09:15:30Z",
    "processing_time_ms": 5432
  }
}
```

## Error Response Format

```json
{
  "status": "error",
  "error": {
    "code": 400,
    "message": "Invalid Jira task key format",
    "details": "The provided Jira task key does not match the expected format"
  },
  "timestamp": "2023-10-22T08:15:30Z",
  "request_id": "req-12345-abcde"
}
```

## Warning Response Format

```json
{
  "status": "warning",
  "results": {
    "jira_task": {
      "key": "PROJ-123",
      "summary": "Update UI to display numbers with comma separators"
    },
    "structured_description": {
      "background": "Update the UI across the Kudosi app to display large numbers with comma separators for better readability.",
      "requirements": {
        "summary": "Apply number formatting to all numerical values where applicable.",
        "target_components": [
          "Number of imported reviews",
          "Average rating star",
          "Store growth visibility",
          "Number of published reviews",
          "Number of unpublished reviews"
        ]
      }
    }
  },
  "warnings": [
    {
      "type": "missing_section",
      "message": "Missing or incomplete edge cases section in task description",
      "severity": "low"
    },
    {
      "type": "gitlab_access",
      "message": "Could not access GitLab repository due to permission issues",
      "severity": "medium"
    }
  ],
  "timestamp": "2023-10-22T08:15:30Z",
  "request_id": "req-12345-abcde"
}
```

## Error Handling

KudosiMCP implements a robust error handling system that covers:

1. **Input Validation**

   - Jira task key validation
   - GitLab URL validation
   - Request parameter validation
   - Authentication validation

2. **External Service Errors**

   - Jira API unavailability
   - Confluence API issues
   - GitLab repository access problems
   - Connection timeouts
   - Unexpected response structures

3. **Processing Errors**

   - Task description parsing failures
   - Code analysis issues
   - Implementation generation errors
   - Test creation failures

4. **HTTP Error Codes**
   - 400 - Bad Request (invalid input)
   - 401 - Unauthorized (authentication required)
   - 403 - Forbidden (insufficient permissions)
   - 404 - Not Found (task or resource doesn't exist)
   - 500 - Internal Server Error (unexpected server issues)
   - 502 - Bad Gateway (issues with external services)
   - 503 - Service Unavailable (server temporarily unavailable)
   - 504 - Gateway Timeout (timed out connecting to external services)
