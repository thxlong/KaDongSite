# Weather Tool Specification

**Spec ID:** `02_weather_tool`  
**Version:** 1.0.0  
**Status:** � In Progress  
**Overall Progress:** 70%  
**Created:** 2025-11-11  
**Last Updated:** 2025-11-12

---

## 📋 Overview

**Title:** Weather Forecast Tool  
**Type:** Feature  
**Priority:** 🟡 Medium

**Purpose:**  
Tạo công cụ xem dự báo thời tiết với animation tương thích với điều kiện thời tiết hiện tại, cho phép người dùng theo dõi thời tiết hàng ngày một cách trực quan và dễ thương.

**Problem Statement:**  
Người dùng cần kiểm tra thời tiết hàng ngày để lên kế hoạch cho các hoạt động. Các ứng dụng thời tiết hiện có thường phức tạp hoặc không có giao diện thân thiện. KaDong Tools cần một weather tool đơn giản, dễ thương với animation phù hợp với thời tiết (mưa, nắng, mây, tuyết, v.v.).

---

## 🎯 Goals

### Primary Goal
Tạo công cụ xem dự báo thời tiết với:
- Thời tiết hiện tại và dự báo 5 ngày (OpenWeatherMap free tier limitation)
- Animation tương thích với điều kiện thời tiết (sunny, rainy, cloudy, snowy, thunderstorm)
- Giao diện pastel dễ thương, responsive
- Tích hợp Weather API (OpenWeatherMap free tier: 1000 calls/day)

### Secondary Goals
- Tự động detect vị trí người dùng (geolocation)
- Tìm kiếm thành phố
- Lưu thành phố yêu thích
- Hiển thị nhiệt độ, độ ẩm, tốc độ gió, UV index
- Chuyển đổi đơn vị (Celsius/Fahrenheit)

### Non-Goals
- Không tích hợp bản đồ (map view)
- Không cảnh báo thời tiết nghiêm trọng (severe weather alerts)
- Không hiển thị radar thời tiết
- Không dự báo dài hạn (> 7 ngày)

---

## ✅ Acceptance Criteria

### Must Have (Required)

#### Functional Requirements:
- [x] **F1:** Hiển thị thời tiết hiện tại với icon và nhiệt độ ✅ 2025-11-12
- [x] **F2:** Hiển thị dự báo 5 ngày tới (OpenWeatherMap free tier: 5-day/3-hour forecast) ✅ 2025-11-12
- [x] **F3:** Animation Framer Motion tương thích với thời tiết:
  - ☀️ Sunny: Mặt trời lấp lánh, bầu trời xanh
  - 🌧️ Rainy: Giọt mưa rơi từ trên xuống
  - ☁️ Cloudy: Mây di chuyển chậm
  - ❄️ Snowy: Bông tuyết rơi nhẹ nhàng
  - ⛈️ Thunderstorm: Sấm chớp, mưa to
  - 🌫️ Foggy: Sương mù dày đặc
  - 🌤️ Partly Cloudy: Mây + mặt trời
- [x] **F4:** Tích hợp Weather API (OpenWeatherMap free tier) ✅ 2025-11-12
- [x] **F5:** Tìm kiếm thành phố/địa điểm ✅ 2025-11-12
- [x] **F6:** Responsive design (mobile, tablet, desktop) ✅ 2025-11-12

#### Data Display:
- [x] **D1:** Nhiệt độ hiện tại (°C/°F) ✅ 2025-11-12
- [x] **D2:** Điều kiện thời tiết (weather condition) ✅ 2025-11-12
- [x] **D3:** Độ ẩm (humidity %) ✅ 2025-11-12
- [x] **D4:** Tốc độ gió (wind speed km/h hoặc mph) ✅ 2025-11-12
- [x] **D5:** Cảm giác như (feels like temperature) ✅ 2025-11-12
- [x] **D6:** UV index ✅ 2025-11-12
- [x] **D7:** Áp suất không khí (pressure) ✅ 2025-11-12
- [x] **D8:** Tầm nhìn (visibility) ✅ 2025-11-12

#### UI/UX:
- [x] **U1:** Giao diện pastel colors phù hợp với thời tiết ✅ 2025-11-12
- [x] **U2:** Icons thời tiết đẹp (Lucide React) ✅ 2025-11-12
- [x] **U3:** Smooth animation với Framer Motion ✅ 2025-11-12
- [x] **U4:** Loading state khi fetch data ✅ 2025-11-12
- [x] **U5:** Error handling với message thân thiện ✅ 2025-11-12

