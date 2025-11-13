import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

// Shared Components
import Header from '../shared/components/Header'
import SidebarMenu from '../shared/components/SidebarMenu'
import Footer from '../shared/components/Footer'

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
                <Route path="/" element={<HomePage />} />
                <Route path="/countdown" element={<CountdownPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/currency" element={<CurrencyPage />} />
                <Route path="/fashion" element={<FashionPage />} />
                <Route path="/gold" element={<GoldPricesPage />} />
                <Route path="/weather" element={<WeatherPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/wedding-invitation" element={<WeddingPage />} />
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
