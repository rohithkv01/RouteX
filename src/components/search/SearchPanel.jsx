import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../api/axios'
import useBookingStore from '../../store/bookingStore'

const TYPES = [
  { key: 'bus', label: '🚌 Bus', icon: '🚌' },
  { key: 'train', label: '🚆 Train', icon: '🚆' },
  { key: 'flight', label: '✈️ Flight', icon: '✈️' },
]

function CityInput({ label, value, onChange, placeholder }) {
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const fetchCities = async (q) => {
    if (!q) { setSuggestions([]); return }
    try {
      const res = await api.get(`/cities?q=${q}`)
      setSuggestions(res.data.data || [])
      setOpen(true)
    } catch {}
  }

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1 }}>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#52525b', pointerEvents: 'none' }}>{label}</span>
        <input
          type="text" value={value} placeholder={placeholder}
          onChange={e => { onChange(e.target.value); fetchCities(e.target.value) }}
          onFocus={() => value && setOpen(true)}
          style={{
            width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '36px 14px 12px', color: '#fff', fontSize: 16, fontWeight: 600,
            outline: 'none', transition: 'border-color 0.2s',
          }}
          onFocusCapture={e => e.target.style.borderColor = '#ef233c'}
          onBlurCapture={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
      </div>
      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ position: 'absolute', top: '105%', left: 0, right: 0, background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}>
            {suggestions.map(city => (
              <button key={city} onClick={() => { onChange(city); setOpen(false) }}
                style={{ width: '100%', padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#a1a1aa', transition: 'background 0.15s, color 0.15s', display: 'flex', alignItems: 'center', gap: 10, background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,35,60,0.08)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a1a1aa' }}>
                <span style={{ color: '#ef233c' }}>📍</span> {city}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SearchPanel() {
  const navigate = useNavigate()
  const { setSearchParams } = useBookingStore()
  const [type, setType] = useState('bus')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [swapping, setSwapping] = useState(false)

  const swap = () => {
    setSwapping(true)
    setTimeout(() => { setFrom(to); setTo(from); setSwapping(false) }, 300)
  }

  const handleSearch = () => {
    if (!from || !to) { alert('Please enter From and To cities'); return }
    setSearchParams({ from, to, date, type })
    navigate(`/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&type=${type}`)
  }

  return (
    <div className="glass-card" style={{ maxWidth: 900, margin: '0 auto', padding: 32, background: 'rgba(10,10,10,0.85)' }}>
      {/* Type tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 6 }}>
        {TYPES.map(t => (
          <button key={t.key} onClick={() => setType(t.key)}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 14, fontWeight: 600,
              transition: 'all 0.2s', border: 'none',
              background: type === t.key ? '#ef233c' : 'transparent',
              color: type === t.key ? '#fff' : '#71717a',
              boxShadow: type === t.key ? '0 4px 16px rgba(239,35,60,0.35)' : 'none',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Search inputs */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', flexWrap: 'wrap' }}>
        <CityInput label="FROM" value={from} onChange={setFrom} placeholder="Departure city" />

        {/* Swap button */}
        <button onClick={swap} style={{
          alignSelf: 'center', width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(239,35,60,0.12)', border: '1px solid rgba(239,35,60,0.3)',
          color: '#ef233c', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s', flexShrink: 0,
          transform: swapping ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>⇌</button>

        <CityInput label="TO" value={to} onChange={setTo} placeholder="Arrival city" />

        {/* Date */}
        <div style={{ position: 'relative', minWidth: 160 }}>
          <span style={{ position: 'absolute', left: 12, top: 10, fontSize: 11, color: '#52525b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', zIndex: 1 }}>DATE</span>
          <input type="date" value={date} min={new Date().toISOString().split('T')[0]}
            onChange={e => setDate(e.target.value)}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, padding: '36px 14px 12px', color: '#fff', fontSize: 15, fontWeight: 600,
              outline: 'none', colorScheme: 'dark', cursor: 'pointer',
            }} />
        </div>

        <button onClick={handleSearch} className="shiny-cta" style={{ alignSelf: 'stretch', minWidth: 140, fontSize: 15 }}>
          Search →
        </button>
      </div>
    </div>
  )
}
