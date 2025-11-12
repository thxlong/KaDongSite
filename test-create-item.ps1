# Test Create Wishlist Item API
$body = @{
    user_id = "a0000000-0000-4000-8000-000000000001"
    product_url = "https://shopee.vn/test"
    product_name = "Test Product"
    price = 100000
    currency = "VND"
} | ConvertTo-Json

Write-Host "Testing create wishlist item..."
Write-Host "Body:" $body
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/wishlist" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body
    
    Write-Host "✅ Success!"
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Error!"
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails.Message) {
        Write-Host "Details:" $_.ErrorDetails.Message
    }
}
