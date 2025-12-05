#!/bin/bash

# LanguageBridge Deployment Script
# This script prepares and deploys your app to Vercel

echo "🚀 LanguageBridge Deployment Script"
echo "===================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git not initialized. Initializing..."
    git init
    git add .
    git commit -m "Initial commit - LanguageBridge"
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo ""
    echo "📝 Uncommitted changes found. Committing..."
    git add .
    git commit -m "Update: Ready for deployment"
    echo "✅ Changes committed"
else
    echo "✅ No uncommitted changes"
fi

# Test build
echo ""
echo "🔨 Testing production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo ""
    echo "⚠️  Vercel CLI not found."
    echo "Install it with: npm install -g vercel"
    echo ""
    echo "Or deploy manually:"
    echo "1. Push to GitHub: git push origin main"
    echo "2. Go to: https://vercel.com/new"
    echo "3. Import your repository"
    echo "4. Click Deploy"
    exit 0
fi

# Deploy to Vercel
echo ""
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo "Your app is now live!"
else
    echo "❌ Deployment failed. Check the errors above."
    exit 1
fi
