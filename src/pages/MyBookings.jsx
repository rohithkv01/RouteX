import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../api/axios'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import useAuthStore from '../store/authStore'

const TABS = ['upcoming', 'completed', 'cancelled']

export default function MyBookings() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('upcoming')
  const [cancelId, setCancelId] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    api.get('/bookings/my')
      .then(r => setBookings(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const filtered = bookings.filter(b => {
    if (tab === 'upcoming') return b.status === 'confirmed' || b.status === 'pending'
    if (tab === 'completed') return b.status === 'completed'
    return b.status === 'cancelled'
  })

  const handleCancel = async (id) => {
    try {
      await api.delete(`/bookings/${id}`, { data: { reason: 'User cancelled' } })
      toast.success('Booking cancelled. Refund will be processed.')
      setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b))
      setCancelId(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 60px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 }}>My Bookings</h1>
          <p style={{ color: '#71717a', fontSize: 14, marginBottom: 28 }}>Manage your upcoming and past trips</p>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: 4 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 13, fontWeight: 600, textTransform: 'capitalize', transition: 'all 0.15s',
                background: tab === t ? '#ef233c' : 'transparent', color: tab === t ? '#fff' : '#71717a',
              }}>{t}</button>
          ))}
        </div>

        {loading ? (
          [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 14, marginBottom: 12 }} />)
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎫</div>
            <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>No {tab} bookings</h3>
            <p style={{ color: '#71717a', fontSize: 13 }}>{tab === 'upcoming' ? 'Book your next trip now!' : 'Nothing here yet.'}</p>
          </div>
        ) : (
          filtered.map((b, i) => {
            const route = b.routeId || {}
            return (
              <motion.div key={b._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card" style={{ padding: 20, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>{route.from} → {route.to}</span>
                      <span className={`badge ${b.status === 'confirmed' || b.status === 'pending' ? 'badge-green' : b.status === 'cancelled' ? 'badge-red' : 'badge-yellow'}`}>
                        {b.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#71717a' }}>{route.operator} • {route.vehicleType}</div>
                    <div style={{ fontSize: 12, color: '#52525b', marginTop: 4 }}>
                      PNR: <span style={{ fontFamily: 'monospace', color: '#ef233c', fontWeight: 600 }}>{b.pnr}</span>
                      {' • '}{b.journeyDate ? new Date(b.journeyDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                    </div>
                    <div style={{ fontSize: 12, color: '#52525b', marginTop: 2 }}>
                      {b.passengers?.length} passenger{b.passengers?.length !== 1 ? 's' : ''} • Seats: {b.passengers?.map(p => p.seatNumber).join(', ')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#ef233c', fontFamily: 'Manrope,sans-serif' }}>₹{b.fare?.total || 0}</div>
                    {(b.status === 'confirmed' || b.status === 'pending') && (
                      <button onClick={() => setCancelId(b._id)}
                        style={{ marginTop: 8, padding: '6px 14px', borderRadius: 6, background: 'rgba(239,35,60,0.08)', border: '1px solid rgba(239,35,60,0.2)', color: '#ef233c', fontSize: 11, fontWeight: 600 }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Cancel confirmation */}
                {cancelId === b._id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    style={{ marginTop: 12, padding: 16, background: 'rgba(239,35,60,0.05)', border: '1px solid rgba(239,35,60,0.2)', borderRadius: 10 }}>
                    <p style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 12 }}>Are you sure? You'll receive a <strong style={{ color: '#22c55e' }}>90% refund</strong> within 5-7 business days.</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleCancel(b._id)} style={{ padding: '8px 18px', borderRadius: 6, background: '#ef233c', color: '#fff', fontSize: 12, fontWeight: 600 }}>Yes, Cancel</button>
                      <button onClick={() => setCancelId(null)} style={{ padding: '8px 18px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#a1a1aa', fontSize: 12 }}>Keep Booking</button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })
        )}
      </div>
      <Footer />
    </div>
  )
}
