import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: '#000', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 64, paddingBottom: 32, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48, marginBottom: 64 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 18, height: 18, background: '#ef233c', transform: 'rotate(45deg)', borderRadius: 3 }} />
              <span style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: 22 }}>RouteX</span>
            </div>
            <p style={{ color: '#52525b', lineHeight: 1.7, fontSize: 14, maxWidth: 280 }}>Pioneering the future of travel in India. Book Bus, Train & Flight tickets with zero friction.</p>
          </div>
          <div>
            <h4 style={{ fontSize: 10, fontWeight: 700, color: '#ef233c', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Travel</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Bus Tickets','Train Tickets','Flight Tickets','Popular Routes'].map(l => (
                <Link key={l} to="/" style={{ fontSize: 13, color: '#71717a', transition: 'color 0.2s' }}
                  onMouseEnter={e=>e.target.style.color='#fff'}
                  onMouseLeave={e=>e.target.style.color='#71717a'}>{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 10, fontWeight: 700, color: '#ef233c', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['About Us','Careers','Blog','Support'].map(l => (
                <Link key={l} to="/" style={{ fontSize: 13, color: '#71717a', transition: 'color 0.2s' }}
                  onMouseEnter={e=>e.target.style.color='#fff'}
                  onMouseLeave={e=>e.target.style.color='#71717a'}>{l}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Big text */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0', opacity: 0.12, pointerEvents: 'none', overflow: 'hidden' }}>
          <h2 className="text-stroke font-display" style={{ fontSize: 'clamp(60px, 12vw, 140px)', fontWeight: 800, letterSpacing: '-4px', whiteSpace: 'nowrap' }}>
            ROUTEX
          </h2>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 11, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>© 2024 RouteX Travel Pvt. Ltd.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Twitter','LinkedIn','Instagram'].map(s => (
              <Link key={s} to="/" style={{ fontSize: 11, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'color 0.2s' }}
                onMouseEnter={e=>e.target.style.color='#71717a'}
                onMouseLeave={e=>e.target.style.color='#3f3f46'}>{s}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
