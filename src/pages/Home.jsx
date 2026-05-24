import { motion } from 'framer-motion'
import { TransportIcon } from '../components/icons/TransportIcons'
import HowItWorks from '../components/home/HowItWorks'
import ReviewsSection from '../components/home/ReviewsSection'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import SearchPanel from '../components/search/SearchPanel'
import CouponCarousel from '../components/home/CouponCarousel'

const POPULAR_ROUTES = [
  { from: 'Mumbai', to: 'Pune', price: 499, duration: '4h 30m', type: 'bus' },
  { from: 'Bangalore', to: 'Chennai', price: 699, duration: '8h', type: 'bus' },
  { from: 'Delhi', to: 'Jaipur', price: 399, duration: '5h 30m', type: 'bus' },
  { from: 'Mumbai', to: 'Delhi', price: 1450, duration: '15h', type: 'train' },
  { from: 'Chennai', to: 'Bangalore', price: 890, duration: '4h 30m', type: 'train' },
  { from: 'Mumbai', to: 'Delhi', price: 3499, duration: '2h 10m', type: 'flight' },
  { from: 'Delhi', to: 'Bangalore', price: 4299, duration: '2h 30m', type: 'flight' },
  { from: 'Mumbai', to: 'Goa', price: 1199, duration: '13h', type: 'bus' },
]

const FEATURES = [
  { icon: 'shield',  title: 'Safe & Secure',    desc: 'Industry-standard encryption for every transaction. Your data is always protected.', color: '#ef233c' },
  { icon: 'bolt',    title: 'Instant Booking',  desc: 'Book tickets in under 60 seconds with real-time seat availability.', color: '#3b82f6' },
  { icon: 'price',   title: 'Best Prices',      desc: 'Transparent pricing with no hidden charges. Price match guarantee.', color: '#f59e0b' },
  { icon: 'support', title: '24/7 Support',     desc: 'Round-the-clock customer support via chat, call, and email.', color: '#8b5cf6' },
]

