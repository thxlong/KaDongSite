# 🌸 KaDong Tools - Website Tiện Ích Cá Nhân

Website tiện ích cá nhân dễ thương với thiết kế hiện đại, dành cho hai vợ chồng dễ dàng truy cập và sử dụng các công cụ hàng ngày.

## ✨ Tính năng

### 🎯 Các công cụ hiện có:

- **⏰ Đếm ngày**: Theo dõi kỷ niệm và đếm ngược sự kiện đặc biệt
- **📅 Lịch**: Xem lịch trình và sự kiện sắp tới
- **📝 Ghi chú**: Lưu ý tưởng và việc cần làm với màu sắc tùy chỉnh
- **💱 Chuyển đổi tiền tệ**: Tính toán và chuyển đổi 8 loại tiền tệ phổ biến
- **👔 Phối đồ màu sắc**: Chọn và lưu trang phục với preview realtime

### 🎨 Đặc điểm thiết kế:

- ✅ Giao diện pastel dễ thương, tươi mới
- ✅ Responsive hoàn hảo trên mọi thiết bị
- ✅ Animation mượt mà với Framer Motion
- ✅ Accessibility tốt (ARIA labels, focus states)
- ✅ Dễ mở rộng - thêm công cụ mới dễ dàng

## 🚀 Công nghệ sử dụng

### Frontend:
- **React 18** - UI Framework
- **Vite** - Build tool siêu nhanh
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **React Router** - Điều hướng
- **Lucide React** - Icon library
- **date-fns** - Date manipulation

### Backend:
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **RESTful API** - API architecture
- **CORS** - Cross-origin resource sharing

## 📦 Cài đặt

### Yêu cầu:
- Node.js 18+ 
- npm hoặc yarn

### 1️⃣ Clone repository:
```bash
cd c:\Projects\Personal\KaDongSite
```

### 2️⃣ Cài đặt Frontend:
```bash
# Cài đặt dependencies
npm install
```

### 3️⃣ Cài đặt Backend:
```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Quay về thư mục gốc
cd ..
```

## 🎮 Chạy dự án

### Chạy Frontend (Development):
```bash
# Mở terminal mới
npm run dev
```
Frontend sẽ chạy tại: **http://localhost:3000**

### Chạy Backend:
```bash
# Mở terminal mới
cd backend
npm start
```
Backend API sẽ chạy tại: **http://localhost:5000**

### Chạy cả hai cùng lúc:
Mở 2 terminal riêng biệt:
- Terminal 1: `npm run dev` (frontend)
- Terminal 2: `cd backend && npm start` (backend)

## 📁 Cấu trúc dự án

```
KaDongSite/
├── 📂 src/                      # Frontend source
│   ├── 📂 components/           # React components
│   │   ├── Header.jsx
│   │   ├── SidebarMenu.jsx
│   │   ├── Footer.jsx
│   │   └── ToolCard.jsx
│   ├── 📂 pages/                # Pages/Tools
│   │   ├── Home.jsx
│   │   ├── CountdownTool.jsx
│   │   ├── CalendarTool.jsx
│   │   ├── NotesTool.jsx
│   │   └── CurrencyTool.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── 📂 backend/                  # Backend API
│   ├── 📂 routes/               # API routes
│   ├── 📂 controllers/          # Business logic
│   ├── 📂 models/               # Data models
│   ├── app.js                   # Express app
│   └── .env                     # Environment variables
│
├── 📂 public/                   # Static assets
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## �️ Database Setup

### PostgreSQL Installation:
1. Install PostgreSQL 18 or higher
2. Create database:
```bash
psql -U postgres
CREATE DATABASE kadong_tools;
```

3. Run migrations:
```bash
cd backend
psql -U postgres -d kadong_tools -f database/migrations/001_up_initial_schema.sql
psql -U postgres -d kadong_tools -f database/migrations/002_up_fashion_outfits.sql
```

4. Seed test user:
```bash
psql -U postgres -d kadong_tools -f database/seeds/001_test_user.sql
```

### Database Connection:
Edit `backend/config/database.js` with your credentials:
```javascript
const pool = new Pool({
  user: 'postgres',
  password: 'your_password',
  host: 'localhost',
  port: 5432,
  database: 'kadong_tools'
})
```

## 📦 Data Migration from localStorage

If you have existing data in browser localStorage, migrate it to the database:

### Step 1: Export localStorage data
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run this command:
```javascript
console.log(JSON.stringify({
  notes: JSON.parse(localStorage.getItem('notes') || '[]'),
  countdowns: JSON.parse(localStorage.getItem('countdowns') || '[]')
}))
```
4. Copy the output

### Step 2: Save data
Create `backend/scripts/data.json` and paste the copied data

### Step 3: Run migration script
```bash
cd backend
node scripts/migrate-localStorage.js
```

The script will:
- Check for duplicates (skip existing records)
- Migrate notes to `notes` table
- Migrate countdowns to `countdown_events` table
- Show detailed migration report

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api`

