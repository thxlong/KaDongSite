# Wedding Invitation URL Encoder - User Guide

## 📋 Tổng quan

Wedding Invitation URL Encoder là công cụ giúp bạn tạo links thiệp cưới cá nhân hóa cho từng khách mời. Công cụ tự động encode tên tiếng Việt có dấu thành URL an toàn, hỗ trợ nhập hàng trăm tên cùng lúc.

## 🎯 Tính năng chính

### 1. Lưu Base URL
- Nhập URL thiệp cưới gốc (ví dụ: `https://invitations.jmiiwedding.com/longnhiwedding`)
- URL được lưu tự động, không cần nhập lại mỗi lần sử dụng
- Hiển thị thời gian cập nhật lần cuối

### 2. Nhập Danh Sách Khách
**Cách 1: Nhập văn bản**
- Dán danh sách tên vào textarea
- Hỗ trợ nhiều cách phân cách:
  - Dấu phẩy: `Bà Ngoại, Cậu Năm, Dì Hai`
  - Chấm phẩy: `Bà Ngoại; Cậu Năm; Dì Hai`
  - Xuống dòng:
    ```
    Bà Ngoại
    Cậu Năm
    Dì Hai
    ```

**Cách 2: Upload file**
- Hỗ trợ định dạng: `.txt`, `.csv`, `.xlsx`
- File TXT: mỗi dòng 1 tên
- File CSV: cột đầu tiên là tên khách
- File Excel: cột A (sheet đầu tiên) là tên khách
- Giới hạn: tối đa 2MB

### 3. Tạo Links
- Nhấn nút "Tạo Links" để generate URL cho từng khách
- Tự động loại bỏ tên trùng lặp (không phân biệt hoa/thường)
- Tên tiếng Việt có dấu được encode chính xác:
  - `Bà Ngoại` → `B%C3%A0%20Ngo%E1%BA%A1i`
  - `Cậu Năm + Dì` → `C%E1%BA%ADu%20N%C4%83m%20%2B%20D%C3%AC`

### 4. Copy Links
- **Copy từng link**: Click nút "Copy" bên cạnh mỗi URL
- **Copy tất cả**: Click nút "Copy tất cả" để copy toàn bộ danh sách
- Hiển thị thông báo xác nhận khi copy thành công

### 5. Export File
- Export ra file `.txt`: danh sách URLs (mỗi link 1 dòng)
- Export ra file `.csv`: bảng 2 cột (Tên khách, URL)
- Tên file tự động: `wedding-invitation-links-YYYY-MM-DD.txt`

### 6. QR Code Generation ⭐ NEW
- **Hiển thị QR code**: Click nút "QR" bên cạnh mỗi URL
- **Download QR code**: Click "Tải QR Code" để tải về dạng PNG
- QR code chất lượng cao, có tên khách ở dưới
- File PNG: `qr-code-{tên-khách}.png`
- Kích thước: 180x180px (có thể scan dễ dàng)
- Dùng để in sticker, name card, hoặc gửi qua Zalo/Facebook

## 📖 Hướng dẫn sử dụng

### Bước 1: Nhập Base URL
```
1. Vào trang Wedding Invitation Tool
2. Nhập URL thiệp cưới vào ô "Base URL Thiệp Cưới"
   Ví dụ: https://invitations.jmiiwedding.com/longnhiwedding
3. Click nút "Lưu URL"
4. Thấy thông báo "✅ Đã lưu URL thiệp cưới"
```

### Bước 2: Nhập Danh Sách Khách

**Option A: Nhập văn bản**
```
1. Vào ô "Danh Sách Khách Mời"
2. Dán danh sách tên (phân cách bằng dấu phẩy, chấm phẩy hoặc xuống dòng)
   Ví dụ:
   Bà Ngoại + Cậu Năm
   GD Em Phong Vân
   GĐ Em Sang Bình
3. Click nút "Tạo Links"
```

**Option B: Upload file Excel**
```
1. Chuẩn bị file Excel:
   - Mở Excel
   - Cột A: nhập danh sách tên khách
   - Lưu file (ví dụ: danh-sach-khach.xlsx)
2. Click nút "Chọn File"
3. Chọn file Excel
4. Đợi thông báo "✅ Đã đọc X tên từ file"
5. Click nút "Tạo Links"
```

### Bước 3: Copy Links
```
1. Xem danh sách URLs đã tạo
2. Click "Copy tất cả" để copy toàn bộ
3. Hoặc click "Copy" bên cạnh mỗi link để copy riêng lẻ
4. Thấy thông báo "✅ Đã copy X links vào clipboard"
5. Paste vào Excel/Word/Facebook để gửi cho khách
```

### Bước 4: Download QR Code (Optional) ⭐ NEW
```
1. Click nút "QR" bên cạnh URL bất kỳ
2. QR code xuất hiện với tên khách
3. Click "Tải QR Code" để download PNG
4. File PNG tự động lưu: qr-code-{tên-khách}.png
5. Dùng QR code để:
   - In sticker dán thiệp giấy
   - In name card cho bàn tiệc
   - Gửi qua Zalo/Facebook/Email
   - Khách quét QR code → mở thiệp online ngay
```

## ✨ Tips & Tricks

### 1. Tối ưu workflow
- Lưu base URL 1 lần, không cần nhập lại
- Chuẩn bị danh sách khách trong Excel trước
- Upload file Excel cho nhanh (thay vì nhập tay)
- Copy tất cả 1 lần, paste vào Excel để quản lý

