# 🌸 KaDong Tools - Website Tiện Ích Cá Nhân

**Version:** 1.3.0  
**Last Updated:** 2025-11-11

Website tiện ích cá nhân dễ thương với thiết kế hiện đại, dành cho hai vợ chồng dễ dàng truy cập và sử dụng các công cụ hàng ngày. Full-stack application với React + Node.js + PostgreSQL.

## ✨ Tính năng

### 🎯 Các công cụ hiện có:

- **⏰ Đếm ngày**: Theo dõi kỷ niệm và đếm ngược sự kiện đặc biệt với countdown realtime
- **📅 Lịch**: Xem lịch trình và sự kiện sắp tới theo tháng
- **📝 Ghi chú**: Lưu ý tưởng và việc cần làm với màu sắc tùy chỉnh, pin notes, soft delete
- **💱 Chuyển đổi tiền tệ**: Tính toán và chuyển đổi 8 loại tiền tệ phổ biến với rate realtime
- **👔 Phối đồ màu sắc**: Chọn và lưu trang phục với preview realtime, SVG rendering
- **💰 Giá vàng**: Theo dõi giá vàng Việt Nam realtime với 7 loại vàng, biểu đồ lịch sử, auto-refresh

### 🎨 Đặc điểm thiết kế:

- ✅ Giao diện pastel dễ thương, tươi mới
- ✅ Responsive hoàn hảo trên mọi thiết bị (mobile-first)
- ✅ Animation mượt mà với Framer Motion
- ✅ Accessibility tốt (WCAG AA, ARIA labels, focus states)
- ✅ Dễ mở rộng - thêm công cụ mới dễ dàng với modular architecture
- ✅ Dark mode ready (planned)
- ✅ PWA support (planned)

## 🚀 Công nghệ sử dụng

### Frontend:
- **React 18.2.0** - UI Framework hiện đại
- **Vite 5.0.8** - Build tool siêu nhanh với HMR
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Framer Motion 10.16.16** - Animation library mượt mà
- **React Router 6.20.0** - Client-side routing
- **Lucide React** - Icon library đẹp và nhẹ
- **date-fns** - Date manipulation
- **Recharts** - Charting library cho biểu đồ giá vàng
- **PropTypes** - Runtime type checking

### Backend:
- **Node.js 18+** - JavaScript runtime
- **Express 4.18.2** - Minimalist web framework
- **PostgreSQL 13+** - Relational database
- **pg 8.11.3** - PostgreSQL driver
- **node-cron** - Cron job scheduler cho auto-fetch giá vàng
- **RESTful API** - API architecture chuẩn
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables management

### DevOps & Tools:
- **Git** - Version control
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework (planned)
- **Supertest** - API testing (planned)

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

### ⚡ Cách khuyến nghị (npm scripts):

#### Chạy Backend:
```bash
npm run dev:backend
```
Backend API sẽ chạy tại: **http://localhost:5000**

#### Chạy Frontend:
```bash
npm run dev
```
Frontend sẽ chạy tại: **http://localhost:3000**

#### Chạy cả hai cùng lúc:
Mở 2 terminal riêng biệt:
- **Terminal 1**: `npm run dev:backend` 
- **Terminal 2**: `npm run dev`

### 🗄️ Database Commands:
```bash
npm run db:setup    # Setup database (migrations + seeds)
npm run db:migrate  # Run migrations only
npm run db:seed     # Run seeds only  
npm run db:test     # Test database connection
```

### ⚠️ Lưu ý cho PowerShell users:
- **KHÔNG dùng**: `cd backend & npm run dev` (lỗi AmpersandNotAllowed)
- **DÙNG**: `npm run dev:backend` hoặc `cd backend; npm run dev`
- Xem chi tiết: [docs/SHELL_COMMANDS_GUIDE.md](docs/SHELL_COMMANDS_GUIDE.md)

## 📁 Cấu trúc dự án