**Note**: All endpoints require `user_id` parameter (query string for GET, body for POST/PUT/DELETE). Default test user: `00000000-0000-0000-0000-000000000001`

#### 📌 Notes
- `GET /notes?user_id={uuid}` - Get all notes for user
- `GET /notes/:id?user_id={uuid}` - Get specific note
- `POST /notes` - Create new note
  ```json
  {
    "user_id": "00000000-0000-0000-0000-000000000001",
    "title": "My Note",
    "content": "Note content",
    "color": "pink",
    "pinned": false
  }
  ```
- `PUT /notes/:id` - Update note (same body as POST)
- `DELETE /notes/:id?user_id={uuid}` - Soft delete note

#### 📌 Events (Countdowns)
- `GET /events?user_id={uuid}` - Get all events for user
- `GET /events/:id?user_id={uuid}` - Get specific event
- `POST /events` - Create new event
  ```json
  {
    "user_id": "00000000-0000-0000-0000-000000000001",
    "title": "Anniversary",
    "date": "2024-12-31",
    "color": "from-pastel-pink to-pastel-purple",
    "recurring": null
  }
  ```
- `PUT /events/:id` - Update event (same body as POST)
- `DELETE /events/:id?user_id={uuid}` - Soft delete event

#### 📌 Fashion Outfits
- `GET /fashion?user_id={uuid}` - Get all outfits
- `GET /fashion/:id?user_id={uuid}` - Get specific outfit
- `POST /fashion` - Create outfit
  ```json
  {
    "user_id": "00000000-0000-0000-0000-000000000001",
    "name": "Summer Look",
    "shirtColor": "yellow",
    "pantsColor": "blue",
    "shoesColor": "white",
    "hatColor": "beige",
    "bagColor": "brown"
  }
  ```
- `PUT /fashion/:id` - Update outfit
- `DELETE /fashion/:id?user_id={uuid}` - Soft delete outfit

## 🎨 Tùy chỉnh

### Thay đổi màu sắc:
Chỉnh sửa `tailwind.config.js`:
```javascript
colors: {
  pastel: {
    pink: '#FFD6E8',
    purple: '#E6D5F7',
    mint: '#C8F4E3',
    // ... thêm màu mới
  }
}
```

### Thêm công cụ mới:
1. Tạo component mới trong `src/pages/`
2. Thêm route trong `src/App.jsx`
3. Thêm menu item trong `src/components/SidebarMenu.jsx`

## 🔧 Build cho Production

### Build Frontend:
```bash
npm run build
```
Files sẽ được tạo trong thư mục `dist/`

### Deploy:
- Frontend: Netlify, Vercel, GitHub Pages
- Backend: Heroku, Railway, Render

## 🌟 Tính năng mở rộng trong tương lai

- [ ] Tích hợp database (MongoDB/PostgreSQL)
- [ ] Authentication (đăng nhập)
- [ ] Thêm công cụ: To-do list, Weather, Timer
- [ ] Dark mode
- [ ] Export/Import data
- [ ] PWA (Progressive Web App)
- [ ] Notification system
- [ ] Multi-language support

## 📝 License

MIT License - Dự án cá nhân, sử dụng tự do!

## 💝 Made with Love

Được tạo ra với ❤️ cho Ka & Dong

---

### 📞 Liên hệ
- Email: contact@kadong.com
- GitHub: [Your GitHub]

### 🙏 Credits
- Icons: Lucide React
- Fonts: Google Fonts (Nunito, Poppins)
- Animation: Framer Motion

---

**Happy Coding! 🎉**
