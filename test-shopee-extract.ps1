# Test Shopee URL Extraction
$url = "https://shopee.vn/%C4%90i%E1%BB%87n-tho%E1%BA%A1i-Apple-iPhone-17-Pro-Max-256GB-i.88201679.27041370670"

$body = @{
    url = $url
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/wishlist/extract-metadata" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

Write-Host "Response:"
$response | ConvertTo-Json -Depth 10
