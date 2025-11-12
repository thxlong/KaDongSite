# 🚀 Quick Start Guide

## Bắt đầu nhanh trong 3 bước:

### 1. Cài đặt Dependencies

#### Frontend:
```bash
npm install
```

#### Backend:
```bash
cd backend
npm install
cd ..
```

### 2. Chạy Development Server

#### Cách 1: Chạy riêng lẻ (khuyến nghị)

**Terminal 1 - Frontend:**
```bash
npm run dev
```
➡️ Truy cập: http://localhost:3000

**Terminal 2 - Backend:**
```bash
cd backend
npm start
```
➡️ API: http://localhost:5000

#### Cách 2: Chạy với PowerShell (Windows)
```powershell
# Chạy backend trong background
Start-Process powershell -ArgumentList "cd backend; npm start"

# Chạy frontend
npm run dev
```

### 3. Kiểm tra

✅ Frontend: http://localhost:3000
✅ Backend API: http://localhost:5000/api/health

## 🎯 Các lệnh hữu ích

```bash
# Frontend
npm run dev          # Chạy dev server
npm run build        # Build production
npm run preview      # Preview build

# Backend
npm start            # Chạy server
npm run dev          # Chạy với nodemon (auto-reload)
```

## 🐛 Troubleshooting

### Lỗi: Port đã được sử dụng
```bash
# Windows - Kill process trên port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Backend - Thay đổi port trong backend/.env
PORT=5000
```

### Lỗi: Module not found
```bash
# Xóa node_modules và cài lại
rm -rf node_modules
npm install
```

### Lỗi: Tailwind không hoạt động
```bash
# Kiểm tra PostCSS và rebuild
npm run dev
```

## 📖 Tài liệu thêm

- [README.md](README.md) - Tài liệu đầy đủ
- Frontend: React + Vite + Tailwind
- Backend: Node.js + Express

## 💡 Tips

- Sử dụng 2 terminal để dễ debug
- Kiểm tra console browser (F12) nếu có lỗi
- Backend logs sẽ hiển thị mọi API request
- LocalStorage được dùng để lưu data tạm thời

---

**Happy Coding! 🎉**