```
KaDongSite/
├── 📂 src/                          # Frontend source
│   ├── 📂 components/               # React components
│   │   ├── 📂 gold/                 # Gold components
│   │   │   ├── GoldHeader.jsx
│   │   │   ├── GoldListCard.jsx
│   │   │   ├── GoldChart.jsx
│   │   │   ├── GoldFilters.jsx
│   │   │   ├── GoldProviderBadge.jsx
│   │   │   └── index.jsx
│   │   ├── Header.jsx
│   │   ├── SidebarMenu.jsx
│   │   ├── Footer.jsx
│   │   └── ToolCard.jsx
│   ├── 📂 pages/                    # Pages/Tools
│   │   ├── Home.jsx
│   │   ├── CountdownTool.jsx
│   │   ├── CalendarTool.jsx
│   │   ├── NotesTool.jsx
│   │   ├── CurrencyTool.jsx
│   │   ├── FashionTool.jsx
│   │   └── GoldPricesTool.jsx       # NEW: Gold prices tool
│   ├── 📂 services/                 # API services
│   │   └── goldService.js
│   ├── 📂 config/                   # Frontend config
│   │   └── constants.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── 📂 backend/                      # Backend API
│   ├── 📂 routes/                   # API routes
│   │   ├── notes.js
│   │   ├── events.js
│   │   ├── fashion.js
│   │   └── gold.js                  # NEW: Gold API routes
│   ├── 📂 controllers/              # Business logic
│   │   ├── notesController.js
│   │   ├── eventsController.js
│   │   ├── fashionController.js
│   │   └── goldController.js        # NEW: Gold controller
│   ├── 📂 providers/                # NEW: Data providers
│   │   ├── mockProvider.js          # Mock data for development
│   │   └── templateProvider.js      # Template for real APIs
│   ├── 📂 database/                 # Database files
│   │   ├── 📂 migrations/           # SQL migrations
│   │   │   ├── 001_up_initial_schema.sql
│   │   │   ├── 001_down_initial_schema.sql
│   │   │   ├── 002_up_gold_rates.sql     # NEW: Gold rates table
│   │   │   └── 002_down_gold_rates.sql
│   │   └── 📂 seeds/                # Seed data
│   │       ├── 001_test_user.sql
│   │       └── 002_gold_rates_seed.sql   # NEW: Gold seed data
│   ├── 📂 scripts/                  # Utility scripts
│   │   ├── migrate-localStorage.js
│   │   ├── migrate-gold-localstorage.js  # NEW: Gold data migration
│   │   ├── fetch-gold.js            # NEW: Cron job for gold prices
│   │   └── run-gold-migration.js
│   ├── 📂 config/                   # Backend config
│   │   └── database.js
│   ├── app.js                       # Express app
│   └── .env                         # Environment variables
│
├── 📂 docs/                         # Documentation
│   ├── 📂 dev-notes/                # Development tracking
│   │   ├── 📂 features/             # Feature status
│   │   ├── 📂 bugfixes/             # Bug fixes
│   │   ├── 📂 commits/              # Commit summaries
│   │   ├── README.md
│   │   └── QUICK_REFERENCE.md
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── SETUP_INSTALLATION.md
│   ├── SHELL_COMMANDS_GUIDE.md
│   ├── GOLD_FEATURE.md              # NEW: Gold feature docs
│   └── INDEX.md
│
├── 📂 specs/                        # NEW: Spec Kit
│   ├── 📂 plans/                    # Implementation plans
│   │   └── 01_init.plan
│   ├── 📂 templates/                # Reusable templates
│   │   ├── TEMPLATE_spec.md
│   │   ├── TEMPLATE_plan.md
│   │   └── TEMPLATE_task.md
│   ├── 01_init.spec
│   ├── README.md                    # Spec Kit guide
│   ├── COMMANDS.md                  # NEW: Copilot Agent commands
│   └── config.json
│
├── 📂 public/                       # Static assets
├── index.html
├── package.json                     # Frontend dependencies
├── vite.config.js
├── tailwind.config.js
├── project_manifest.json            # Project metadata v1.3.0
└── README.md                        # This file
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

**Note**: Most endpoints require `user_id` parameter (query string for GET, body for POST/PUT/DELETE). Default test user: `00000000-0000-0000-0000-000000000001`

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

#### 💰 Gold Prices **NEW**
- `GET /gold/latest` - Get latest gold prices
  - Query params: `types` (comma-separated), `sources`, `limit`
  - Example: `/gold/latest?types=SJC_9999,SJC_24K&limit=10`
- `GET /gold/history` - Get historical gold prices with aggregation
  - Query params: `type` (required), `period` (day/week/month/year), `limit`
  - Example: `/gold/history?type=SJC_9999&period=day&limit=30`
- `POST /gold/fetch` - Trigger manual gold price fetch (admin)
- `GET /gold/sources` - Get available gold data sources

**Gold Types Supported:**
- `SJC_9999` - SJC 99.99%
- `SJC_24K` - SJC 24K
- `PNJ_24K` - PNJ 24K
- `PNJ_18K` - PNJ 18K
- `DOJI_24K` - DOJI 24K
- `GOLD_14K` - Gold 14K
- `XAU_USD` - XAU/USD (ounce)

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

### Deployment Strategy:
- **Frontend**: Vercel (recommended) / Netlify / GitHub Pages
- **Backend**: Railway (recommended) / Heroku / Render
- **Database**: Supabase (PostgreSQL) / Railway

### Environment Variables for Production:
```env
# Frontend (.env.production)
VITE_API_BASE_URL=https://api.yourdomain.com

