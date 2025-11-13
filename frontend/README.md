# 🎨 Frontend - KaDong Personal Utilities

Modern React application với feature-based architecture, clean structure, và best practices.

---

## 📁 **Project Structure**

```
frontend/
├── src/
│   ├── app/                          # Application Core
│   │   └── App.jsx                   # Main app component với routing
│   │
│   ├── features/                     # Feature Modules (Feature-Based Architecture)
│   │   ├── home/                     # 🏠 Home - Landing page
│   │   │   └── HomePage.jsx
│   │   │
│   │   ├── notes/                    # 📝 Notes - Ghi chú cá nhân
│   │   │   └── NotesPage.jsx
│   │   │
│   │   ├── calendar/                 # 📅 Calendar - Sự kiện quan trọng
│   │   │   └── CalendarPage.jsx
│   │   │
│   │   ├── countdown/                # ⏱️ Countdown - Đếm ngược ngày đặc biệt
│   │   │   └── CountdownPage.jsx
│   │   │
│   │   ├── currency/                 # 💱 Currency - Chuyển đổi tiền tệ
│   │   │   └── CurrencyPage.jsx
│   │   │
│   │   ├── fashion/                  # 👗 Fashion - Quản lý trang phục
│   │   │   └── FashionPage.jsx
│   │   │
│   │   ├── gold/                     # 💰 Gold Prices - Giá vàng
│   │   │   ├── GoldPricesPage.jsx
│   │   │   └── index.jsx
│   │   │
│   │   ├── weather/                  # 🌤️ Weather - Thời tiết
│   │   │   ├── WeatherPage.jsx
│   │   │   ├── WeatherAnimation.jsx
│   │   │   ├── WeatherCurrent.jsx
│   │   │   ├── WeatherForecast.jsx
│   │   │   ├── WeatherHeader.jsx
│   │   │   ├── WeatherSearch.jsx
│   │   │   ├── FavoriteCities.jsx
│   │   │   ├── index.js
│   │   │   └── weatherService.js
│   │   │
│   │   ├── wedding/                  # 💒 Wedding - Thiệp cưới
│   │   │   ├── WeddingPage.jsx
│   │   │   ├── BaseUrlInput.jsx
│   │   │   ├── EncodedUrlList.jsx
│   │   │   ├── GuestNameInput.jsx
│   │   │   ├── QRCodeDisplay.jsx
│   │   │   └── weddingService.js
│   │   │
│   │   └── wishlist/                 # 🎁 Wishlist - Danh sách mong muốn
│   │       ├── WishlistPage.jsx
│   │       ├── CommentItem.jsx
│   │       ├── WishlistAddModal.jsx
│   │       ├── WishlistCard.jsx
│   │       ├── WishlistEditModal.jsx
│   │       ├── WishlistGrid.jsx
│   │       ├── WishlistHeader.jsx
│   │       ├── WishlistStats.jsx
│   │       ├── index.jsx
│   │       └── wishlistService.js
│   │
│   ├── shared/                       # Shared Resources
│   │   ├── components/               # Shared UI Components
│   │   │   ├── Header.jsx           # App header với navigation
│   │   │   ├── Footer.jsx           # App footer
│   │   │   ├── SidebarMenu.jsx      # Sidebar navigation
│   │   │   ├── ToolCard.jsx         # Card component cho tools
│   │   │   ├── ColorPicker.jsx      # Color picker component
│   │   │   └── OutfitPreview.jsx    # Outfit preview component
│   │   │
│   │   ├── utils/                    # Utility Functions
│   │   │   ├── fileParser.js        # File parsing utilities
│   │   │   └── urlEncoder.js        # URL encoding utilities
│   │   │
│   │   └── config/                   # Configuration
│   │       └── constants.js         # App constants
│   │
│   ├── assets/                       # Static Assets
│   │   └── (images, icons, etc.)
│   │
│   ├── styles/                       # Global Styles
│   │   └── index.css                # Main stylesheet (Tailwind)
│   │
│   └── main.jsx                      # Application Entry Point
│
├── public/                           # Public Assets
│   └── heart.svg                     # App icon
│
├── tests/                            # Playwright Tests
│   ├── e2e/                          # End-to-End Tests
│   │   └── notes.e2e.spec.js
│   └── (component tests...)
│
├── index.html                        # HTML Template
├── vite.config.js                    # Vite Configuration
├── tailwind.config.js                # Tailwind CSS Config
├── postcss.config.js                 # PostCSS Config
├── playwright.config.js              # Playwright Test Config
├── package.json                      # Dependencies & Scripts
└── README.md                         # This file
```

---

## 🏗️ **Architecture Principles**

### **1. Feature-Based Structure**
Mỗi feature là một module độc lập:
- ✅ **Colocated**: Components, services, styles cùng folder
- ✅ **Encapsulated**: Logic tách biệt, dễ maintain
- ✅ **Scalable**: Thêm feature mới không ảnh hưởng cũ
- ✅ **Testable**: Test từng feature riêng lẻ

### **2. Clean Separation**
```
features/      → Feature-specific code
shared/        → Reusable across features
app/           → Application core (routing, layout)
```

### **3. Import Aliases**
Sử dụng path aliases để import clean:
```javascript
import Header from '@shared/components/Header'
import NotesPage from '@features/notes/NotesPage'
import { API_URL } from '@shared/config/constants'
```

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js >= 18.0.0
- npm >= 9.0.0

### **Installation**
```bash
# From project root
cd frontend
npm install
```

### **Development**
```bash
# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Testing**
```bash
# Run all E2E tests
npm test

# Run tests với UI mode
npm run test:watch

