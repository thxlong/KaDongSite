@echo off
REM Test Shopee URL Extraction API Endpoint
REM Using curl to avoid PowerShell issues

echo Testing Shopee URL Extraction API...
echo.

curl -X POST http://localhost:5000/api/wishlist/extract-metadata ^
  -H "Content-Type: application/json" ^
  -d "{\"url\":\"https://shopee.vn/product/337138040/40512542180?\"}"

echo.
echo.
echo Test completed!