# Backend (.env.production)
NODE_ENV=production
PORT=5000
DB_USER=your_prod_user
DB_PASSWORD=your_prod_password
DB_HOST=your_prod_host
DB_PORT=5432
DB_NAME=kadong_tools_prod
DB_SSL=true
GOLD_FETCH_CRON=0 */30 * * * *
```

See deployment guide: [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) (coming soon)

## 🌟 Tính năng mở rộng trong tương lai

### High Priority:
- [ ] Authentication system (JWT-based login)
- [ ] Gold prices: Real API integration (SJC, PNJ, DOJI)
- [ ] Gold prices: Historical chart with recharts (70% done)
- [ ] Automated testing (Jest + Supertest, 80% coverage target)
- [ ] Dark mode support

### Medium Priority:
- [ ] PWA (Progressive Web App) support
- [ ] Push notifications for countdown events
- [ ] Export/Import data (JSON, CSV)
- [ ] Multi-language support (EN/VN)
- [ ] Weather tool integration

### Low Priority:
- [ ] To-do list tool with categories
- [ ] Pomodoro timer tool
- [ ] Budget tracker tool
- [ ] Recipe manager tool

## 📚 Documentation

Comprehensive documentation với 15+ guides và references.

### 📖 Main Documentation:
For detailed documentation, visit: **[docs/INDEX.md](docs/INDEX.md)**

**Quick Links:**
- 🚀 [Setup & Installation](docs/SETUP_INSTALLATION.md) - Hướng dẫn cài đặt chi tiết
- 🔧 [Shell Commands Guide](docs/SHELL_COMMANDS_GUIDE.md) - ⚠️ Important for Windows users!
- 📖 [API Documentation](docs/API_DOCUMENTATION.md) - Complete API reference với examples
- 🗄️ [Database Schema](docs/DATABASE_SCHEMA.md) - ERD, tables, relationships, indexes
- 🔄 [Migration Summary](docs/MIGRATION_SUMMARY.md) - localStorage → PostgreSQL migration
- � [Gold Feature Guide](docs/GOLD_FEATURE.md) - **NEW:** Hướng dẫn tính năng giá vàng
- �🐛 [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues & solutions
- 🤝 [Contributing](docs/CONTRIBUTING.md) - Contribution guidelines

### 📝 Development Tracking (Dev-Notes):
- 📂 [Dev-Notes README](docs/dev-notes/README.md) - Workflow guide
- ✨ [Features Status](docs/dev-notes/features/) - Implementation progress tracking
- 🐛 [Bug Fixes](docs/dev-notes/bugfixes/) - Root cause analysis documents
- 📋 [Commit Summaries](docs/dev-notes/commits/) - Detailed change logs
- ⚡ [Quick Reference](docs/dev-notes/QUICK_REFERENCE.md) - Daily commands cheat sheet

### 🎯 Specification Management (Spec Kit):
- 📘 [Spec Kit README](specs/README.md) - Complete workflow guide
- 🤖 [Copilot Commands](specs/COMMANDS.md) - **NEW:** Prompt commands for AI agents
- 📋 [Templates](specs/templates/) - Reusable spec/plan/task templates
- ⚙️ [Config](specs/config.json) - Validation rules & settings
- 📄 [Specifications](specs/) - Feature specs (01_init.spec, etc.)
- 📊 [Implementation Plans](specs/plans/) - Detailed implementation plans

### 🔧 Project Metadata:
- 📦 [Project Manifest](project_manifest.json) - **v1.3.0** - Complete project configuration

## �📝 License

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
## 📊 Project Status

**Version:** 1.3.0  
**Last Updated:** 2025-11-11  
**Overall Progress:** 85%

### ✅ Completed Features:
- ✅ Database setup (PostgreSQL with 5 tables, UUID-based, 15+ indexes)
- ✅ Notes tool (CRUD + soft delete + pin + color coding)
- ✅ Countdown tool (realtime countdown + recurring events + past events)
- ✅ Calendar tool (month view + event display + navigation)
- ✅ Currency tool (8 currencies + realtime conversion)
- ✅ Fashion tool (color matcher with realtime SVG preview)
- ✅ Gold prices backend (4 API endpoints + providers + cron scheduler)
- ✅ Gold prices frontend (GoldPricesTool page + 5 components)
- ✅ Documentation reorganization (dev-notes structure with templates)
- ✅ Spec Kit integration (workflow system for AI agents)
- ✅ Bug fixes (UUID validation, PowerShell syntax, migration conflicts)

### 🚧 In Progress (70% done):
- 🚧 Gold prices: Chart implementation with recharts (multi-line comparison, period selection)
- 🚧 Testing: Backend + Frontend automated tests (target 80% coverage)
- 🚧 Documentation: API docs update with Gold endpoints

### ⏳ Planned Features:
- ⏳ Authentication system (JWT-based login + bcrypt hashing)
- ⏳ Real gold API integration (SJC, PNJ, DOJI official APIs)
- ⏳ Deployment to production (Vercel + Railway + Supabase)
- ⏳ Dark mode support
- ⏳ PWA features (offline support, push notifications)

---

## 🧪 Testing & Quality Assurance

### Current Test Coverage:
- **Backend:** Manual testing ✅ (automated tests planned)
- **Frontend:** Manual testing ✅ (automated tests planned)
- **Integration:** Manual API testing ✅
- **E2E:** Manual user workflows ✅
- **Automated Coverage:** 0% → Target: **80%**

### Planned Testing Stack:
```bash
# Backend unit tests (Jest)
npm run test:backend