# Run specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Debug tests
npm run test:debug
```

---

## 📦 **Dependencies**

### **Core**
- `react` ^18.2.0 - UI library
- `react-dom` ^18.2.0 - React DOM renderer
- `react-router-dom` ^6.20.0 - Routing

### **UI & Animation**
- `framer-motion` ^10.16.16 - Animations
- `lucide-react` ^0.294.0 - Icons
- `react-hot-toast` ^2.6.0 - Notifications
- `tailwindcss` ^3.3.6 - Styling

### **Utilities**
- `date-fns` ^2.30.0 - Date utilities
- `qrcode.react` ^4.2.0 - QR code generation
- `recharts` ^3.4.1 - Charts
- `xlsx` ^0.18.5 - Excel handling

### **Dev Tools**
- `vite` ^5.0.8 - Build tool
- `@playwright/test` ^1.56.1 - E2E testing
- `@vitejs/plugin-react` ^4.2.1 - React plugin for Vite

---

## 🎯 **Features Overview**

### **8 Core Tools**

| Feature | Route | Description |
|---------|-------|-------------|
| 🏠 **Home** | `/` | Landing page với tất cả tools |
| 📝 **Notes** | `/notes` | Ghi chú cá nhân với màu sắc |
| 📅 **Calendar** | `/calendar` | Quản lý sự kiện quan trọng |
| ⏱️ **Countdown** | `/countdown` | Đếm ngược ngày đặc biệt |
| 💱 **Currency** | `/currency` | Chuyển đổi tiền tệ realtime |
| 👗 **Fashion** | `/fashion` | Quản lý tủ đồ & outfit |
| 💰 **Gold** | `/gold` | Theo dõi giá vàng |
| 🌤️ **Weather** | `/weather` | Dự báo thời tiết 7 ngày |
| 💒 **Wedding** | `/wedding-invitation` | Tạo thiệp cưới điện tử |
| 🎁 **Wishlist** | `/wishlist` | Danh sách mong muốn |

---

## 🛠️ **Development Guidelines**

### **Adding a New Feature**

1. **Create feature folder:**
```bash
frontend/src/features/my-feature/
├── MyFeaturePage.jsx      # Main page component
├── components/            # Feature-specific components (optional)
├── hooks/                 # Feature-specific hooks (optional)
└── services/              # API services (optional)
```

2. **Add route in App.jsx:**
```javascript
import MyFeaturePage from '@features/my-feature/MyFeaturePage'

<Route path="/my-feature" element={<MyFeaturePage />} />
```

3. **Add to SidebarMenu:**
```javascript
// In shared/components/SidebarMenu.jsx
{ name: 'My Feature', path: '/my-feature', icon: '🎯' }
```

### **Code Style**
- ✅ Use functional components + hooks
- ✅ Use PropTypes for type checking
- ✅ Follow React best practices
- ✅ Use Tailwind for styling
- ✅ Keep components < 300 lines
- ✅ Extract reusable logic to hooks

### **Naming Conventions**
```
Components:    PascalCase  → Header.jsx, ToolCard.jsx
Files:         camelCase   → weatherService.js, fileParser.js
Constants:     UPPER_CASE  → API_URL, MAX_ITEMS
CSS Classes:   kebab-case  → btn-primary, card-header
```

---

## 🧪 **Testing Strategy**

### **E2E Tests (Playwright)**
```javascript
// tests/e2e/notes.e2e.spec.js
test('should create new note', async ({ page }) => {
  await page.goto('/notes')
  await page.click('[data-testid="add-note"]')
  await page.fill('[name="title"]', 'Test Note')
  await page.click('button:has-text("Save")')
  
  await expect(page.locator('text=Test Note')).toBeVisible()
})
```

### **Component Tests (Coming Soon)**
```javascript
// Using Playwright Component Testing
test('ToolCard renders correctly', async ({ mount }) => {
  const component = await mount(<ToolCard title="Test" icon="🎯" />)
  await expect(component).toContainText('Test')
})
```

---

## 📊 **Performance**

### **Build Optimization**
- ✅ Code splitting by route
- ✅ Lazy loading for heavy features
- ✅ Tree shaking unused code
- ✅ Minification & compression

### **Runtime Optimization**
- ✅ React.memo for expensive components
- ✅ useMemo/useCallback for computations
- ✅ Debouncing for search/input
- ✅ Virtual scrolling for long lists

---

## 🔧 **Configuration**

### **Vite Aliases**
```javascript
// vite.config.js
resolve: {
  alias: {
    '@': '/src',
    '@app': '/src/app',
    '@features': '/src/features',
    '@shared': '/src/shared',
    '@assets': '/src/assets',
    '@styles': '/src/styles',
  }
}
```

### **Tailwind**
- Custom colors: `tailwind.config.js`
- Custom fonts: Nunito & Poppins
- Dark mode: class-based

---

## 📝 **API Integration**

All API calls proxy through Vite:
```javascript
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true
  }
}
```

Example API call:
```javascript
const response = await fetch('/api/notes')
const data = await response.json()
```

---

## 🚢 **Deployment**

### **Build**
```bash
npm run build
# Output: dist/ folder
```

### **Environment Variables**
Create `.env` file:
```env
VITE_API_URL=https://api.kadong.com
VITE_APP_VERSION=1.0.0
```

Access in code:
```javascript
const API_URL = import.meta.env.VITE_API_URL
```

---

## 📚 **Resources**

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Playwright](https://playwright.dev/)
- [Framer Motion](https://www.framer.com/motion/)

---

## 🤝 **Contributing**

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes following guidelines
3. Test thoroughly
4. Commit: `git commit -m "feat: add my feature"`
5. Push: `git push origin feature/my-feature`
6. Create Pull Request

---

**Last Updated:** 2025-11-13  
**Version:** 2.0.0 (Feature-Based Architecture)  
**Maintainer:** KaDong Team