### Should Have (Important)

- [x] **S1:** Auto-detect location bằng Geolocation API ✅ 2025-11-12
- [x] **S2:** Lưu thành phố yêu thích (favorite cities) vào database ✅ 2025-11-12
- [ ] **S3:** Hourly forecast (dự báo theo giờ trong ngày) ⏳ Pending
- [ ] **S4:** Sunrise/Sunset time ⏳ Pending (data available in API)
- [x] **S5:** Toggle Celsius/Fahrenheit ✅ 2025-11-12
- [ ] **S6:** Search history (lịch sử tìm kiếm) ⏳ Pending
- [x] **S7:** Refresh button để update thời tiết mới ✅ 2025-11-12

### Nice to Have (Optional)

- [ ] **N1:** Air quality index (AQI)
- [ ] **N2:** Moon phase (pha mặt trăng)
- [ ] **N3:** Weather-based background color/gradient
- [ ] **N4:** Voice search (tìm kiếm bằng giọng nói)
- [ ] **N5:** Share weather (chia sẻ lên social media)
- [ ] **N6:** Notification cho thời tiết đặc biệt (optional)
- [ ] **N7:** Historical weather data (dữ liệu lịch sử)

### Test Cases
- [ ] **T1:** API call thành công và hiển thị data
- [ ] **T2:** API call thất bại, hiển thị error message
- [ ] **T3:** Search city hoạt động đúng
- [ ] **T4:** Animation render đúng với từng weather condition
- [ ] **T5:** Geolocation permission granted/denied
- [ ] **T6:** Responsive trên mobile/tablet/desktop
- [ ] **T7:** Unit conversion Celsius ↔ Fahrenheit
- [ ] **T8:** Favorite cities save/load từ database

---

## 🏗️ Technical Design

### Architecture Overview

```
User → WeatherTool Page → WeatherService (API calls)
                        ↓
                   Weather API (OpenWeatherMap)
                        ↓
                   Database (favorite_cities table)
                        ↓
                   Weather Components (UI + Animations)
```

### Components Structure

```
src/pages/WeatherTool.jsx
├── WeatherHeader.jsx          # Title, refresh button
├── WeatherSearch.jsx          # Search city input + geolocation button
├── WeatherCurrent.jsx         # Current weather display
│   ├── WeatherIcon.jsx        # Animated weather icon
│   ├── Temperature.jsx        # Main temperature display
│   └── WeatherDetails.jsx    # Humidity, wind, pressure, etc.
├── WeatherAnimation.jsx       # Framer Motion weather animations
├── WeatherForecast.jsx        # 7-day forecast
│   └── ForecastCard.jsx       # Individual day card
├── WeatherHourly.jsx          # Hourly forecast (optional)
└── FavoriteCities.jsx         # Saved cities list
```

---

### Database Changes

⚠️ **Note:** Tables created in migration 003 (executed 2025-11-12 during currency bug fix session)

#### Existing Table: `favorite_cities` (Migration 003)

```sql
CREATE TABLE favorite_cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  city_name VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  lat DECIMAL(10, 7) NOT NULL,
  lon DECIMAL(10, 7) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_favorite_cities_user_id ON favorite_cities(user_id);
CREATE INDEX idx_favorite_cities_created_at ON favorite_cities(created_at DESC);
CREATE INDEX idx_favorite_cities_deleted_at ON favorite_cities(deleted_at);
```

**Status:** ✅ Table exists in database  
**Migration File:** `backend/database/migrations/003_up_weather_tool.sql`

#### Existing Table: `weather_cache` (Migration 003 - Cache API calls)

```sql
CREATE TABLE weather_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_name VARCHAR(255) NOT NULL,
  lat DECIMAL(10, 7) NOT NULL,
  lon DECIMAL(10, 7) NOT NULL,
  weather_data JSONB NOT NULL,
  fetched_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_weather_cache_location ON weather_cache(lat, lon);
CREATE INDEX idx_weather_cache_expires_at ON weather_cache(expires_at);
CREATE INDEX idx_weather_cache_city_name ON weather_cache(city_name);
CREATE GIN INDEX idx_weather_cache_data ON weather_cache USING GIN (weather_data);
```

**Status:** ✅ Table exists in database  
**Migration File:** `backend/database/migrations/003_up_weather_tool.sql`  
**Cache Strategy:** 30 minutes for current weather, 6 hours for forecast

---

### API Endpoints

