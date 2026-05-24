import { motion } from 'framer-motion'

const STEPS = [
  {
    n: '01', t: 'Search Your Route',
    d: 'Enter origin, destination, date and travel mode to find all available options instantly.',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef233c" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  },
  {
    n: '02', t: 'Copy Coupon Code',
    d: 'Click any coupon card in the carousel above to instantly copy the discount code to your clipboard.',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef233c" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  },
  {
    n: '03', t: 'Apply at Checkout',
    d: 'Paste your coupon code at the Review & Pay step to unlock instant savings on your total fare.',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef233c" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  },
]

export default function HowItWorks() {
  return (
    <section style={{ padding: '72px 24px', background: 'rgba(239,35,60,0.018)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 10 }}>
            How <span style={{ color: '#ef233c' }}>Exclusive Tickets</span> Work
          </h2>
          <p style={{ color: '#71717a', fontSize: 15 }}>Save more on every booking with our exclusive coupon codes</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
          {STEPS.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.13 }}
              style={{ padding: 28, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 14, right: 18, fontSize: 56, fontWeight: 900, color: 'rgba(239,35,60,0.06)', fontFamily: 'Manrope,sans-serif', lineHeight: 1 }}>{s.n}</div>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(239,35,60,0.1)', border: '1px solid rgba(239,35,60,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>{s.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ef233c', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Step {s.n}</div>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{s.t}</h3>
              <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.65 }}>{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
