#!/bin/bash

# Pre-commit validation script per .cursorrules.md standards
# This script runs TypeScript and ESLint checks before allowing commits

set -e

echo "🔍 Running pre-commit validation..."

# TypeScript type checking
echo "📝 Checking TypeScript types..."
npx tsc --noEmit

# ESLint checking
echo "🔧 Running ESLint..."
npx eslint . --quiet

echo "✅ Pre-commit validation passed!"
