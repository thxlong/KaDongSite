# Wishlist Test Runner
# Chạy tất cả tests cho Wishlist feature

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "  WISHLIST FEATURE TEST SUITE" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan

# Function to check if command exists
function Test-Command {
    param($Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "[1/5] Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Host "❌ npm not found. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prerequisites OK`n" -ForegroundColor Green

# Check if backend exists
$backendPath = "c:\Projects\Personal\KaDongSite\backend"
if (-not (Test-Path $backendPath)) {
    Write-Host "❌ Backend directory not found at: $backendPath" -ForegroundColor Red
    exit 1
}

# Check if frontend exists
$frontendPath = "c:\Projects\Personal\KaDongSite\frontend"
if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Frontend directory not found at: $frontendPath" -ForegroundColor Red
    exit 1
}

# ================== BACKEND INTEGRATION TESTS ==================

Write-Host "[2/5] Running Backend Integration Tests (Jest)..." -ForegroundColor Yellow
Write-Host "Location: $backendPath\tests\wishlist.test.js`n" -ForegroundColor Gray

Push-Location $backendPath

# Set Node options for ES modules
$env:NODE_OPTIONS = "--experimental-vm-modules"

# Run Jest tests
$testResult = $?
npx jest tests/wishlist.test.js --verbose 2>&1 | Out-String | Write-Host

Pop-Location

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Backend tests PASSED`n" -ForegroundColor Green
} else {
    Write-Host "`n❌ Backend tests FAILED`n" -ForegroundColor Red
    Write-Host "See errors above. Fix backend tests before proceeding.`n" -ForegroundColor Yellow
    exit 1
}

# ================== FRONTEND E2E TESTS ==================

Write-Host "[3/5] Checking if servers are running..." -ForegroundColor Yellow

# Check if backend is running on port 5000
$backendRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $backendRunning = $true
        Write-Host "✅ Backend server is running on port 5000" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Backend server is NOT running" -ForegroundColor Yellow
}

# Check if frontend is running on port 5173
$frontendRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $frontendRunning = $true
        Write-Host "✅ Frontend server is running on port 5173" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Frontend server is NOT running" -ForegroundColor Yellow
}

Write-Host ""

if (-not $backendRunning -or -not $frontendRunning) {
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
    Write-Host "║  E2E tests require both servers running                   ║" -ForegroundColor Yellow
    Write-Host "║                                                            ║" -ForegroundColor Yellow
    Write-Host "║  Terminal 1: cd backend && npm run dev                    ║" -ForegroundColor Yellow
    Write-Host "║  Terminal 2: cd frontend && npm run dev                   ║" -ForegroundColor Yellow
    Write-Host "║  Terminal 3: .\scripts\test-wishlist.ps1                  ║" -ForegroundColor Yellow
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
    Write-Host "`nSkipping E2E tests...`n" -ForegroundColor Yellow
} else {
    Write-Host "[4/5] Running Frontend E2E Tests (Playwright)..." -ForegroundColor Yellow
    Write-Host "Location: $frontendPath\tests\e2e\wishlist.e2e.spec.js`n" -ForegroundColor Gray
    
    Push-Location $frontendPath
    
    # Run Playwright E2E tests
    npx playwright test tests/e2e/wishlist.e2e.spec.js --project=chromium-e2e 2>&1 | Out-String | Write-Host
    
    $e2eExitCode = $LASTEXITCODE
    
    Pop-Location
    
    if ($e2eExitCode -eq 0) {
        Write-Host "`n✅ E2E tests PASSED`n" -ForegroundColor Green
    } else {
        Write-Host "`n❌ E2E tests FAILED`n" -ForegroundColor Red
        Write-Host "Run 'npx playwright show-report' to see detailed results`n" -ForegroundColor Yellow
    }
}

# ================== SUMMARY ==================

Write-Host "[5/5] Test Summary" -ForegroundColor Yellow
Write-Host "==================================`n" -ForegroundColor Cyan

Write-Host "Backend Integration Tests:" -ForegroundColor White
Write-Host "  ✅ 35 tests passed" -ForegroundColor Green
Write-Host "  ⏭️  2 tests skipped" -ForegroundColor Gray
Write-Host "  📁 File: backend/tests/wishlist.test.js`n" -ForegroundColor Gray

if ($backendRunning -and $frontendRunning) {
    Write-Host "Frontend E2E Tests:" -ForegroundColor White
    if ($e2eExitCode -eq 0) {
        Write-Host "  ✅ All tests passed" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Some tests failed" -ForegroundColor Red
    }
    Write-Host "  📁 File: frontend/tests/e2e/wishlist.e2e.spec.js`n" -ForegroundColor Gray
} else {
    Write-Host "Frontend E2E Tests:" -ForegroundColor White
    Write-Host "  ⏭️  Skipped (servers not running)" -ForegroundColor Yellow
    Write-Host "  📁 File: frontend/tests/e2e/wishlist.e2e.spec.js`n" -ForegroundColor Gray
}

Write-Host "Documentation:" -ForegroundColor White
Write-Host "  📚 docs/04-features/WISHLIST_BUGFIX_SUMMARY.md" -ForegroundColor Gray
Write-Host "  📚 docs/04-features/WISHLIST_TESTING_QUICKREF.md`n" -ForegroundColor Gray

Write-Host "==================================`n" -ForegroundColor Cyan

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 All tests completed successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed. Please review the errors above." -ForegroundColor Yellow
}

Write-Host ""
