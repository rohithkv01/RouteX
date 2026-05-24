import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function CouponCarousel() {
  const [coupons, setCoupons] = useState([])
  const trackRef = useRef(null)

  useEffect(() => {
    api.get('/coupons').then(r => setCoupons(r.data.data || [])).catch(() => {})
  }, [])

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    toast.success(`Code ${code} copied!`, { style: { background: '#141414', color: '#fff', border: '1px solid rgba(239,35,60,0.3)' } })
  }

  if (!coupons.length) return null

  const doubled = [...coupons, ...coupons]

  return (
    <div style={{ width: '100%', overflow: 'hidden', padding: '8px 0', position: 'relative' }}>
      {/* fade edges */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, #000, transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, #000, transparent)', zIndex: 2, pointerEvents: 'none' }} />

      <div ref={trackRef} style={{
        display: 'flex', gap: 16,
        animation: 'marquee 30s linear infinite',
        width: 'max-content',
      }}>
        {doubled.map((c, i) => (
          <motion.div key={`${c._id || i}-${i}`}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => handleCopy(c.code)}
            className="coupon-card"
            style={{ cursor: 'pointer' }}>
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#ef233c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {c.applicableTypes?.join(' • ')}
              </span>
              <span style={{ fontSize: 10, color: '#52525b' }}>Click to copy</span>
            </div>
            {/* Code */}
            <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: 2, marginBottom: 6 }}>
              {c.code}
            </div>
            {/* Description */}
            <p style={{ fontSize: 12, color: '#a1a1aa', lineHeight: 1.4 }}>{c.description}</p>
            {/* Expiry */}
            <div style={{ marginTop: 10, fontSize: 10, color: '#52525b' }}>
              Expires {new Date(c.expiryDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