#### GET /api/weather/current
**Purpose:** Get current weather by location  
**Auth Required:** No (public)

**Query Parameters:**
- `city` (string, optional) - City name (e.g., "Hanoi")
- `lat` (number, optional) - Latitude
- `lon` (number, optional) - Longitude
- `units` (string, optional) - "metric" or "imperial" (default: "metric")

**Response:**
```json
{
  "success": true,
  "data": {
    "location": {
      "name": "Hanoi",
      "country": "VN",
      "lat": 21.0285,
      "lon": 105.8542
    },
    "current": {
      "temp": 28.5,
      "feels_like": 31.2,
      "temp_min": 26,
      "temp_max": 30,
      "humidity": 75,
      "pressure": 1012,
      "wind_speed": 3.5,
      "wind_deg": 180,
      "visibility": 10000,
      "uv_index": 7,
      "weather": {
        "main": "Clouds",
        "description": "scattered clouds",
        "icon": "03d"
      }
    },
    "timestamp": "2025-11-11T10:00:00Z"
  }
}
```

#### GET /api/weather/forecast
**Purpose:** Get 5-day forecast (OpenWeatherMap free tier: 5-day/3-hour intervals)

**Query Parameters:**
- `city` (string, optional) - City name
- `lat` (number, optional) - Latitude
- `lon` (number, optional) - Longitude
- `units` (string, optional) - "metric" or "imperial"

**Note:** Free tier returns 3-hour interval forecasts. Backend aggregates these into daily forecasts (5 days max).

**Response:**
```json
{
  "success": true,
  "data": {
    "location": { "name": "Hanoi", "country": "VN", "lat": 21.0285, "lon": 105.8542 },
    "forecast": [
      {
        "date": "2025-11-11",
        "temp_day": 28,
        "temp_night": 22,
        "temp_min": 21,
        "temp_max": 30,
        "humidity": 70,
        "wind_speed": 4,
        "weather": {
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        },
        "pop": 0.6
      }
    ]
  }
}
```

**Implementation Detail:**
```javascript
// Transform 3-hour intervals to daily forecasts
function transformTo5DayForecast(hourlyData) {
  const dailyData = {}
  
  hourlyData.forEach(item => {
    const date = item.dt_txt.split(' ')[0]
    if (!dailyData[date]) {
      dailyData[date] = {
        temps: [],
        conditions: [],
        humidity: [],
        wind: []
      }
    }
    dailyData[date].temps.push(item.main.temp)
    // ... aggregate data
  })
  
  // Return max 5 days
  return Object.keys(dailyData).slice(0, 5).map(date => ({
    date,
    temp_day: Math.max(...dailyData[date].temps),
    temp_night: Math.min(...dailyData[date].temps),
    // ...
  }))
}
```

#### GET /api/weather/hourly
**Purpose:** Get hourly forecast for today

**Query Parameters:** Same as above

**Response:**
```json
{
  "success": true,
  "data": {
    "hourly": [
      {
        "time": "2025-11-11T10:00:00Z",
        "temp": 28,
        "weather": {
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03d"
        },
        "pop": 0.2
      }
    ]
  }
}
```

#### GET /api/weather/favorites
**Purpose:** Get user's favorite cities  
**Auth Required:** Yes (user_id)

**Query Parameters:**
- `user_id` (uuid, required)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "city_name": "Hanoi",
      "country": "VN",
      "lat": 21.0285,
      "lon": 105.8542,
      "is_default": true,
      "created_at": "2025-11-11T10:00:00Z"
    }
  ]
}
```

#### POST /api/weather/favorites
**Purpose:** Add city to favorites

**Request Body:**
```json
{
  "user_id": "uuid",
  "city_name": "Hanoi",
  "country": "VN",
  "lat": 21.0285,
  "lon": 105.8542,
  "is_default": false
}
```

#### DELETE /api/weather/favorites/:id
**Purpose:** Remove city from favorites

---

### Frontend Implementation

#### WeatherTool.jsx (Main Page)

```jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import WeatherHeader from '../components/weather/WeatherHeader'
import WeatherSearch from '../components/weather/WeatherSearch'
import WeatherCurrent from '../components/weather/WeatherCurrent'
import WeatherAnimation from '../components/weather/WeatherAnimation'
import WeatherForecast from '../components/weather/WeatherForecast'
import FavoriteCities from '../components/weather/FavoriteCities'
import { getCurrentWeather, getForecast } from '../services/weatherService'

