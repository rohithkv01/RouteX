import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../api/axios'
import Navbar from '../components/layout/Navbar'
import useBookingStore from '../store/bookingStore'
import useAuthStore from '../store/authStore'

const STEPS = ['Search', 'Seats', 'Details', 'Review', 'Payment']
const CURRENT = 3

export default function ReviewBill() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { selectedRoute, selectedSeats, passengers, contactInfo, fare, coupon, applyCoupon, removeCoupon, calculateFare, setBookingId } = useBookingStore()
  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [cancelOpen, setCancelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    setCouponError('')
    try {
      const res = await api.post('/coupons/apply', { code: couponCode, amount: fare.base, type: selectedRoute?.type })
      applyCoupon({ code: res.data.coupon.code, discount: res.data.discount })
      toast.success(`Coupon applied! ₹${res.data.discount} off`)
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon')
      toast.error(err.response?.data?.message || 'Invalid coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleProceed = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue')
      navigate('/login')
      return
    }
    setLoading(true)
    try {
      const searchParams = useBookingStore.getState().searchParams
      const bookingData = {
        routeId: selectedRoute._id,
        journeyDate: searchParams?.date || new Date().toISOString().split('T')[0],
        passengers,
        contactEmail: contactInfo.email,
        contactPhone: contactInfo.phone,
        fare,
        couponCode: coupon?.code || null,
      }
      const res = await api.post('/bookings', bookingData)
      setBookingId(res.data.data._id)
      navigate('/payment')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  if (!selectedRoute || selectedSeats.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h2 className="font-display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Nothing to review</h2>
          <p style={{ color: '#71717a', marginBottom: 24 }}>Start a new search to book tickets.</p>
          <button onClick={() => navigate('/')} style={{ padding: '12px 28px', borderRadius: 8, background: '#ef233c', color: '#fff', fontSize: 14, fontWeight: 600 }}>Go Home</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 60px' }}>
        {/* Progress */}
        <div className="progress-bar" style={{ marginBottom: 40 }}>
          {STEPS.map((s, i) => (
            <div key={s} className={`progress-step ${i < CURRENT ? 'done' : i === CURRENT ? 'active' : ''}`}>{s}</div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#ef233c', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step 4</span>
          <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-1px', marginTop: 4, marginBottom: 32 }}>Review & Pay</h1>
        </motion.div>

        {/* Journey Details */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="glass-card" style={{ padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, color: '#ef233c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Journey Details</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>
                {selectedRoute.from} <span style={{ color: '#ef233c' }}>→</span> {selectedRoute.to}
              </div>
              <div style={{ color: '#71717a', fontSize: 13, marginTop: 4 }}>
                {selectedRoute.operator} • {selectedRoute.vehicleType}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#52525b', marginBottom: 2 }}>DEPARTS</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>{selectedRoute.departureTime}</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.06)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#52525b', marginBottom: 2 }}>ARRIVES</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>{selectedRoute.arrivalTime}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Passengers Table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card" style={{ padding: 24, marginBottom: 16, overflow: 'auto' }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, color: '#ef233c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Passengers</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Name', 'Age', 'Gender', 'Seat', 'Price'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 600, color: '#52525b', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {passengers.map((p, i) => {
                const seatInfo = selectedSeats.find(s => s.seatNumber === p.seatNumber)
                return (
                  <tr key={i}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{p.name}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#a1a1aa', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{p.age}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#a1a1aa', borderBottom: '1px solid rgba(255,255,255,0.03)', textTransform: 'capitalize' }}>{p.gender}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{p.seatNumber}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#ef233c', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>₹{seatInfo?.price || 0}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </motion.div>

        {/* Coupon */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card" style={{ padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, color: '#ef233c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>🎫 Apply Coupon</h3>
          {coupon ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10 }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#22c55e', fontFamily: 'monospace' }}>{coupon.code}</span>
                <span style={{ fontSize: 12, color: '#71717a', marginLeft: 12 }}>-₹{coupon.discount} applied</span>
              </div>
              <button onClick={() => { removeCoupon(); setCouponCode('') }}
                style={{ fontSize: 12, color: '#ef233c', fontWeight: 600, padding: '6px 12px', borderRadius: 6, background: 'rgba(239,35,60,0.1)', border: '1px solid rgba(239,35,60,0.2)' }}>
                Remove
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input-flat" placeholder="Enter coupon code"
                value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                style={{ flex: 1, fontFamily: 'monospace', letterSpacing: 2, borderColor: couponError ? '#ef233c' : undefined }} />
              <button onClick={handleApplyCoupon} disabled={couponLoading}
                style={{ padding: '0 24px', borderRadius: 8, background: '#ef233c', color: '#fff', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', opacity: couponLoading ? 0.6 : 1 }}>
                {couponLoading ? '...' : 'Apply'}
              </button>
            </div>
          )}
          {couponError && !coupon && <span style={{ fontSize: 11, color: '#ef233c', marginTop: 6, display: 'block' }}>{couponError}</span>}
        </motion.div>

        {/* Fare Breakdown */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card" style={{ padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, color: '#ef233c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Fare Breakdown</h3>
          {[
            [`Base Fare (${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''})`, `₹${fare.base}`],
            ['GST (5%)', `₹${fare.gst}`],
            ['Convenience Fee', `₹${fare.convenienceFee}`],
            ...(fare.discount > 0 ? [['Coupon Discount', `-₹${fare.discount}`, '#22c55e']] : []),
          ].map(([label, val, color]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ fontSize: 14, color: '#a1a1aa' }}>{label}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: color || '#fff' }}>{val}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '1px dashed rgba(239,35,60,0.3)' }}>
            <span style={{ fontSize: 18, fontWeight: 700 }}>Total Amount</span>
            <span style={{ fontSize: 28, fontWeight: 800, color: '#ef233c', fontFamily: 'Manrope,sans-serif' }}>₹{fare.total}</span>
          </div>
        </motion.div>

        {/* Cancellation Policy */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-card" style={{ padding: 0, marginBottom: 32, overflow: 'hidden' }}>
          <button onClick={() => setCancelOpen(!cancelOpen)}
            style={{ width: '100%', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', color: '#a1a1aa', fontSize: 13, fontWeight: 600 }}>
            <span>📋 Cancellation Policy</span>
            <span style={{ transform: cancelOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', fontSize: 12 }}>▼</span>
          </button>
          {cancelOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ padding: '0 24px 20px' }}>
              <div style={{ fontSize: 13, color: '#71717a', lineHeight: 1.8 }}>
                <p>• Cancel before 24 hours of departure: <strong style={{ color: '#22c55e' }}>90% refund</strong></p>
                <p>• Cancel 12-24 hours before departure: <strong style={{ color: '#f59e0b' }}>50% refund</strong></p>
                <p>• Cancel within 12 hours of departure: <strong style={{ color: '#ef233c' }}>No refund</strong></p>
                <p style={{ marginTop: 8, fontSize: 11, color: '#52525b' }}>Refunds are processed within 5-7 business days to the original payment method.</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <button onClick={() => navigate(-1)}
            style={{ padding: '14px 28px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#a1a1aa', fontSize: 14, fontWeight: 600 }}>
            ← Back
          </button>
          <button onClick={handleProceed} disabled={loading}
            className="shiny-cta" style={{ padding: '14px 40px', fontSize: 15, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Creating Booking...' : `Proceed to Pay ₹${fare.total} →`}
          </button>
        </div>
      </div>
    </div>
  )
}