function FeatureIcon({ type, color }) {
  const p = { fill: 'none', stroke: color, strokeWidth: '2' }
  const s = { width: 22, height: 22 }
  if (type === 'shield')  return <svg {...s} viewBox="0 0 24 24" {...p}><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/></svg>
  if (type === 'bolt')    return <svg {...s} viewBox="0 0 24 24" fill={color}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  if (type === 'price')   return <svg {...s} viewBox="0 0 24 24" {...p}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
  if (type === 'support') return <svg {...s} viewBox="0 0 24 24" {...p}><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>
  return null
}

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#000', position: 'relative', overflowX: 'hidden' }}>
      {/* Global Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #1a0505, #000)' }} />
        <div className="stars-1" style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1, background: 'transparent' }} />
        <div className="stars-2" style={{ position: 'absolute', top: 0, left: 0, width: 2, height: 2, background: 'transparent' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, background: 'rgba(239,35,60,0.04)', borderRadius: '50%', filter: 'blur(100px)' }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)',
        }} />
      </div>

      <div className="gradient-blur" />
      <Navbar />

      <main style={{ position: 'relative', zIndex: 10 }}>
        {/* ======= HERO SECTION ======= */}
        <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '140px 24px 80px' }}>
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 48px' }}>
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 9999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', marginBottom: 28 }}>
              <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
                <span className="animate-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(239,35,60,0.6)' }} />
                <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#ef233c' }} />
              </span>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,220,220,0.9)', letterSpacing: '0.03em', fontFamily: 'Manrope,sans-serif' }}>
                Bus + Train + Flight — All in One
              </span>
              <span style={{ color: '#ef233c', fontSize: 12 }}>→</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
              className="font-display"
              style={{ fontSize: 'clamp(36px, 7vw, 80px)', fontWeight: 700, letterSpacing: '-2.5px', lineHeight: 1.05, marginBottom: 20 }}>
              <span className="text-gradient" style={{ display: 'block' }}>Book Your Journey</span>
              <span style={{ display: 'block', color: 'rgba(255,255,255,0.85)' }}>
                with <span style={{ color: '#ef233c', position: 'relative', display: 'inline-block', WebkitTextFillColor: '#ef233c' }}>
                  RouteX
                  <svg style={{ position: 'absolute', width: '100%', height: 8, bottom: -4, left: 0, color: '#ef233c', opacity: 0.5 }} viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#a1a1aa', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
              Search, compare and book bus, train & flight tickets across India with real-time seat selection and instant confirmation.
            </motion.p>
          </div>

          {/* Search Panel */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ width: '100%', maxWidth: 1000, margin: '0 auto' }}>
            <SearchPanel />
          </motion.div>
        </section>

        {/* ======= COUPON CAROUSEL ======= */}
        <section style={{ padding: '32px 0', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef233c" strokeWidth="2"><path d="M2 9a3 3 0 010-6h20a3 3 0 010 6M2 9v9a2 2 0 002 2h16a2 2 0 002-2V9M12 9v12"/></svg>
              <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>Exclusive Deals</h3>
              <span style={{ fontSize: 12, color: '#52525b' }}>Click to copy code</span>
            </div>
            <CouponCarousel />
          </div>
        </section>

        <HowItWorks />

        {/* ======= POPULAR ROUTES ======= */}
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 12 }}>
                Popular <span style={{ color: '#ef233c' }}>Routes</span>
              </h2>
              <p style={{ color: '#71717a', fontSize: 16 }}>Most booked routes across India</p>
            </motion.div>

            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16, scrollSnapType: 'x mandatory' }}>
              {POPULAR_ROUTES.map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4, borderColor: 'rgba(239,35,60,0.3)' }}
                  style={{
                    scrollSnapAlign: 'start', flexShrink: 0, minWidth: 240,
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'all 0.2s',
                    position: 'relative', overflow: 'hidden',
                  }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(transparent, rgba(239,35,60,0.05))', pointerEvents: 'none' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <TransportIcon type={r.type} size={42} />
                    <span className="badge badge-red">{r.type.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, fontFamily: 'Manrope,sans-serif' }}>{r.from} → {r.to}</div>
                  <div style={{ fontSize: 12, color: '#71717a', marginBottom: 12 }}>Duration: {r.duration}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#ef233c', fontFamily: 'Manrope,sans-serif' }}>₹{r.price}</span>
                    <span style={{ fontSize: 11, color: '#52525b' }}>per seat</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ======= FEATURES BENTO GRID ======= */}
        <section style={{ padding: '64px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              style={{ textAlign: 'center', marginBottom: 48, maxWidth: 600, margin: '0 auto 48px' }}>
              <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 12 }}>
                Why <span style={{ color: '#ef233c' }}>RouteX</span>?
              </h2>
              <p style={{ color: '#71717a', fontSize: 16 }}>Everything you need for a seamless travel experience</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              {FEATURES.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ borderColor: 'rgba(255,255,255,0.15)' }}
                  style={{
                    padding: 28, border: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.02)', borderRadius: 14,
                    transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
                  }}>
                  <div style={{ position: 'absolute', inset: 0, opacity: 0, transition: 'opacity 0.3s', background: `radial-gradient(circle at top right, ${f.color}15, transparent 70%)` }}
                    className="hover-glow" />
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <FeatureIcon type={f.icon} color={f.color} />
                  </div>
                  <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.6 }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <ReviewsSection />

        {/* ======= CTA SECTION ======= */}
        <section style={{ padding: '100px 24px', textAlign: 'center', background: 'rgba(10,10,10,0.5)' }}>
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 700, letterSpacing: '-2px', marginBottom: 16 }}>
              Ready to <span style={{ color: '#ef233c' }}>Travel?</span>
            </h2>
            <p style={{ fontSize: 18, color: '#71717a', marginBottom: 32 }}>Start booking your next journey with RouteX today.</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="shiny-cta" style={{ fontSize: 16, padding: '16px 40px' }}>
              Book Now →
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