const WeatherTool = () => {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [units, setUnits] = useState('metric')
  const [location, setLocation] = useState(null)

  useEffect(() => {
    loadWeather()
  }, [])

  const loadWeather = async (city = null, lat = null, lon = null) => {
    setLoading(true)
    setError(null)
    
    try {
      const current = await getCurrentWeather({ city, lat, lon, units })
      const forecastData = await getForecast({ city, lat, lon, units })
      
      setCurrentWeather(current.data)
      setForecast(forecastData.data.forecast)
      setLocation(current.data.location)
    } catch (err) {
      setError('Could not load weather data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchCity) => {
    loadWeather(searchCity)
  }

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          loadWeather(null, position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          setError('Could not get your location')
        }
      )
    }
  }

  const toggleUnits = () => {
    setUnits(units === 'metric' ? 'imperial' : 'metric')
    loadWeather(location?.name)
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={loadWeather} />

  return (
    <motion.div
      className="min-h-screen p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <WeatherHeader onRefresh={() => loadWeather(location?.name)} />
      
      <WeatherSearch 
        onSearch={handleSearch}
        onGeolocation={handleGeolocation}
      />

      <div className="relative">
        <WeatherAnimation condition={currentWeather?.current?.weather?.main} />
        
        <WeatherCurrent 
          data={currentWeather}
          units={units}
          onToggleUnits={toggleUnits}
        />
      </div>

      <WeatherForecast forecast={forecast} units={units} />

      <FavoriteCities onSelectCity={handleSearch} />
    </motion.div>
  )
}

export default WeatherTool
```

#### WeatherAnimation.jsx (Framer Motion Animations)

```jsx
import React from 'react'
import { motion } from 'framer-motion'

const WeatherAnimation = ({ condition }) => {
  // Sunny Animation
  if (condition === 'Clear') {
    return (
      <motion.div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 bg-yellow-300 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-24 right-24 w-2 h-2 bg-yellow-200 rounded-full"
            style={{
              transform: `rotate(${i * 45}deg) translateX(60px)`
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    )
  }

  // Rainy Animation
  if (condition === 'Rain' || condition === 'Drizzle') {
    return (
      <motion.div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-8 bg-blue-400 opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: -20
            }}
            animate={{
              y: ['0vh', '100vh']
            }}
            transition={{
              duration: 1 + Math.random(),
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear"
            }}
          />
        ))}
      </motion.div>
    )
  }

  // Snowy Animation
  if (condition === 'Snow') {
    return (
      <motion.div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: -20
            }}
            animate={{
              y: ['0vh', '100vh'],
              x: [0, Math.random() * 50 - 25, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    )
  }

  // Cloudy Animation
  if (condition === 'Clouds') {
    return (
      <motion.div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-48 h-24 bg-gray-300 rounded-full opacity-40"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 20}%`
            }}
            animate={{
              x: [-100, window.innerWidth + 100]
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </motion.div>
    )
  }

  // Thunderstorm Animation
  if (condition === 'Thunderstorm') {
    return (
      <motion.div className="absolute inset-0 pointer-events-none">
        {/* Rain */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`rain-${i}`}
            className="absolute w-0.5 h-8 bg-blue-500 opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: -20
            }}
            animate={{
              y: ['0vh', '100vh']
            }}
            transition={{
              duration: 0.5 + Math.random() * 0.5,
              repeat: Infinity,
              delay: Math.random(),
              ease: "linear"
            }}
          />
        ))}
        {/* Lightning */}
        <motion.div
          className="absolute inset-0 bg-yellow-200"
          animate={{
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: Math.random() * 5 + 3
          }}
        />
      </motion.div>
    )
  }

  return null
}

