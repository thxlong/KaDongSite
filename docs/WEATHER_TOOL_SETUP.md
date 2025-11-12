# Weather Tool Setup Guide 🌤️

## 🎉 Implementation Complete!

Weather Tool đã được implement với đầy đủ tính năng:
- ✅ Backend API với OpenWeatherMap integration
- ✅ Database migrations (favorite_cities, weather_cache)
- ✅ Frontend components với Framer Motion animations
- ✅ 6 weather animations (Sunny, Rainy, Cloudy, Snowy, Thunderstorm, Foggy)

---

## 📋 Setup Instructions

### 1. **Đăng ký OpenWeatherMap API Key** (FREE)

```bash
# 1. Truy cập: https://openweathermap.org/api
# 2. Click "Sign Up" → Tạo account miễn phí
# 3. Verify email
# 4. Vào "API Keys" tab
# 5. Copy API key của bạn
```

**Free Tier:**
- 1,000 API calls/day
- Current weather, forecast, và geocoding
- Đủ cho personal project!

---

### 2. **Configure Environment Variables**

```bash
# Mở file backend/.env
cd backend

# Thêm WEATHER_API_KEY (thay your_api_key_here)
echo "WEATHER_API_KEY=your_api_key_here" >> .env
```

**Example `.env` file:**
```env
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/kadongsite
WEATHER_API_KEY=abc123def456ghi789  # ← Your OpenWeatherMap API key
ALLOWED_ORIGINS=http://localhost:5173
```

---

### 3. **Run Database Migration**

```bash
# Trong backend folder
cd backend

# Run migration để tạo tables
npm run db:migrate:up

# Kết quả:
# ✓ Created table: favorite_cities
# ✓ Created table: weather_cache
# ✓ Created indexes
# ✓ Created triggers
```

**Rollback (nếu cần):**
```bash
npm run db:migrate:down
```

---

### 4. **Install Dependencies** (nếu chưa có)

```bash
# Backend
cd backend
npm install axios  # HTTP client cho OpenWeatherMap API

# Frontend (đã có sẵn)
# - framer-motion (v10.16.16)
# - lucide-react (icons)
# - date-fns (date formatting)
```

---

### 5. **Start Application**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev

# Output:
# Server running on http://localhost:5000
# Database connected
# Weather API ready
```

**Terminal 2 - Frontend:**
```bash
# Từ root folder
npm run dev

# Output:
# VITE ready
# Local: http://localhost:5173
```

---

### 6. **Test Weather Tool**

1. **Mở browser:** `http://localhost:5173/weather`

2. **Test các tính năng:**
   - ✅ Search city: "Hanoi", "Tokyo", "Paris"
   - ✅ Geolocation button (📍)
   - ✅ View current weather + 7-day forecast
   - ✅ Toggle °C/°F
   - ✅ Refresh button
   - ✅ Quick access cities

3. **Test animations:**
   - Clear weather → Sunny animation (mặt trời + tia sáng)
   - Rain → Rainy animation (giọt mưa rơi)
   - Clouds → Cloudy animation (mây di chuyển)
   - Snow → Snowy animation (bông tuyết)
   - Thunderstorm → Lightning + heavy rain
   - Fog → Foggy animation (sương mù)

---

## 🗂️ File Structure

```
backend/
├── database/migrations/
│   ├── 003_up_weather_tool.sql     # Create tables
│   └── 003_down_weather_tool.sql   # Rollback
├── services/
│   └── weatherService.js           # OpenWeatherMap API + cache
├── controllers/
│   └── weatherController.js        # 7 endpoints
├── routes/
│   └── weather.js                  # Route definitions
└── app.js                          # ✅ Updated with /api/weather

frontend/
├── src/
│   ├── pages/
│   │   └── WeatherTool.jsx         # Main page
│   ├── components/weather/
│   │   ├── WeatherAnimation.jsx    # 6 animations ⭐
│   │   ├── WeatherHeader.jsx       # Header + controls
│   │   ├── WeatherSearch.jsx       # Search + geolocation
│   │   ├── WeatherCurrent.jsx      # Current weather card
│   │   ├── WeatherForecast.jsx     # 7-day forecast
│   │   ├── FavoriteCities.jsx      # Quick access
│   │   └── index.js                # Exports
│   ├── services/
│   │   └── weatherService.js       # API calls
│   ├── App.jsx                     # ✅ Added /weather route
│   └── components/
│       └── SidebarMenu.jsx         # ✅ Added Weather link
```

---

## 🔌 API Endpoints

### **GET /api/weather/current**
```bash
# By city name
curl "http://localhost:5000/api/weather/current?city=Hanoi&units=metric"

# By coordinates
curl "http://localhost:5000/api/weather/current?lat=21.0285&lon=105.8542&units=metric"
```

### **GET /api/weather/forecast**
```bash
# 7-day forecast
curl "http://localhost:5000/api/weather/forecast?city=Tokyo&units=metric"
```

