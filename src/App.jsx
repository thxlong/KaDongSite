import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import SidebarMenu from './components/SidebarMenu'
import Footer from './components/Footer'
import Home from './pages/Home'
import CountdownTool from './pages/CountdownTool'
import CalendarTool from './pages/CalendarTool'
import NotesTool from './pages/NotesTool'
import CurrencyTool from './pages/CurrencyTool'
import FashionTool from './pages/FashionTool'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 flex-col lg:flex-row">
          <SidebarMenu />
          <main className="flex-1 p-4 lg:p-8">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/countdown" element={<CountdownTool />} />
                <Route path="/calendar" element={<CalendarTool />} />
                <Route path="/notes" element={<NotesTool />} />
                <Route path="/currency" element={<CurrencyTool />} />
                <Route path="/fashion" element={<FashionTool />} />
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
