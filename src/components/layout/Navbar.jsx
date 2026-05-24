import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { useState } from 'react'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100, padding: '16px 24px' }}>
      <nav style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 9999,
        padding: '10px 24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 20, height: 20, background: '#ef233c', transform: 'rotate(45deg)', borderRadius: 4 }} />
          <span style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>RouteX</span>
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hide-mobile">
          {[['/', 'Home'], ['/search?type=bus', 'Bus'], ['/search?type=train', 'Train'], ['/search?type=flight', 'Flights']].map(([href, label]) => (
            <Link key={label} to={href} style={{ fontSize: 14, fontWeight: 500, color: 'rgba(161,161,170,0.9)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color='#fff'}
              onMouseLeave={e => e.target.style.color='rgba(161,161,170,0.9)'}>
              {label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isAuthenticated ? (
            <>
              <Link to="/bookings" style={{ fontSize: 13, color: 'rgba(161,161,170,0.9)', fontWeight: 500 }}>My Bookings</Link>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setMenuOpen(!menuOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9999, padding: '6px 14px 6px 8px' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#ef233c,#b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{user?.name?.split(' ')[0]}</span>
                </button>
                {menuOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '110%', background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, minWidth: 160, overflow: 'hidden', zIndex: 200 }}>
                    <Link to="/bookings" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '12px 16px', fontSize: 13, color: '#a1a1aa', transition: 'background 0.2s' }}
                      onMouseEnter={e=>e.target.style.background='rgba(255,255,255,0.05)'}
                      onMouseLeave={e=>e.target.style.background='transparent'}>
                      My Bookings
                    </Link>
                    <button onClick={() => { logout(); setMenuOpen(false); navigate('/') }}
                      style={{ width: '100%', display: 'block', padding: '12px 16px', fontSize: 13, color: '#ef233c', textAlign: 'left', transition: 'background 0.2s' }}
                      onMouseEnter={e=>e.target.style.background='rgba(239,35,60,0.08)'}
                      onMouseLeave={e=>e.target.style.background='transparent'}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: 13, color: 'rgba(161,161,170,0.9)', fontWeight: 500 }} className="hide-mobile">Login</Link>
              <Link to="/register" className="shiny-cta" style={{ padding: '8px 20px', fontSize: 13 }}>Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