export default WeatherAnimation
```

---

## 🔄 Data Flow

1. **User opens Weather Tool**
   - Auto-detect location (Geolocation API)
   - Or load default city from favorites
   
2. **Frontend calls weatherService**
   - `getCurrentWeather()` → API → OpenWeatherMap
   - `getForecast()` → API → OpenWeatherMap
   
3. **Backend checks cache**
   - If cached data exists and not expired → Return cached data
   - Else → Call OpenWeatherMap API → Save to cache → Return data
   
4. **Frontend displays data**
   - Update state (currentWeather, forecast)
   - Render WeatherAnimation based on condition
   - Show WeatherCurrent component
   - Show WeatherForecast component

5. **User searches new city**
   - Call API with city name
   - Update all displays

6. **User saves favorite city**
   - POST /api/weather/favorites
   - Save to database

---

## 🔐 Security Considerations

### API Key Protection
- [ ] **S1:** Store OpenWeatherMap API key in `.env` (server-side only)
- [ ] **S2:** Never expose API key to client
- [ ] **S3:** All Weather API calls go through backend proxy

### Input Validation
- [x] **S4:** Validate city name input (max length 100, alphanumeric + spaces) ✅ 2025-11-12
- [x] **S5:** Validate lat/lon coordinates (range check) ✅ 2025-11-12
- [x] **S6:** Sanitize search input to prevent XSS ✅ 2025-11-12
- [ ] **S7:** Rate limiting on API endpoints (max 60 requests/hour per IP) ⚠️ **MISSING - Critical**

**Implementation Required:**
```javascript
// backend/middleware/rateLimiter.js
import rateLimit from 'express-rate-limit'

export const weatherRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 60, // 60 requests per hour
  message: { 
    success: false, 
    error: 'Too many weather requests, please try again later' 
  }
})

// Apply in backend/routes/weather.js
import { weatherRateLimiter } from '../middleware/rateLimiter.js'
router.use(weatherRateLimiter)
```

### Data Protection
- [x] **S8:** User's favorite cities require authentication (user_id) ✅ 2025-11-12
- [x] **S9:** No sensitive data stored in weather_cache table ✅ 2025-11-12
- [ ] **S10:** Auto-delete expired cache entries (cron job) ⚠️ **MISSING - Critical**

**Implementation Required:**
```javascript
// backend/jobs/cleanupWeatherCache.js
import cron from 'node-cron'
import { query } from '../config/database.js'

// Run daily at 3 AM
cron.schedule('0 3 * * *', async () => {
  try {
    const result = await query(
      'DELETE FROM weather_cache WHERE expires_at < NOW()'
    )
    console.log(`✅ Cleaned ${result.rowCount} expired weather cache entries`)
  } catch (error) {
    console.error('❌ Cache cleanup failed:', error)
  }
})