### 2. Xử lý tên đặc biệt
- Tên có dấu `+`: OK ✅ (Bà Ngoại + Cậu Năm)
- Tên có ký tự đặc biệt: OK ✅ (&, /, :)
- Tên có emoji: OK ✅ (❤️ Gia đình)
- Tên rất dài (>100 ký tự): Cảnh báo ⚠️

### 3. Kiểm tra links
- Hover chuột vào link để preview tên đã encode
- Click vào link để mở thiệp cưới và test
- Verify tên hiển thị đúng trên thiệp

### 4. Backup danh sách
- Export ra CSV để lưu trữ
- File CSV có thể mở lại bằng Excel
- Dễ dàng check lại hoặc sửa tên

### 5. Sử dụng QR Code hiệu quả ⭐ NEW
- **In thiệp giấy**: Download QR code, in sticker dán lên thiệp
- **Name card bàn tiệc**: In QR code cho mỗi bàn
- **Gửi online**: Gửi QR code qua Zalo/Messenger thay vì link dài
- **Kích thước in**: QR code 180x180px phù hợp cho in 3x3cm đến 5x5cm
- **Kiểm tra**: Scan QR code bằng điện thoại để test trước khi in

## ❓ Câu hỏi thường gặp (FAQ)

### Q: Base URL là gì?
**A:** Base URL là địa chỉ thiệp cưới online của bạn, trước phần `?name=`. 
Ví dụ: `https://invitations.jmiiwedding.com/longnhiwedding`

### Q: Có giới hạn số lượng khách không?
**A:** Không có giới hạn cứng. Công cụ hỗ trợ 1000+ tên. Nếu quá nhiều (>500), sẽ có warning về performance.

### Q: File Excel phải định dạng như thế nào?
**A:** 
- Sheet đầu tiên sẽ được đọc
- Cột A (cột đầu tiên) chứa tên khách
- Các cột khác bị bỏ qua
- Dòng đầu tiên có thể là header hoặc tên khách đều được

### Q: Tại sao tên bị encode lạ?
**A:** Đó là UTF-8 percent encoding, chuẩn của URLs. Khi thiệp cưới nhận được, nó sẽ tự động decode về tên gốc. Ví dụ:
- `B%C3%A0` → `Bà`
- `%20` → khoảng trắng
- `%2B` → dấu `+`

### Q: Copy không hoạt động?
**A:** 
- Đảm bảo dùng browser hiện đại (Chrome, Firefox, Edge)
- HTTPS hoặc localhost (clipboard API chỉ hoạt động trên secure context)
- Thử reload trang nếu vẫn lỗi

### Q: Có thể sửa tên sau khi tạo link không?
**A:**
- Không thể sửa trực tiếp
- Cách 1: Xóa và nhập lại danh sách mới
- Cách 2: Export CSV, sửa trong Excel, upload lại

### Q: Có lưu lịch sử không?
**A:** Hiện tại chỉ lưu base URL mới nhất. Danh sách tên không được lưu (privacy).

### Q: QR code có hoạt động không? ⭐ NEW
**A:** Có! QR code được test với:
- iPhone (Camera app)
- Android (Google Lens, Camera)
- Zalo QR Scanner
- Facebook Messenger Scanner
QR code sử dụng error correction level H (cao nhất), hoạt động ngay cả khi bị mờ/hư hỏng 30%.

### Q: Tại sao cần QR code khi đã có link?
**A:** QR code tiện lợi hơn vì:
- Khách quét là mở thiệp ngay, không cần gõ/copy link
- In QR lên thiệp giấy/name card trông professional
- Gửi qua Zalo/Facebook gọn gàng hơn link dài
- Người lớn tuổi dễ dùng (quét QR) hơn click link

## 🛠️ Troubleshooting

### Lỗi: "URL phải bắt đầu bằng http:// hoặc https://"
**Nguyên nhân:** URL không đúng format  
**Giải pháp:** Thêm `https://` vào đầu URL

### Lỗi: "File quá lớn"
**Nguyên nhân:** File > 2MB  
**Giải pháp:** 
- Xóa các cột/sheet không cần thiết trong Excel
- Hoặc chia nhỏ file thành nhiều file < 2MB

### Lỗi: "Không thể đọc file Excel"
**Nguyên nhân:** File bị lỗi hoặc định dạng không hỗ trợ  
**Giải pháp:**
- Mở file bằng Excel, Save As → `.xlsx` format
- Hoặc export sang `.csv` rồi upload

### Không thấy menu "Wedding Invitation"
**Nguyên nhân:** Cache browser cũ  
**Giải pháp:** 
- Reload trang (Ctrl+R hoặc Cmd+R)
- Hard reload (Ctrl+Shift+R)

## 📞 Hỗ trợ

Nếu gặp vấn đề hoặc có câu hỏi:
1. Kiểm tra phần FAQ ở trên
2. Reload trang và thử lại
3. Liên hệ team KaDong qua Feedback form

## 🔒 Privacy & Security

- **Dữ liệu không được chia sẻ:** Danh sách tên chỉ tồn tại trên máy bạn
- **Base URL được lưu:** Chỉ base URL được lưu vào database (không có tên khách)
- **File upload:** File được parse trên trình duyệt, không upload lên server
- **HTTPS:** Tất cả API calls được mã hóa

## 📈 Updates & Changelog

### Version 1.0.0 (2025-11-12)
- ✨ Tính năng đầu tiên: Wedding Invitation URL Encoder
- 🎨 UI/UX: Giao diện đơn giản, dễ sử dụng
- 📁 Hỗ trợ: TXT, CSV, Excel file upload
- 📋 Copy: One-click copy tất cả links
- 💾 Lưu trữ: Base URL persistence

---

**Chúc bạn có một đám cưới hạnh phúc! 🎉💒❤️**
