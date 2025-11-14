# Scripts Directory

Thư mục chứa các script tự động hóa cho dự án KaDongSite.

## 📁 Available Scripts

### Testing Scripts

#### `test-wishlist.ps1`
**Mô tả**: Chạy toàn bộ test suite cho Wishlist feature  
**Yêu cầu**: Node.js, npm, Jest, Playwright  
**Sử dụng**:
```powershell
.\scripts\test-wishlist.ps1
```

**Chức năng**:
- ✅ Kiểm tra prerequisites (Node.js, npm)
- ✅ Chạy backend integration tests (Jest)
- ✅ Kiểm tra backend/frontend servers
- ✅ Chạy frontend E2E tests (Playwright) nếu servers đang chạy
- ✅ Hiển thị test summary chi tiết

**Output**:
```
==================================
  WISHLIST FEATURE TEST SUITE
==================================

[1/5] Checking prerequisites...
✅ Prerequisites OK

[2/5] Running Backend Integration Tests (Jest)...
✅ Backend tests PASSED

[3/5] Checking if servers are running...
✅ Backend server is running on port 5000
✅ Frontend server is running on port 5173

[4/5] Running Frontend E2E Tests (Playwright)...
✅ E2E tests PASSED

[5/5] Test Summary
==================================

Backend Integration Tests:
  ✅ 35 tests passed
  ⏭️  2 tests skipped
  📁 File: backend/tests/wishlist.test.js

Frontend E2E Tests:
  ✅ All tests passed
  📁 File: frontend/tests/e2e/wishlist.e2e.spec.js

🎉 All tests completed successfully!
```

---

## 🚀 Quick Start

### Chạy Wishlist Tests

```powershell
# Option 1: Chỉ chạy backend tests (không cần servers)
cd backend
NODE_OPTIONS="--experimental-vm-modules" npx jest tests/wishlist.test.js

# Option 2: Chạy cả backend và E2E tests (cần servers)
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev

# Terminal 3
.\scripts\test-wishlist.ps1
```

---

## 📝 Script Development Guidelines

Khi tạo script mới, vui lòng:

1. **Đặt tên rõ ràng**: `action-feature.ps1` (vd: `test-wishlist.ps1`, `deploy-backend.ps1`)

2. **Thêm header mô tả**:
```powershell
# Script Name
# Description: What this script does
# Usage: How to run it
```

3. **Kiểm tra prerequisites**:
```powershell
if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
    exit 1
}
```

4. **Sử dụng màu sắc**:
- 🟢 Green: Success
- 🔴 Red: Error
- 🟡 Yellow: Warning/Info
- 🔵 Cyan: Headers
- ⚪ Gray: Details

5. **Exit codes**:
- `0`: Success
- `1`: Error

6. **Error handling**:
```powershell
try {
    # Code
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    exit 1
}
```

7. **Progress indicators**:
```powershell
Write-Host "[1/5] Step description..." -ForegroundColor Yellow
```

8. **Update README.md**: Thêm script mới vào danh sách trên

---

## 🔗 Related Documentation

- [Wishlist Bug Fix Summary](../docs/04-features/WISHLIST_BUGFIX_SUMMARY.md)
- [Wishlist Testing Quick Reference](../docs/04-features/WISHLIST_TESTING_QUICKREF.md)
- [Testing Guide](../docs/03-development/TESTING_GUIDE.md)

---

**Last Updated**: 14/11/2025  
**Maintainer**: KaDong Team
