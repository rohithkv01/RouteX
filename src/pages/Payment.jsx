import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../api/axios'
import Navbar from '../components/layout/Navbar'
import useBookingStore from '../store/bookingStore'

const STEPS = ['Search', 'Seats', 'Details', 'Review', 'Payment']
const CURRENT = 4

const isDemoMode = !import.meta.env.VITE_RAZORPAY_KEY_ID ||
  import.meta.env.VITE_RAZORPAY_KEY_ID === 'rzp_test_YOUR_KEY_ID'

export default function Payment() {
  const navigate = useNavigate()
  const { fare, bookingId, selectedRoute } = useBookingStore()
  const [processing, setProcessing] = useState(false)
  const [failed, setFailed] = useState(false)
  const [demoStep, setDemoStep] = useState(0) // 0=idle, 1=processing, 2=done

  // ─── Demo Payment (no Razorpay keys) ────────────────────────────────────────
  const handleDemoPayment = async () => {
    setProcessing(true)
    setDemoStep(1)
    try {
      // Create a fake order on backend to get an order id
      let orderId = `demo_order_${Date.now()}`
      try {
        const orderRes = await api.post('/payment/create-order', { amount: fare.total })
        orderId = orderRes.data.order?.id || orderId
      } catch { /* backend may fail with placeholder keys, that's fine */ }

      // Confirm booking directly with demo payment id
      await api.put(`/bookings/${bookingId}/confirm`, {
        paymentId: `demo_pay_${Date.now()}`,
        razorpayOrderId: orderId,
        razorpaySignature: 'demo_signature',
      })
      setDemoStep(2)
      toast.success('Demo payment successful! 🎉')
      setTimeout(() => navigate(`/confirmation/${bookingId}`), 800)
    } catch (err) {
      setFailed(true)
      toast.error(err.response?.data?.message || 'Payment failed. Try again.')
    } finally {
      setProcessing(false)
    }
  }

  // ─── Real Razorpay Payment ───────────────────────────────────────────────────
  const handleRazorpayPayment = async () => {
    if (!bookingId) { toast.error('No booking found.'); navigate('/'); return }
    setProcessing(true)
    setFailed(false)
    try {
      const orderRes = await api.post('/payment/create-order', { amount: fare.total })
      const order = orderRes.data.order
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'RouteX',
        description: `${selectedRoute?.from} → ${selectedRoute?.to}`,
        order_id: order.id,
        theme: { color: '#ef233c' },
        prefill: {
          name: useBookingStore.getState().passengers[0]?.name || '',
          email: useBookingStore.getState().contactInfo.email || '',
          contact: useBookingStore.getState().contactInfo.phone || '',
        },
        handler: async (response) => {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            await api.put(`/bookings/${bookingId}/confirm`, {
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            })
            toast.success('Payment successful!')
            navigate(`/confirmation/${bookingId}`)
          } catch {
            setFailed(true)
            toast.error('Payment verification failed')
          }
          setProcessing(false)
        },
        modal: { ondismiss: () => { setProcessing(false); toast.error('Payment cancelled') } },
      }
      if (window.Razorpay) {
        new window.Razorpay(options).open()
      } else {
        handleDemoPayment()
      }
    } catch (err) {
      setProcessing(false)
      setFailed(true)
      toast.error(err.response?.data?.message || 'Payment failed')
    }
  }

  const handlePayment = isDemoMode ? handleDemoPayment : handleRazorpayPayment

  if (!bookingId) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1.5" style={{ margin: '0 auto 16px', display: 'block' }}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          <h2 className="font-display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>No active booking</h2>
          <p style={{ color: '#71717a', marginBottom: 24 }}>Please complete the booking flow first.</p>
          <button onClick={() => navigate('/')} style={{ padding: '12px 28px', borderRadius: 8, background: '#ef233c', color: '#fff', fontSize: 14, fontWeight: 600 }}>Go Home</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '120px 24px 60px' }}>
        {/* Progress */}
        <div className="progress-bar" style={{ marginBottom: 40 }}>
          {STEPS.map((s, i) => (
            <div key={s} className={`progress-step ${i < CURRENT ? 'done' : i === CURRENT ? 'active' : ''}`}>{s}</div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
            {/* Icon */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 28 }}>
              <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: 'rgba(239,35,60,0.15)', filter: 'blur(30px)' }} />
              <div style={{ position: 'relative', width: 72, height: 72, borderRadius: '50%', background: demoStep === 2 ? 'rgba(34,197,94,0.1)' : 'rgba(239,35,60,0.1)', border: `2px solid ${demoStep === 2 ? 'rgba(34,197,94,0.4)' : 'rgba(239,35,60,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {demoStep === 2
                  ? <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef233c" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                }
              </div>
            </div>

            <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              {demoStep === 2 ? 'Payment Successful!' : 'Complete Payment'}
            </h2>
            <p style={{ color: '#71717a', fontSize: 13, marginBottom: 28 }}>
              {selectedRoute?.from} → {selectedRoute?.to} • {selectedRoute?.operator}
            </p>

            {/* Demo mode banner */}
            {isDemoMode && (
              <div style={{ padding: '10px 16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, marginBottom: 24, fontSize: 12, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                Demo Mode — Add Razorpay test keys to <code style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4 }}>.env</code> for real payments
              </div>
            )}

            {/* Amount */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Total Amount</div>
              <div className="font-display" style={{ fontSize: 48, fontWeight: 800, color: '#ef233c' }}>₹{fare.total}</div>
            </div>

            {/* Payment methods preview */}
            {!isDemoMode && (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
                {['UPI', 'Cards', 'NetBanking', 'Wallets'].map(m => (
                  <span key={m} style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 11, fontWeight: 600, color: '#71717a' }}>
                    {m}
                  </span>
                ))}
              </div>
            )}

            {/* Pay button */}
            {!failed ? (
              <button onClick={handlePayment} disabled={processing || demoStep === 2}
                className="shiny-cta"
                style={{ width: '100%', padding: '16px 0', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: (processing || demoStep === 2) ? 0.7 : 1 }}>
                {processing ? (
                  <>
                    <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%' }} className="animate-spin" />
                    {isDemoMode ? 'Processing Demo Payment...' : 'Processing...'}
                  </>
                ) : demoStep === 2 ? (
                  <>✓ Payment Done — Redirecting...</>
                ) : (
                  <>{isDemoMode ? '⚡ Pay (Demo) ' : 'Pay '}₹{fare.total} →</>
                )}
              </button>
            ) : (
              <div>
                <div style={{ padding: 20, background: 'rgba(239,35,60,0.08)', border: '1px solid rgba(239,35,60,0.3)', borderRadius: 12, marginBottom: 16, textAlign: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef233c" strokeWidth="2" style={{ margin: '0 auto 8px', display: 'block' }}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Payment Failed</h3>
                  <p style={{ fontSize: 13, color: '#a1a1aa' }}>Something went wrong. Please try again.</p>
                </div>
                <button onClick={() => { setFailed(false); handlePayment() }}
                  style={{ width: '100%', padding: '14px 0', borderRadius: 10, background: '#ef233c', color: '#fff', fontSize: 14, fontWeight: 700 }}>
                  Retry Payment →
                </button>
              </div>
            )}

            {/* Secure badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <span style={{ fontSize: 11, color: '#52525b' }}>
                {isDemoMode ? 'Demo Mode — No real payment processed' : 'Secured by Razorpay • 256-bit SSL Encryption'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