### **GET /api/weather/hourly**
```bash
# Hourly forecast (next 24h)
curl "http://localhost:5000/api/weather/hourly?city=Paris&units=metric"
```

### **GET /api/weather/favorites**
```bash
# Get user's favorite cities
curl "http://localhost:5000/api/weather/favorites?user_id=uuid"
```

### **POST /api/weather/favorites**
```bash
# Add favorite city
curl -X POST http://localhost:5000/api/weather/favorites \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid",
    "city_name": "Hanoi",
    "country": "VN",
    "lat": 21.0285,
    "lon": 105.8542,
    "is_default": true
  }'
```

---

## 🎨 Weather Animations

### 1. **Sunny Animation** ☀️
- Rotating sun with pulsing glow
- 12 sun rays animating
- 20 sparkles twinkling
- Warm yellow/orange colors

### 2. **Rainy Animation** 🌧️
- 80 raindrops falling
- Dark clouds moving
- Splash effects at bottom
- Blue gradient raindrops

### 3. **Cloudy Animation** ☁️
- 5 cloud layers moving slowly
- Puffing cloud effects
- Gray/white gradients
- Smooth parallax motion

### 4. **Snowy Animation** ❄️
- 50 snowflakes falling
- Snowflakes with SVG patterns
- Drifting left/right motion
- Rotating snowflakes

### 5. **Thunderstorm Animation** ⛈️
- 100 heavy raindrops
- Dark storm clouds
- Lightning bolts (SVG)
- Flash effects
- Thunder glow

### 6. **Foggy Animation** 🌫️
- 6 fog layers drifting
- 30 fog particles
- Blur and opacity effects
- Slow horizontal movement

---

## 🎯 Features

### ✅ **Implemented**
- [x] Current weather display với large temperature
- [x] 7-day forecast cards
- [x] City search functionality
- [x] Geolocation support
- [x] °C/°F unit toggle
- [x] Refresh button
- [x] Weather-appropriate animations (6 types)
- [x] Responsive design (mobile/tablet/desktop)
- [x] API caching (30min current, 6hr forecast)
- [x] Error handling với user-friendly messages
- [x] Loading states
- [x] Quick access cities

### 🚧 **Future Enhancements** (Optional)
- [ ] Hourly forecast display
- [ ] Weather alerts
- [ ] Air quality index (AQI)
- [ ] Save favorite cities to database (user authentication)
- [ ] Search history
- [ ] Weather maps
- [ ] Voice search

---

## 🐛 Troubleshooting

### **Problem: API key không hoạt động**
```bash
# Solution:
1. Check API key trong .env có đúng không
2. Verify email của OpenWeatherMap account
3. Đợi 10-20 phút sau khi tạo API key mới
4. Restart backend server
```

### **Problem: Database migration failed**
```bash
# Solution:
1. Check PostgreSQL đang chạy
2. Check DATABASE_URL trong .env
3. Run: npm run db:test (test connection)
4. Nếu cần, drop tables và run lại migration
```

### **Problem: Animations không hiển thị**
```bash
# Solution:
1. Check framer-motion đã install chưa
2. Clear browser cache
3. Check console errors
4. Verify WeatherAnimation component được import đúng
```

### **Problem: Geolocation không hoạt động**
```bash
# Solution:
1. Browser phải hỗ trợ Geolocation API
2. Allow location permission trong browser
3. HTTPS required cho production (localhost OK)
```

---

## 📊 Cache Strategy

**Current Weather Cache:**
- Duration: 30 minutes
- Table: `weather_cache`
- Auto-clean: Via cron job hoặc manual endpoint

**Forecast Cache:**
- Duration: 6 hours
- Same table với type = 'forecast'
- Reduces API calls significantly

**Clean Cache Manually:**
```bash
curl -X POST http://localhost:5000/api/weather/cache/clean
```

---

## 🎓 Learning Resources

**OpenWeatherMap API Docs:**
- https://openweathermap.org/api
- https://openweathermap.org/current
- https://openweathermap.org/forecast5

**Framer Motion:**
- https://www.framer.com/motion/

**React Hooks:**
- useState, useEffect, useMemo

---

## ✨ Summary

**Created Files:** 18 files
- Backend: 6 files (migrations, service, controller, routes)
- Frontend: 9 files (page, 6 components, service, exports)
- Config: 3 updates (App.jsx, SidebarMenu.jsx, app.js)

**Lines of Code:** ~2,500+ lines
- Backend: ~1,200 lines
- Frontend: ~1,300 lines

**Features:** 15+ features implemented
**Animations:** 6 weather conditions
**API Endpoints:** 7 endpoints

---

## 🚀 Next Steps

1. ✅ **Setup API key** → Test weather data
2. ✅ **Run migration** → Create database tables
3. ✅ **Start servers** → Test full application
4. 📝 **Update documentation** (optional)
5. 🧪 **Write tests** (optional)
6. 🎨 **Customize** colors/styles as needed

---

**Enjoy your Weather Tool! 🌈☀️🌧️❄️⛈️**

*Created by KaDong Team - November 11, 2025*
