#!/bin/bash

# Auto-approve pending GitHub Actions workflows
# Usage: ./scripts/auto-approve-workflows.sh [repo-owner/repo-name]

REPO=${1:-"samuelhenry/patriot-heavy-ops"}

echo "🔍 Checking for workflows awaiting approval in $REPO..."

# Get workflows that are waiting for approval
WAITING_RUNS=$(gh run list --repo "$REPO" --status waiting --json databaseId,workflowName,headBranch --limit 10)

if [ "$WAITING_RUNS" = "[]" ]; then
    echo "✅ No workflows awaiting approval"
    exit 0
fi

echo "📋 Found workflows awaiting approval:"
echo "$WAITING_RUNS" | jq -r '.[] | "- \(.workflowName) (\(.headBranch)) - ID: \(.databaseId)"'

# Approve each waiting workflow
echo "$WAITING_RUNS" | jq -r '.[].databaseId' | while read -r run_id; do
    echo "✅ Approving workflow run $run_id..."
    
    # Note: GitHub CLI doesn't have direct approve command, but we can use API
    gh api --method POST "repos/$REPO/actions/runs/$run_id/approve" \
        && echo "   ✅ Approved run $run_id" \
        || echo "   ❌ Failed to approve run $run_id"
done

echo "🎉 Auto-approval complete!"
