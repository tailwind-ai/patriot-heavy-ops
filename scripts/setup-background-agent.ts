#!/usr/bin/env tsx

/**
 * Setup script for Background Agent
 * 
 * This script helps configure the GitHub webhook and environment variables
 * needed for the background agent to monitor PRs and apply automated fixes.
 */

import { Octokit } from "@octokit/rest"
import { config } from "dotenv"
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

// Load environment variables
config()

const REPO_OWNER = "samuelhenry"
const REPO_NAME = "patriot-heavy-ops"
const WEBHOOK_URL = process.env.NEXT_PUBLIC_APP_URL + "/api/webhooks/github"

async function setupBackgroundAgent() {
  console.log("🤖 Setting up Background Agent for PR monitoring...")
  
  try {
    // Check required environment variables
    const requiredEnvVars = [
      "GITHUB_ACCESS_TOKEN",
      "NEXT_PUBLIC_APP_URL"
    ]
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    if (missingVars.length > 0) {
      console.error("❌ Missing required environment variables:")
      missingVars.forEach(varName => console.error(`  - ${varName}`))
      process.exit(1)
    }

    const octokit = new Octokit({
      auth: process.env.GITHUB_ACCESS_TOKEN,
    })

    // 1. Create GitHub webhook
    console.log("📡 Creating GitHub webhook...")
    await createWebhook(octokit)
    
    // 2. Generate webhook secret
    console.log("🔐 Generating webhook secret...")
    const webhookSecret = generateWebhookSecret()
    
    // 3. Update environment file
    console.log("📝 Updating environment configuration...")
    updateEnvironmentFile(webhookSecret)
    
    // 4. Test webhook connection
    console.log("🧪 Testing webhook connection...")
    await testWebhookConnection(octokit)
    
    console.log("✅ Background Agent setup complete!")
    console.log("\n📋 Next steps:")
    console.log("1. Add the webhook secret to your environment variables:")
    console.log(`   GITHUB_WEBHOOK_SECRET=${webhookSecret}`)
    console.log("2. Deploy your application to make the webhook accessible")
    console.log("3. Test by creating a PR to dev or main branch")
    
  } catch (error) {
    console.error("❌ Setup failed:", error)
    process.exit(1)
  }
}

async function createWebhook(octokit: Octokit) {
  try {
    // Check if webhook already exists
    const existingWebhooks = await octokit.rest.repos.listWebhooks({
      owner: REPO_OWNER,
      repo: REPO_NAME,
    })

    const existingWebhook = existingWebhooks.data.find(
      webhook => webhook.config.url === WEBHOOK_URL
    )

    if (existingWebhook) {
      console.log("✅ Webhook already exists")
      return
    }

    // Create new webhook
    await octokit.rest.repos.createWebhook({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      config: {
        url: WEBHOOK_URL,
        content_type: "json",
        secret: process.env.GITHUB_WEBHOOK_SECRET || "temporary-secret",
      },
      events: [
        "pull_request",
        "issue_comment",
        "check_run",
        "check_suite"
      ],
      active: true,
    })

    console.log("✅ Webhook created successfully")
  } catch (error) {
    console.error("❌ Failed to create webhook:", error)
    throw error
  }
}

function generateWebhookSecret(): string {
  const crypto = require("crypto") // eslint-disable-line @typescript-eslint/no-require-imports
  return crypto.randomBytes(32).toString("hex")
}

function updateEnvironmentFile(webhookSecret: string) {
  const envPath = join(process.cwd(), ".env.local")
  let envContent = ""
  
  try {
    envContent = readFileSync(envPath, "utf-8")
  } catch {
    // File doesn't exist, create it
    envContent = ""
  }

  // Add or update webhook secret
  const lines = envContent.split("\n")
  const secretLineIndex = lines.findIndex(line => line.startsWith("GITHUB_WEBHOOK_SECRET="))
  
  if (secretLineIndex >= 0) {
    lines[secretLineIndex] = `GITHUB_WEBHOOK_SECRET=${webhookSecret}`
  } else {
    lines.push(`GITHUB_WEBHOOK_SECRET=${webhookSecret}`)
  }

  // Add other required variables if not present
  const requiredVars = [
    "CURSOR_API_KEY=your_cursor_api_key_here",
    "VERCEL_API_TOKEN=your_vercel_api_token_here"
  ]

  requiredVars.forEach(varLine => {
    const varName = varLine.split("=")[0]
    const varIndex = lines.findIndex(line => line.startsWith(`${varName}=`))
    
    if (varIndex < 0) {
      lines.push(varLine)
    }
  })

  writeFileSync(envPath, lines.join("\n"))
  console.log("✅ Environment file updated")
}

async function testWebhookConnection(octokit: Octokit) {
  try {
    // Test API access
    await octokit.rest.repos.get({
      owner: REPO_OWNER,
      repo: REPO_NAME,
    })
    
    console.log("✅ GitHub API connection successful")
  } catch (error) {
    console.error("❌ GitHub API connection failed:", error)
    throw error
  }
}

// Run setup if called directly
if (require.main === module) {
  setupBackgroundAgent()
}

export { setupBackgroundAgent }
