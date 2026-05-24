import { useState } from 'react'
import { motion } from 'framer-motion'

const REVIEWS = [
  { name: 'Arjun Mehta',  city: 'Mumbai',    initial: 'A', color: '#ef233c', text: 'Booked 3 trains and a flight in under 10 minutes. The seat selection is insanely smooth!', date: 'May 2026', helpful: 42 },
  { name: 'Sneha Reddy',  city: 'Hyderabad', initial: 'S', color: '#8b5cf6', text: 'Used the FLAT200 coupon on my Bangalore flight — saved big! The UI is absolutely gorgeous.', date: 'Apr 2026', helpful: 38 },
  { name: 'Vikram Nair',  city: 'Delhi',     initial: 'V', color: '#3b82f6', text: 'Best travel booking platform in India. The confirmation email with QR code is a premium touch.', date: 'May 2026', helpful: 29 },
  { name: 'Priya Sharma', city: 'Chennai',   initial: 'P', color: '#f59e0b', text: 'RouteX replaced 3 different apps for me. Bus, train, flight — all in one clean interface.', date: 'Mar 2026', helpful: 55 },
]

function ThumbUp() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.88v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 2 7.59 7.59C7.22 7.95 7 8.45 7 9v11c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2l-.01-.01L21.83 12.88z"/>
    </svg>
  )
}

export default function ReviewsSection() {
  const [votes, setVotes] = useState({})
  const [counts, setCounts] = useState(REVIEWS.map(r => r.helpful))

  const vote = (idx, dir) => {
    const prev = votes[idx]
    const delta = dir === 'up' ? 1 : -1
    if (prev === dir) {
      setVotes(v => ({ ...v, [idx]: null }))
      setCounts(c => c.map((n, i) => i === idx ? n - delta : n))
    } else {
      const undo = prev === 'up' ? -1 : prev === 'down' ? 1 : 0
      setVotes(v => ({ ...v, [idx]: dir }))
      setCounts(c => c.map((n, i) => i === idx ? n + delta + undo : n))
    }
  }

  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 12 }}>
            What Travellers <span style={{ color: '#ef233c' }}>Say</span>
          </h2>
          <p style={{ color: '#71717a', fontSize: 16 }}>Trusted by thousands of travellers across India</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
          {REVIEWS.map((r, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              style={{ padding: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, backdropFilter: 'blur(12px)', transition: 'border-color 0.2s', willChange: 'transform', display: 'flex', flexDirection: 'column' }}>

              {/* Stars + date */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#f59e0b', fontSize: 15 }}>★</span>)}
                </div>
                <span style={{ fontSize: 11, color: '#52525b' }}>{r.date}</span>
              </div>

              {/* Review text */}
              <p style={{ fontSize: 14, color: '#a1a1aa', lineHeight: 1.7, marginBottom: 18, flex: 1 }}>"{r.text}"</p>

              {/* User row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff', flexShrink: 0 }}>{r.initial}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</span>
                    <span style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 4 }}>✓ Verified</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#52525b' }}>{r.city}</div>
                </div>
              </div>

              {/* Helpful voting */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 11, color: '#52525b' }}>Helpful?</span>
                {['up','down'].map(dir => (
                  <button key={dir} onClick={() => vote(i, dir)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                      background: votes[i] === dir ? (dir === 'up' ? 'rgba(34,197,94,0.15)' : 'rgba(239,35,60,0.1)') : 'rgba(255,255,255,0.04)',
                      border: votes[i] === dir ? (dir === 'up' ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(239,35,60,0.3)') : '1px solid rgba(255,255,255,0.08)',
                      color: votes[i] === dir ? (dir === 'up' ? '#22c55e' : '#ef233c') : '#71717a',
                    }}>
                    <span style={{ transform: dir === 'down' ? 'rotate(180deg)' : 'none', display: 'flex' }}><ThumbUp /></span>
                    {dir === 'up' ? counts[i] : ''}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
