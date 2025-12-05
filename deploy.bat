@echo off
REM LanguageBridge Deployment Script for Windows
REM This script prepares and deploys your app to Vercel

echo.
echo ========================================
echo   LanguageBridge Deployment Script
echo ========================================
echo.

REM Check if git is initialized
if not exist .git (
    echo Git not initialized. Initializing...
    git init
    git add .
    git commit -m "Initial commit - LanguageBridge"
    echo Git initialized successfully!
) else (
    echo Git already initialized
)

REM Check for uncommitted changes
git status --short > nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo Committing changes...
    git add .
    git commit -m "Update: Ready for deployment"
    echo Changes committed successfully!
)

REM Test build
echo.
echo Testing production build...
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo Build failed! Please fix errors before deploying.
    pause
    exit /b 1
)

echo.
echo Build successful!
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo Vercel CLI not found.
    echo.
    echo Install it with: npm install -g vercel
    echo.
    echo Or deploy manually:
    echo 1. Push to GitHub: git push origin main
    echo 2. Go to: https://vercel.com/new
    echo 3. Import your repository
    echo 4. Click Deploy
    echo.
    pause
    exit /b 0
)

REM Deploy to Vercel
echo.
echo Deploying to Vercel...
call vercel --prod

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Deployment successful!
    echo   Your app is now live!
    echo ========================================
    echo.
) else (
    echo.
    echo Deployment failed. Check the errors above.
    pause
    exit /b 1
)

pause