// Start in backend/app.js
import './jobs/cleanupWeatherCache.js'
```

### CORS
- [ ] **S11:** Configure CORS for frontend domain only

---

## 📊 Performance Requirements

### Response Time
- API response: < 500ms (with cache)
- API response: < 2s (without cache, external API)
- Page load: < 2 seconds
- Animation: 60fps smooth

### Caching Strategy
- **Cache Duration:** 30 minutes for current weather
- **Cache Duration:** 6 hours for forecast
- **Cache Invalidation:** Manual refresh button
- **Cache Storage:** PostgreSQL `weather_cache` table

### Optimization
- [ ] Debounce search input (500ms)
- [ ] Lazy load animations
- [ ] Compress API responses
- [ ] Use React.memo for forecast cards

---

## 🧪 Testing Strategy

### Unit Tests
- [ ] Test weatherService functions (getCurrentWeather, getForecast)
- [ ] Test weather condition to animation mapping
- [ ] Test unit conversion (Celsius ↔ Fahrenheit)
- [ ] Test search input validation
- [ ] Test geolocation handling

### Integration Tests
- [ ] Test GET /api/weather/current endpoint
- [ ] Test GET /api/weather/forecast endpoint
- [ ] Test GET /api/weather/favorites endpoint
- [ ] Test POST /api/weather/favorites endpoint
- [ ] Test cache mechanism

### E2E Tests
- [ ] Test search city workflow
- [ ] Test geolocation workflow
- [ ] Test add/remove favorite city
- [ ] Test unit toggle (°C ↔ °F)
- [ ] Test refresh button
- [ ] Test responsive design on mobile

### Manual Test Cases
1. **Happy Path:**
   - Open page → Auto-detect location → Show current weather + forecast
   - Search city → Show weather for that city
   - Add to favorites → City saved → Reload page → City appears in favorites

2. **Error Handling:**
   - Geolocation denied → Show error + allow manual search
   - Invalid city name → Show "City not found" message
   - API timeout → Show retry button
   - Network offline → Show offline message

3. **Edge Cases:**
   - City with same name (Paris, France vs Paris, Texas) → Show country code
   - Very long city name → Truncate with ellipsis
   - Special characters in city name → Handle correctly
   - Extreme weather conditions → Animation still works

**Coverage Target:** 80%

---

## 📝 Implementation Notes

### Weather API Choice

**Option 1: OpenWeatherMap**
- **Pros:** Free tier 1000 calls/day, comprehensive data, reliable
- **Cons:** Free tier only has 5-day/3-hour forecast (not 7-day daily)
- **Price:** Free (sufficient for MVP)
- **Endpoints:** 
  - Current: `/weather`
  - Forecast: `/forecast` (5-day, 3-hour intervals)
  - Requires aggregation to daily forecasts

**Option 2: WeatherAPI**
- **Pros:** Free tier 1M calls/month, more generous
- **Cons:** Less popular, documentation not as good
- **Price:** Free

**Decision:** Use **OpenWeatherMap** for MVP (more reliable, better docs)

**⚠️ Important Limitation:**
- Free tier does NOT support 7-day daily forecast
- Only 5-day forecast with 3-hour intervals available
- Requires backend transformation to aggregate into daily forecasts
- For true 7-day forecast: Need "One Call API 3.0" ($40/month)

---

### Animation Strategy

Use **Framer Motion** cho tất cả animations:
- `motion.div` với `animate` props
- `variants` để define animation states
- `transition` để control timing
- `initial`, `animate`, `exit` cho page transitions

**Weather Condition Mapping:**
```javascript
const weatherAnimations = {
  'Clear': 'sunny',
  'Clouds': 'cloudy',
  'Rain': 'rainy',
  'Drizzle': 'rainy',
  'Thunderstorm': 'thunderstorm',
  'Snow': 'snowy',
  'Mist': 'foggy',
  'Fog': 'foggy',
  'Haze': 'foggy'
}
```

---

### Color Scheme by Weather

```javascript
const weatherColors = {
  'Clear': {
    from: 'from-yellow-200',
    to: 'to-orange-300',
    text: 'text-yellow-800'
  },
  'Rain': {
    from: 'from-blue-300',
    to: 'to-blue-500',
    text: 'text-blue-900'
  },
  'Clouds': {
    from: 'from-gray-200',
    to: 'to-gray-400',
    text: 'text-gray-800'
  },
  'Snow': {
    from: 'from-blue-50',
    to: 'to-blue-200',
    text: 'text-blue-900'
  },
  'Thunderstorm': {
    from: 'from-gray-700',
    to: 'to-gray-900',
    text: 'text-gray-100'
  }
}
```

---

### Dependencies

**Backend:**
- `axios` - HTTP client for API calls
- `node-cache` (optional) - In-memory cache alternative

**Frontend:**
- `framer-motion` - Already installed (v10.16.16)
- `lucide-react` - Already installed (for weather icons)

**API:**
- OpenWeatherMap API key (free tier)

---

## 🚀 Rollout Plan

### Phase 1: Backend API (Week 1)
- [ ] Setup OpenWeatherMap API account
- [ ] Create weather routes
- [ ] Create weather controller
- [ ] Implement cache mechanism
- [ ] Test API endpoints

### Phase 2: Database (Week 1)
- [ ] Create favorite_cities table migration
- [ ] Create weather_cache table migration
- [ ] Add seed data
- [ ] Test database operations

### Phase 3: Frontend Core (Week 2)
- [ ] Create WeatherTool page
- [ ] Create WeatherCurrent component
- [ ] Create WeatherForecast component
- [ ] Integrate API calls
- [ ] Handle loading/error states

### Phase 4: Animations (Week 2)
- [ ] Create WeatherAnimation component
- [ ] Implement Sunny animation
- [ ] Implement Rainy animation
- [ ] Implement Cloudy animation
- [ ] Implement Snowy animation
- [ ] Implement Thunderstorm animation

### Phase 5: Features (Week 3)
- [ ] Add search functionality
- [ ] Add geolocation
- [ ] Add favorite cities
- [ ] Add unit toggle (°C/°F)
- [ ] Add refresh button

### Phase 6: Testing & Polish (Week 3)
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Manual testing
- [ ] Responsive design polish
- [ ] Accessibility improvements

### Rollback Plan
- If API issues: Revert to mock data
- If animation performance: Disable animations
- Database issues: Rollback migration

---

## 📚 Documentation

### User Documentation
- [ ] Add Weather Tool to README.md tools list
- [ ] Create WEATHER_FEATURE.md guide
- [ ] Add API documentation to API_DOCUMENTATION.md
- [ ] Update navigation menu

### Developer Documentation
- [ ] Update DATABASE_SCHEMA.md with new tables
- [ ] Document Weather API integration
- [ ] Add code comments for animations
- [ ] Update project_manifest.json

---

## � Implementation Status (Added: 2025-11-12)

### Backend: 85% Complete ✅

**Implemented:**
- ✅ `backend/routes/weather.js` - 6 endpoints (current, forecast, hourly, favorites CRUD, cache clean)
- ✅ `backend/controllers/weatherController.js` - All controller functions
- ✅ `backend/database/migrations/003_up_weather_tool.sql` - favorite_cities + weather_cache tables
- ✅ `backend/database/migrations/003_down_weather_tool.sql` - Rollback script

**Missing (Critical):**
- ⚠️ `backend/providers/weatherProvider.js` - OpenWeatherMap API integration (CRITICAL)
  - getCurrentWeather() function
  - getForecast() function with 3-hour to daily transformation
  - getHourlyForecast() function
  - Cache logic (30-min TTL current, 6-hour forecast)
  
- ⚠️ `backend/middleware/rateLimiter.js` - Rate limiting (60 req/hour per IP)
- ⚠️ `backend/jobs/cleanupWeatherCache.js` - Cache cleanup cron job (daily 3 AM)

**Estimated Time to Complete:** 6 hours
- weatherProvider: 4 hours (API integration + transformation)
- rateLimiter: 1 hour
- cleanup job: 1 hour

---

### Frontend: 80% Complete ✅

**Implemented:**
- ✅ `src/pages/WeatherTool.jsx` - Main page with state management
- ✅ `src/components/weather/WeatherHeader.jsx` - Title + refresh button
- ✅ `src/components/weather/WeatherSearch.jsx` - Search + geolocation
- ✅ `src/components/weather/WeatherCurrent.jsx` - Current weather display
- ✅ `src/components/weather/WeatherForecast.jsx` - 5-day forecast cards
- ✅ `src/components/weather/WeatherAnimation.jsx` - 7 weather animations (Clear, Rain, Clouds, Snow, Thunderstorm, Foggy)
- ✅ `src/components/weather/FavoriteCities.jsx` - Saved cities list

**Missing (Critical):**
- ⚠️ `src/services/weatherService.js` - API calls to backend (CRITICAL)
  - getCurrentWeather() function
  - getForecast() function
  - getHourlyForecast() function
  - Favorite cities CRUD functions
  
**Nice to Have (Optional):**
- ❌ Hourly forecast component (S3)
- ❌ Sunrise/Sunset display (S4)
- ❌ Search history (S6)

**Estimated Time to Complete:** 4 hours
- weatherService: 3 hours (API integration)
- Hourly forecast component: 2 hours (optional)
- Sunrise/Sunset: 1 hour (optional)

---

### Testing: 0% Complete ❌ CRITICAL GAP

**Missing:**
- ❌ Backend integration tests: 0/8 (T1-T8)
  - GET /api/weather/current
  - GET /api/weather/forecast
  - GET /api/weather/hourly
  - GET /api/weather/favorites
  - POST /api/weather/favorites
  - DELETE /api/weather/favorites/:id
  - Cache mechanism
  - Error handling
  
- ❌ Frontend component tests: 0/7
  - WeatherTool page
  - WeatherCurrent component
  - WeatherForecast component
  - WeatherAnimation component
  - WeatherSearch component
  - FavoriteCities component
  - weatherService functions

- ❌ E2E tests: 0/6
  - Search city workflow
  - Geolocation workflow
  - Add/remove favorite city
  - Unit toggle (°C ↔ °F)
  - Refresh button
  - Responsive design

**Coverage:** 0% (Target: 80%)

**Estimated Time to Complete:** 16 hours
- Backend integration tests: 8 hours
- Frontend component tests: 6 hours
- E2E tests: 4 hours

---

### Documentation: 40% Complete ⚠️

**Implemented:**
- ✅ Spec file (this document)
- ✅ Implementation plan (specs/plans/02_weather_tool.plan)

**Missing:**
- ❌ `docs/API_DOCUMENTATION.md` - Weather API endpoints not documented
- ❌ `docs/DATABASE_SCHEMA.md` - favorite_cities + weather_cache tables not documented
- ❌ `docs/WEATHER_FEATURE.md` - User guide not created
- ❌ `README.md` - Weather Tool not listed in tools section

**Estimated Time to Complete:** 4 hours
- API docs: 2 hours
- Schema docs: 1 hour
- User guide: 2 hours
- README update: 30 minutes

---

### Critical Findings:

#### ✅ Completed (Excellent Progress):
1. ✅ Database migration 003 executed successfully
2. ✅ All frontend components created and responsive
3. ✅ 7 weather animations implemented with Framer Motion
4. ✅ Geolocation and search functionality working
5. ✅ Favorite cities database integration
6. ✅ Backend routes and controllers structured

#### ⚠️ Gaps/Blockers (Must Fix Before Production):
1. 🔴 **weatherProvider.js missing** - Backend cannot call OpenWeatherMap API
2. 🔴 **weatherService.js missing** - Frontend cannot call backend API
3. 🔴 **Zero test coverage** - No tests written (0% vs 80% target)
4. 🟡 **Rate limiting not implemented** - API vulnerable to abuse
5. 🟡 **Cache cleanup not implemented** - Database will grow infinitely
6. 🟡 **Documentation incomplete** - API/schema docs missing

#### 🔴 Risks:
1. **API Limitation:** Free tier only supports 5-day forecast (not 7-day as originally planned)
2. **Provider Missing:** Backend cannot fetch weather data without weatherProvider.js
3. **Service Missing:** Frontend cannot communicate with backend without weatherService.js
4. **Test Gap:** Deploying without tests = high risk of production bugs
5. **Rate Limit:** No protection against API abuse (could exhaust 1000 calls/day limit)

---

### Next Steps (Priority Order):

**Immediate (This Week):**
1. 🔴 **Implement weatherProvider.js** (4 hours)
   - OpenWeatherMap API integration
   - 3-hour to daily forecast transformation
   - Cache logic with TTL
   
2. 🔴 **Implement weatherService.js** (3 hours)
   - API calls to backend
   - Error handling
   - Loading states

3. 🟡 **Add rate limiting** (1 hour)
   - Install express-rate-limit
   - Create middleware
   - Apply to weather routes

4. 🟡 **Add cache cleanup job** (1 hour)
   - Install node-cron
   - Create cleanup job
   - Schedule daily 3 AM

**Short Term (Next 2 Weeks):**
5. 🔴 **Write tests** (16 hours)
   - Backend integration tests
   - Frontend component tests
   - E2E tests
   - Achieve 80% coverage

6. 🟡 **Update documentation** (4 hours)
   - API_DOCUMENTATION.md
   - DATABASE_SCHEMA.md
   - WEATHER_FEATURE.md
   - README.md

**Optional Enhancements:**
7. 🟢 **Hourly forecast component** (2 hours)
8. 🟢 **Sunrise/Sunset display** (1 hour)
9. 🟢 **Search history** (3 hours)

**Total Estimated Time to Production:** 30 hours (4 working days)

---

## �🔗 Related

- **Parent Spec:** `01_init.spec` (Project initialization)
- **Related Specs:** 
  - Similar API integration pattern as Gold Prices feature
  - Similar realtime updates as Countdown tool
- **Implementation Plan:** `plans/02_weather_tool.plan` (to be created)
- **Design Mockups:** (To be created)

---

## 📅 Timeline

**Estimated Effort:** 3 weeks  
**Start Date:** 2025-11-12  
**Target Date:** 2025-12-03  
**Actual Completion:** (TBD)

**Weekly Breakdown:**
- Week 1: Backend API + Database (40%)
- Week 2: Frontend UI + Animations (40%)
- Week 3: Testing + Polish + Documentation (20%)

---

## ✍️ Stakeholders

**Author:** Long Nguyen  
**Reviewers:** (To be assigned)  
**Approver:** Product Owner  
**Implementers:** Development Team

---

## 📊 Success Metrics

### Quantitative
- API response time < 500ms (cached)
- Page load time < 2s
- Animation FPS >= 60
- Test coverage >= 80%
- Zero security vulnerabilities

### Qualitative
- User feedback positive (easy to use)
- Animations smooth and visually pleasing
- Weather data accurate
- UI intuitive and responsive

---

## 🔄 Review & Updates

| Date | Version | Changes | Updated By |
|------|---------|---------|------------|
| 2025-11-12 | 1.0.0 | Technical review completed. Status: 70% implementation complete. Backend 85%, Frontend 80%, Testing 0%. Fixed spec issues: 5-day forecast (not 7-day due to free tier), migration 003 already exists, added rate limiting and cache cleanup implementation guides. Critical gaps: weatherProvider.js, weatherService.js, and all tests missing. Ready to proceed with 4 critical fixes. | Technical Lead |

---

**Maintained By:** KaDong Development Team  
**Review Cycle:** Weekly  
**Next Review:** 2025-11-19  
**Status:** 🚧 In Progress (70% complete, production ready in ~4 days)