# Frontend component tests (React Testing Library)
npm run test:frontend

# Integration tests (Supertest)
npm run test:integration

# E2E tests (Cypress - planned)
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Quality Standards Implemented:
- ✅ ESLint configuration (code linting)
- ✅ Prettier formatting (code style)
- ✅ Code conventions documented (project_manifest.json)
- ✅ Git commit message format (Conventional Commits)
- ✅ API response format standardized
- ✅ Database naming conventions (snake_case)
- ✅ Frontend naming conventions (camelCase/PascalCase)

---

## 🔐 Security Measures

### ✅ Currently Implemented:
- ✅ **Parameterized SQL queries** (`$1, $2, $3`) - Prevents SQL injection
- ✅ **Input validation** on all API endpoints - Whitelist approach
- ✅ **XSS prevention** - React auto-escaping, no dangerouslySetInnerHTML
- ✅ **CORS configuration** - Restricted origins
- ✅ **Environment variables** for secrets (`.env` files, not in Git)
- ✅ **UUID primary keys** - Security + distributed systems support
- ✅ **Soft delete pattern** - Data recovery + audit trail
- ✅ **Error handling** - No sensitive info leakage in error messages
- ✅ **Connection pooling** - 20 max connections, prevents DoS

### ⏳ Planned Security Enhancements:
- [ ] **Rate limiting** (express-rate-limit) - 100 requests/15 minutes
- [ ] **JWT authentication** - Secure token-based auth
- [ ] **Password hashing** (bcrypt) - Salt rounds: 10
- [ ] **HTTPS in production** - SSL/TLS certificates
- [ ] **Security headers** (helmet middleware) - XSS, clickjacking protection
- [ ] **CSRF protection** (if stateful sessions needed)
- [ ] **API key authentication** for gold fetch endpoint
- [ ] **Input sanitization** library (DOMPurify for client-side)

---

## 📝 License

**MIT License** - Dự án cá nhân, sử dụng tự do!

Copyright (c) 2025 **Long Nguyen**

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## 💝 Made with Love

Được tạo ra với ❤️ cho **Ka & Dong**  
Built with passion by **Long Nguyen**

---

## 📞 Contact & Links

