#!/usr/bin/env tsx

/**
 * Test Tod Integration
 * Tests the Tod webhook server with mock Ana data
 */

import { AnalyzedFailure, AnaWebhookPayload } from "./tod-webhook-server"

// Mock Ana data based on real codebase scenarios
const mockFailures: AnalyzedFailure[] = [
  {
    id: "ci-12345-job-67890-1234567890",
    type: "ci_failure",
    content:
      "Fix TypeScript compilation error in components/user-auth-form.tsx:45",
    priority: "high",
    files: ["components/user-auth-form.tsx"],
    lineNumbers: [45, 67],
    rootCause: "Missing interface definition for UserData type",
    impact: "Blocks user authentication flow and prevents build",
    suggestedFix:
      "Add UserData interface to types/user.ts with required fields",
    affectedComponents: ["Authentication", "User Management"],
    relatedPR: "#279",
    createdAt: new Date().toISOString(),
  },
  {
    id: "vercel-98765-deploy-4321",
    type: "vercel_failure",
    content: "Fix Vercel deployment build failure in CI pipeline",
    priority: "critical",
    files: [".github/workflows/ci.yml"],
    lineNumbers: [141],
    rootCause: "Missing VERCEL_API_TOKEN environment variable",
    impact: "Prevents deployment to production after successful CI tests",
    suggestedFix: "Add VERCEL_API_TOKEN to GitHub repository secrets",
    affectedComponents: ["Deployment", "CI/CD"],
    relatedPR: "#284",
    createdAt: new Date().toISOString(),
  },
  {
    id: "bugbot-comment-5555",
    type: "bugbot_issue",
    content: "Address code quality issues in service-request-service.ts",
    priority: "medium",
    files: ["lib/services/service-request-service.ts"],
    lineNumbers: [186, 187, 188],
    rootCause: "Excessive use of non-null assertions (!)",
    impact: "Reduces code safety and may cause runtime errors",
    suggestedFix:
      "Replace non-null assertions with proper null checks and error handling",
    affectedComponents: ["Service Layer", "Data Validation"],
    relatedPR: "#280",
    createdAt: new Date().toISOString(),
  },
]

const mockPayload: AnaWebhookPayload = {
  summary:
    "CI Test workflow failed with 3 issues: 1 TypeScript error, 1 deployment failure, 1 code quality issue",
  analysisDate: new Date().toISOString(),
  workflowRunId: "12345678",
  prNumber: 284,
  failures: mockFailures,
}

async function testTodWebhook(): Promise<void> {
  const TOD_WEBHOOK_URL = "http://localhost:3001"

  console.log("🧪 Testing Tod Webhook Integration")
  console.log(`   Target: ${TOD_WEBHOOK_URL}`)
  console.log(`   Failures: ${mockFailures.length}`)

  try {
    // Test health check
    console.log("\n1️⃣ Testing health check...")
    const healthResponse = await fetch(`${TOD_WEBHOOK_URL}/health`)

    if (!healthResponse.ok) {
      throw new Error(`Health check failed: ${healthResponse.status}`)
    }

    const healthData = await healthResponse.json()
    console.log(`   ✅ Health check passed: ${healthData.status}`)

    // Test Ana webhook endpoint
    console.log("\n2️⃣ Testing Ana webhook endpoint...")
    const webhookResponse = await fetch(
      `${TOD_WEBHOOK_URL}/webhook/ana-failures`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Ana-Signature": "test-signature",
          "X-Ana-Timestamp": new Date().toISOString(),
        },
        body: JSON.stringify(mockPayload),
      }
    )

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text()
      throw new Error(
        `Webhook failed: ${webhookResponse.status} - ${errorText}`
      )
    }

    const webhookData = await webhookResponse.json()
    console.log(`   ✅ Webhook processed successfully`)
    console.log(`   📋 TODOs created: ${webhookData.todosCreated}`)

    // Test individual TODO creation
    console.log("\n3️⃣ Testing individual TODO creation...")
    const testResponse = await fetch(`${TOD_WEBHOOK_URL}/test/create-todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mockFailures[0]),
    })

    if (!testResponse.ok) {
      const errorText = await testResponse.text()
      throw new Error(`Test TODO failed: ${testResponse.status} - ${errorText}`)
    }

    const testData = await testResponse.json()
    console.log(
      `   ✅ Test TODO created: ${testData.todos[0].content.substring(
        0,
        50
      )}...`
    )

    console.log("\n🎉 All tests passed! Tod webhook integration is working.")
  } catch (error) {
    console.error("\n❌ Test failed:", error)
    console.log("\n💡 Make sure Tod webhook server is running:")
    console.log("   npm run tod:webhook")
    process.exit(1)
  }
}

async function main(): Promise<void> {
  await testTodWebhook()
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Fatal error:", error)
    process.exit(1)
  })
}

export { mockFailures, mockPayload, testTodWebhook }
