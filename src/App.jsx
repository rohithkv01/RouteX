import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import SeatSelection from './pages/SeatSelection'
import TravellerDetails from './pages/TravellerDetails'
import ReviewBill from './pages/ReviewBill'
import Payment from './pages/Payment'
import Confirmation from './pages/Confirmation'
import MyBookings from './pages/MyBookings'
import Login from './pages/Login'
import Register from './pages/Register'
import OAuthCallback from './pages/OAuthCallback'

// Inline splash so it renders INSIDE BrowserRouter (needs useNavigate)
function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1900)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'radial-gradient(ellipse at center, #1a0505 0%, #000 70%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', zIndex: 9999,
    }}>
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(239,35,60,0.06)', filter: 'blur(60px)' }} />
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#ef233c,#b91c1c)', transform: 'rotate(45deg)', borderRadius: 6, boxShadow: '0 0 30px rgba(239,35,60,0.6)' }} />
          <span style={{ fontFamily: 'Manrope,sans-serif', fontSize: 52, fontWeight: 800, letterSpacing: '-2px', background: 'linear-gradient(to bottom,#fff,rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            RouteX
          </span>
        </div>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, color: 'rgba(161,161,170,0.9)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Your Journey, Redefined.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {[0, 1, 2].map(i => (
            <motion.div key={i}
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef233c' }} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

function AppRoutes() {
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('splashSeen'))

  if (showSplash) {
    return <SplashScreen onDone={() => { sessionStorage.setItem('splashSeen', '1'); setShowSplash(false) }} />
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/seats/:routeId" element={<SeatSelection />} />
        <Route path="/travellers" element={<TravellerDetails />} />
        <Route path="/review" element={<ReviewBill />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirmation/:bookingId" element={<Confirmation />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/splash" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{
        style: { background: '#141414', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Inter, sans-serif', fontSize: 14 },
        success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef233c', secondary: '#fff' } },
      }} />
      <AppRoutes />
    </BrowserRouter>
  )
}
