import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import api from '../api/axios'
import Navbar from '../components/layout/Navbar'
import useBookingStore from '../store/bookingStore'

export default function Confirmation() {
  const { bookingId } = useParams()
  const { reset } = useBookingStore()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const end = Date.now() + 2000
    const colors = ['#ef233c', '#ffffff', '#ff6b6b']
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors })
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
    api.get(`/bookings/${bookingId}`)
      .then(r => setBooking(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
    return () => reset()
  }, [bookingId])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navbar />
        <div className="animate-spin" style={{ width: 40, height: 40, border: '3px solid rgba(239,35,60,0.2)', borderTop: '3px solid #ef233c', borderRadius: '50%' }} />
      </div>
    )
  }

  const route = booking?.routeId || {}

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <Navbar />
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '120px 24px 60px' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 36 }}>✓</div>
          <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: '#22c55e', marginBottom: 4 }}>Booking Confirmed!</h1>
          <p style={{ color: '#71717a', fontSize: 14 }}>Your ticket has been booked successfully</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="ticket-card">
          <div style={{ background: 'linear-gradient(135deg, rgba(239,35,60,0.15), rgba(239,35,60,0.05))', padding: '20px 28px', borderBottom: '1px dashed rgba(239,35,60,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 14, height: 14, background: '#ef233c', transform: 'rotate(45deg)', borderRadius: 3 }} />
              <span className="font-display" style={{ fontWeight: 800, fontSize: 16 }}>RouteX</span>
            </div>
            <span className="badge badge-green">✓ Confirmed</span>
          </div>
          <div style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 10, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>PNR</div>
                <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 800, color: '#ef233c', letterSpacing: 3 }}>{booking?.pnr || 'N/A'}</div>
              </div>
              {booking?.qrCode && <img src={booking.qrCode} alt="QR" style={{ width: 64, height: 64, borderRadius: 8 }} />}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: '14px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Manrope,sans-serif' }}>{route.departureTime || '--'}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{route.from}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                <span style={{ fontSize: 10, color: '#52525b' }}>{route.duration}</span>
                <div style={{ width: '100%', height: 1, background: 'linear-gradient(to right, transparent, #ef233c, transparent)' }} />
                <span style={{ fontSize: 10, color: '#52525b' }}>{route.operator}</span>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Manrope,sans-serif' }}>{route.arrivalTime || '--'}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{route.to}</div>
              </div>
            </div>
            {booking?.passengers?.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: 13 }}>
                <span style={{ fontWeight: 500 }}>{p.name} ({p.gender}, {p.age}y)</span>
                <span style={{ color: '#a1a1aa' }}>Seat {p.seatNumber}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <span style={{ fontSize: 12, color: '#52525b' }}>{booking?.journeyDate ? new Date(booking.journeyDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' }) : ''}</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#ef233c', fontFamily: 'Manrope' }}>₹{booking?.fare?.total || 0}</span>
            </div>
          </div>
        </motion.div>

        <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'center' }}>
          <Link to="/bookings" style={{ padding: '12px 24px', borderRadius: 10, background: '#ef233c', color: '#fff', fontSize: 13, fontWeight: 700 }}>My Bookings</Link>
          <Link to="/" style={{ padding: '12px 24px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#a1a1aa', fontSize: 13, fontWeight: 600 }}>Book Another</Link>
        </div>
      </div>
    </div>
  )
}