**Author:** Long Nguyen  
**Email:** ntl.284@gmail.com  
**GitHub:** [@thxlong](https://github.com/thxlong)  
**Repository:** [KaDongSite](https://github.com/thxlong/KaDongSite)  
**Branch:** longnguyen (active development)

**Issues & Feedback:**
- 🐛 [Report Bug](https://github.com/thxlong/KaDongSite/issues)
- 💡 [Request Feature](https://github.com/thxlong/KaDongSite/issues)
- 💬 [Discussions](https://github.com/thxlong/KaDongSite/discussions)

---

## 🙏 Credits & Acknowledgments

### Core Technologies:
- **[React](https://react.dev/)** (v18.2.0) - UI library by Meta
- **[Vite](https://vitejs.dev/)** (v5.0.8) - Next generation frontend tooling
- **[Tailwind CSS](https://tailwindcss.com/)** (v3.3.6) - Utility-first CSS framework
- **[PostgreSQL](https://www.postgresql.org/)** (v13+) - Advanced open-source database
- **[Express.js](https://expressjs.com/)** (v4.18.2) - Fast, minimalist web framework
- **[Node.js](https://nodejs.org/)** (v18+) - JavaScript runtime

### UI & UX Libraries:
- **[Lucide React](https://lucide.dev/)** - Beautiful MIT-licensed icons (1000+ icons)
- **[Framer Motion](https://www.framer.com/motion/)** (v10.16.16) - Production-ready motion library
- **[Recharts](https://recharts.org/)** - Composable charting library built on React
- **[React Router](https://reactrouter.com/)** (v6.20.0) - Declarative routing for React

### Utilities & Tools:
- **[date-fns](https://date-fns.org/)** - Modern JavaScript date utility library
- **[node-cron](https://www.npmjs.com/package/node-cron)** - Task scheduler for Node.js
- **[pg](https://node-postgres.com/)** (v8.11.3) - PostgreSQL client for Node.js
- **[dotenv](https://www.npmjs.com/package/dotenv)** - Environment variables loader
- **[PropTypes](https://www.npmjs.com/package/prop-types)** - Runtime type checking

### Development Tools:
- **[VS Code](https://code.visualstudio.com/)** - Best code editor
- **[GitHub Copilot](https://github.com/features/copilot)** - AI pair programmer
- **[ESLint](https://eslint.org/)** - JavaScript linter
- **[Prettier](https://prettier.io/)** - Code formatter
- **[Git](https://git-scm.com/)** - Version control

### Design & Inspiration:
- **Pastel Color Palettes** - Soft, friendly aesthetics
- **Material Design** - Google's design system principles
- **Minimalist UI/UX** - Less is more approach
- **WCAG Accessibility Guidelines** - AA compliance target
- **Mobile-First Design** - Responsive from smallest screens

### Learning Resources:
- **[MDN Web Docs](https://developer.mozilla.org/)** - Web development documentation
- **[React Documentation](https://react.dev/learn)** - Official React guides
- **[PostgreSQL Documentation](https://www.postgresql.org/docs/)** - Database docs
- **[Stack Overflow](https://stackoverflow.com/)** - Developer community
- **[GitHub](https://github.com/)** - Code hosting & collaboration

### Special Thanks:
- Open-source community for amazing tools
- GitHub for free hosting and tools
- All contributors and supporters
- Ka & Dong for inspiration ❤️

---

## 📋 Changelog

### [1.3.0] - 2025-11-11

**✨ New Features:**
- **Gold Prices Tool** 💰
  - 7 gold types supported (SJC_9999, SJC_24K, PNJ_24K, PNJ_18K, DOJI_24K, GOLD_14K, XAU_USD)
  - Latest prices with filters (type, source, limit)
  - Historical data with period aggregation (day/week/month/year)
  - Auto-refresh with cron scheduler (every 30 minutes)
  - Provider system (mockProvider, templateProvider for real APIs)
  - 4 API endpoints (latest, history, fetch, sources)
  - Frontend UI with 5 components (GoldHeader, GoldListCard, GoldChart, GoldFilters, GoldProviderBadge)
  - Database table `gold_rates` with 6 indexes for performance

- **Spec Kit Workflow System** 🎯
  - Complete specification management system in `specs/` folder
  - 3 templates (spec, plan, task) for structured development
  - Workflow commands: `/specify`, `/plan`, `/tasks`, `/implement`
  - Copilot Agent commands in `specs/COMMANDS.md`
  - Configuration and validation rules in `specs/config.json`
  - Initial spec (01_init.spec) and plan (01_init.plan) documenting 85% project progress

- **Dev-Notes Structure** 📝
  - Organized development tracking in `docs/dev-notes/`
  - 3 subdirectories: features/, bugfixes/, commits/
  - Templates for feature status, bugfix analysis, commit summaries
  - README with workflow guide and best practices
  - Quick reference for daily commands

**🔧 Improvements:**
- Updated `project_manifest.json` to v1.3.0
- Enhanced documentation structure (15+ guides)
- Improved API documentation with Gold endpoints
- Added database schema for gold_rates table
- Better error handling in Fashion Tool

**🐛 Bug Fixes:**
- Fixed UUID validation error in Fashion Tool
  - Created `src/config/constants.js` with TEST_USER_ID
  - Updated FashionTool.jsx to use valid UUID
  - Added camelCase/snake_case compatibility in fashionController
- Fixed PowerShell command syntax issues
  - Documented `;` vs `&&` usage
  - Updated SHELL_COMMANDS_GUIDE.md
- Fixed database migration conflicts
  - Created standalone run-gold-migration.js script
  - Resolved "relation already exists" errors

**📚 Documentation:**
- New: GOLD_FEATURE.md - Complete gold feature guide
- New: specs/README.md - Spec Kit workflow documentation
- New: specs/COMMANDS.md - Copilot Agent prompt commands
- Updated: API_DOCUMENTATION.md with Gold endpoints
- Updated: DATABASE_SCHEMA.md with gold_rates table
- Updated: README.md with latest features and tools

**🔗 Integration:**
- Spec Kit ↔ Dev-Notes ↔ Project Manifest
- Gold frontend ↔ Gold backend ↔ Database
- Migration tools for localStorage data

---

### [1.2.0] - 2025-11-10

**✨ New Features:**
- **Fashion Tool** 👔
  - Color picker for 5 clothing items (shirt, pants, shoes, hat, bag)
  - Realtime SVG preview of outfit
  - Save outfits to database
  - View and delete saved outfits

- **Dev-Notes Folder** 📝
  - Created docs/dev-notes/ structure
  - Added templates for tracking

**🔧 Improvements:**
- Updated project_manifest.json to v1.2.0
- Better database organization

---

### [1.1.0] - 2024-12-01

**✨ New Features:**
- **Currency Tool** 💱
  - 8 major currencies (USD, EUR, GBP, JPY, CNY, VND, THB, KRW)
  - Realtime conversion
  - Exchange rate display

- **Calendar Tool** 📅
  - Month view with navigation
  - Display events from countdown tool
  - Color-coded events

**🔧 Improvements:**
- PostgreSQL database integration
- RESTful API with Express
- Migration scripts for data import

---

### [1.0.0] - 2024-11-01

**🎉 Initial Release:**
- **Notes Tool** 📝
  - CRUD operations
  - Color coding (7 colors)
  - Pin important notes
  - Search and filter

- **Countdown Tool** ⏰
  - Realtime countdown to events
  - Recurring events support
  - Past events view
  - Color themes

**🎨 Design:**
- Pastel color scheme (pink, purple, mint, yellow, blue, peach, cream)
- Responsive layout (mobile-first)
- Framer Motion animations
- Accessibility features (ARIA labels, focus states)

**🔧 Tech Stack:**
- React 18.2.0 + Vite 5.0.8
- Tailwind CSS 3.3.6
- React Router 6.20.0
- Lucide React icons
- date-fns for dates

---

## 🗺️ Roadmap

### Q1 2025 ✅ (Completed)
- ✅ Notes Tool
- ✅ Countdown Tool
- ✅ Calendar Tool
- ✅ Currency Tool
- ✅ Fashion Tool
- ✅ PostgreSQL integration
- ✅ RESTful API

### Q2 2025 🚧 (In Progress - 70%)
- ✅ Gold Prices Tool (backend complete)
- 🚧 Gold Prices charts (recharts integration)
- 🚧 Automated testing (Jest + Supertest)
- 🚧 Documentation complete

### Q3 2025 ⏳ (Planned)
- ⏳ Authentication system (JWT)
- ⏳ Real gold API integration
- ⏳ Dark mode
- ⏳ PWA features
- ⏳ Push notifications

### Q4 2025 ⏳ (Planned)
- ⏳ Production deployment
- ⏳ CI/CD pipeline (GitHub Actions)
- ⏳ Monitoring & analytics
- ⏳ Performance optimization
- ⏳ SEO optimization

### 2026 🔮 (Future)
- 🔮 Mobile app (React Native)
- 🔮 Weather tool
- 🔮 To-do list tool
- 🔮 Budget tracker
- 🔮 Recipe manager
- 🔮 Multi-language (EN/VN)

---

**Happy Coding! 🎉✨**

*Built with ❤️ by Long Nguyen*  
*Last updated: November 11, 2025*  
*Version: 1.3.0*
