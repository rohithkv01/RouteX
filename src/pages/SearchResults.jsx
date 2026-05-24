import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api/axios'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import useBookingStore from '../store/bookingStore'
import { TransportIcon } from '../components/icons/TransportIcons'


const SORT_OPTIONS = [
  { key: 'price', label: 'Cheapest' },
  { key: 'duration', label: 'Fastest' },
  { key: 'departure', label: 'Departure' },
  { key: 'rating', label: 'Rating' },
]

function SkeletonCard() {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 24, marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 10 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 10 }} />
          <div className="skeleton" style={{ width: '40%', height: 12, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: '80%', height: 14 }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="skeleton" style={{ width: 80, height: 24, marginBottom: 8, marginLeft: 'auto' }} />
          <div className="skeleton" style={{ width: 100, height: 36, borderRadius: 8, marginLeft: 'auto' }} />
        </div>
      </div>
    </div>
  )
}

export default function SearchResults() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setSelectedRoute } = useBookingStore()
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('price')
  const [filterType, setFilterType] = useState(params.get('type') || '')

  const from = params.get('from') || ''
  const to = params.get('to') || ''
  const date = params.get('date') || ''

  useEffect(() => {
    setLoading(true)
    api.get('/routes/search', { params: { from, to, type: filterType, date } })
      .then(r => setRoutes(r.data.data || []))
      .catch(() => setRoutes([]))
      .finally(() => setLoading(false))
  }, [from, to, filterType, date])

  const sorted = [...routes].sort((a, b) => {
    if (sort === 'price') return a.pricePerSeat - b.pricePerSeat
    if (sort === 'rating') return b.rating - a.rating
    if (sort === 'departure') return a.departureTime.localeCompare(b.departureTime)
    return 0
  })

  const handleViewSeats = (route) => {
    setSelectedRoute(route)
    navigate(`/seats/${route._id}?date=${date}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 24px 60px' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#ef233c', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Search Results</span>
          </div>
          <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-1px' }}>
            {from} <span style={{ color: '#ef233c' }}>→</span> {to}
          </h1>
          <p style={{ color: '#71717a', fontSize: 14, marginTop: 4 }}>
            {date ? new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'All dates'}
          </p>
        </motion.div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          {/* Sidebar Filters */}
          <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="hide-mobile"
            style={{ width: 220, flexShrink: 0, position: 'sticky', top: 100 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 20 }}>
              <h4 style={{ fontSize: 11, fontWeight: 700, color: '#ef233c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Filter By Type</h4>
              {['', 'bus', 'train', 'flight'].map(t => (
                <button key={t} onClick={() => setFilterType(t)}
                  style={{
                    display: 'block', width: '100%', padding: '10px 12px', borderRadius: 8, textAlign: 'left',
                    fontSize: 13, fontWeight: 500, marginBottom: 4, transition: 'all 0.15s',
                    background: filterType === t ? 'rgba(239,35,60,0.1)' : 'transparent',
                    color: filterType === t ? '#ef233c' : '#a1a1aa',
                    border: filterType === t ? '1px solid rgba(239,35,60,0.3)' : '1px solid transparent',
                  }}>
                {t ? <span style={{ display:'flex', alignItems:'center', gap:6 }}><TransportIcon type={t} size={20} animated={false} />{t.charAt(0).toUpperCase()+t.slice(1)}</span> : <span>All Types</span>}
                </button>
              ))}
            </div>
          </motion.aside>

          {/* Results */}
          <div style={{ flex: 1 }}>
            {/* Sort bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {SORT_OPTIONS.map(s => (
                <button key={s.key} onClick={() => setSort(s.key)}
                  style={{
                    padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                    background: sort === s.key ? '#ef233c' : 'rgba(255,255,255,0.04)',
                    color: sort === s.key ? '#fff' : '#71717a',
                    border: sort === s.key ? 'none' : '1px solid rgba(255,255,255,0.06)',
                  }}>
                  {s.label}
                </button>
              ))}
              <span style={{ marginLeft: 'auto', fontSize: 13, color: '#52525b', alignSelf: 'center' }}>
                {routes.length} result{routes.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Loading */}
            {loading && [1,2,3,4].map(i => <SkeletonCard key={i} />)}

            {/* Empty */}
            {!loading && sorted.length === 0 && (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1.5" style={{ margin: '0 auto 16px', display: 'block' }}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                  <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No routes found</h3>
                  <p style={{ color: '#71717a', fontSize: 14 }}>Try changing your search criteria or date.</p>
                </div>
            )}

            {/* Route cards */}
            {!loading && sorted.map((route, i) => (
              <motion.div key={route._id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                whileHover={{ borderColor: 'rgba(239,35,60,0.3)' }}
                style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14, padding: 24, marginBottom: 12, cursor: 'pointer', transition: 'all 0.2s',
                }}
                onClick={() => handleViewSeats(route)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  {/* Left: operator */}
                  <div style={{ minWidth: 160 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <TransportIcon type={route.type} size={32} />
                      <span className="font-display" style={{ fontSize: 15, fontWeight: 700 }}>{route.operator}</span>
                    </div>
                    <span style={{ fontSize: 12, color: '#71717a' }}>{route.vehicleType}</span>
                    {route.trainNumber && <span style={{ fontSize: 11, color: '#52525b', marginLeft: 8 }}>#{route.trainNumber}</span>}
                    {route.flightNumber && <span style={{ fontSize: 11, color: '#52525b', marginLeft: 8 }}>{route.flightNumber}</span>}
                  </div>

                  {/* Center: time flow */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, minWidth: 200 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>{route.departureTime}</div>
                      <div style={{ fontSize: 11, color: '#71717a' }}>{from}</div>
                    </div>
                    <div style={{ flex: 1, maxWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 10, color: '#52525b' }}>{route.duration}</span>
                      <div style={{ width: '100%', height: 1, background: 'linear-gradient(to right, transparent, rgba(239,35,60,0.5), transparent)' }} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>{route.arrivalTime}</div>
                      <div style={{ fontSize: 11, color: '#71717a' }}>{to}</div>
                    </div>
                  </div>

                  {/* Right: price & rating */}
                  <div style={{ textAlign: 'right', minWidth: 120 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginBottom: 6 }}>
                      <span style={{ color: '#f59e0b', fontSize: 13 }}>★</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{route.rating}</span>
                      <span style={{ fontSize: 11, color: '#52525b' }}>({route.ratingCount})</span>
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#ef233c', fontFamily: 'Manrope,sans-serif', marginBottom: 8 }}>₹{route.pricePerSeat}</div>
                    <button style={{
                      padding: '10px 20px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                      background: '#ef233c', color: '#fff', transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => e.target.style.background = '#dc2626'}
                      onMouseLeave={e => e.target.style.background = '#ef233c'}>
                      View Seats →
                    </button>
                  </div>
                </div>

                {/* Amenities */}
                {route.amenities?.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                    {route.amenities.map(a => (
                      <span key={a} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#71717a' }}>
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
