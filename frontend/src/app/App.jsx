import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

// Shared Components
import Header from '../shared/components/Header'
import SidebarMenu from '../shared/components/SidebarMenu'
import Footer from '../shared/components/Footer'
import PrivateRoute from '../shared/components/PrivateRoute'

// Feature Pages
import HomePage from '../features/home/HomePage'
import CountdownPage from '../features/countdown/CountdownPage'
import CalendarPage from '../features/calendar/CalendarPage'
import NotesPage from '../features/notes/NotesPage'
import CurrencyPage from '../features/currency/CurrencyPage'
import FashionPage from '../features/fashion/FashionPage'
import GoldPricesPage from '../features/gold/GoldPricesPage'
import WeatherPage from '../features/weather/WeatherPage'
import WishlistPage from '../features/wishlist/WishlistPage'
import WeddingPage from '../features/wedding/WeddingPage'

// Auth Pages
import LoginPage from '../features/auth/LoginPage'
import RegisterPage from '../features/auth/RegisterPage'
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage'
import ResetPasswordPage from '../features/auth/ResetPasswordPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Toaster position="top-right" />
        <Header />
        <div className="flex flex-1 flex-col lg:flex-row">
          <SidebarMenu />
          <main className="flex-1 p-4 lg:p-8">
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/wedding-invitation" element={<WeddingPage />} />
                
                {/* Protected Routes - Require Authentication */}
                <Route path="/countdown" element={<PrivateRoute><CountdownPage /></PrivateRoute>} />
                <Route path="/calendar" element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
                <Route path="/notes" element={<PrivateRoute><NotesPage /></PrivateRoute>} />
                <Route path="/currency" element={<PrivateRoute><CurrencyPage /></PrivateRoute>} />
                <Route path="/fashion" element={<PrivateRoute><FashionPage /></PrivateRoute>} />
                <Route path="/gold" element={<PrivateRoute><GoldPricesPage /></PrivateRoute>} />
                <Route path="/weather" element={<PrivateRoute><WeatherPage /></PrivateRoute>} />
                <Route path="/wishlist" element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
