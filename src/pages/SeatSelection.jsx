import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api/axios'
import Navbar from '../components/layout/Navbar'
import useBookingStore from '../store/bookingStore'

const LEGEND = [
  { label: 'Available', cls: '', style: { border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)' } },
  { label: 'Selected', cls: '', style: { background: '#ef233c', border: '1.5px solid #ef233c' } },
  { label: 'Booked (M)', cls: '', style: { background: 'rgba(59,130,246,0.2)', border: '1.5px solid rgba(59,130,246,0.5)' } },
  { label: 'Booked (F)', cls: '', style: { background: 'rgba(236,72,153,0.2)', border: '1.5px solid rgba(236,72,153,0.5)' } },
]

export default function SeatSelection() {
  const { routeId } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { selectedRoute, setSelectedRoute, selectedSeats, toggleSeat, calculateFare } = useBookingStore()
  const [seats, setSeats] = useState([])
  const [route, setRoute] = useState(selectedRoute)
  const [loading, setLoading] = useState(true)
  const date = params.get('date') || new Date().toISOString().split('T')[0]

  useEffect(() => {
    setLoading(true)
    api.get(`/routes/${routeId}/seats?date=${date}`)
      .then(r => {
        setSeats(r.data.seats || [])
        if (r.data.route) { setRoute(r.data.route); setSelectedRoute(r.data.route) }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [routeId, date])

  useEffect(() => { calculateFare() }, [selectedSeats])

  const getSeatClass = (seat) => {
    if (selectedSeats.find(s => s.seatNumber === seat.seatNumber)) return 'seat seat-selected'
    if (seat.isBooked && seat.passengerGender === 'female') return 'seat seat-booked-female'
    if (seat.isBooked && seat.passengerGender === 'male') return 'seat seat-booked-male'
    if (seat.isBooked) return 'seat seat-booked'
    return 'seat'
  }

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return
    toggleSeat(seat)
  }

  const handleProceed = () => {
    if (selectedSeats.length === 0) { alert('Please select at least one seat'); return }
    navigate('/travellers')
  }

  // Group seats by deck
  const lowerSeats = seats.filter(s => s.deck === 'lower')
  const upperSeats = seats.filter(s => s.deck === 'upper')
  const noDecks = seats.filter(s => s.deck === 'none' || !s.deck)

  const renderSeatGrid = (seatsList, title) => {
    if (seatsList.length === 0) return null
    // Create 4-column grid for bus, 6-column for flight
    const cols = route?.type === 'flight' ? 6 : 4
    const rows = []
    for (let i = 0; i < seatsList.length; i += cols) {
      rows.push(seatsList.slice(i, i + cols))
    }
    return (
      <div style={{ marginBottom: 28 }}>
        <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', marginBottom: 12 }}>{title}</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
          {rows.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {row.map((seat, si) => {
                // Add aisle gap for flights (after col C)
                const addGap = route?.type === 'flight' && si === 3
                return (
                  <div key={seat.seatNumber} style={{ display: 'flex', alignItems: 'center' }}>
                    {addGap && <div style={{ width: 20 }} />}
                    <motion.button
                      whileHover={!seat.isBooked ? { scale: 1.1 } : {}}
                      whileTap={!seat.isBooked ? { scale: 0.92 } : {}}
                      className={getSeatClass(seat)}
                      onClick={() => handleSeatClick(seat)}
                      title={`${seat.seatNumber} — ₹${seat.price}${seat.isWindowSeat ? ' (Window)' : ''}`}>
                      {seat.seatNumber.length > 4 ? seat.seatNumber.slice(-3) : seat.seatNumber}
                    </motion.button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const { fare } = useBookingStore()

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 24px 60px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#ef233c', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Select Seats</span>
          <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-1px', marginTop: 4 }}>
            {route?.from} <span style={{ color: '#ef233c' }}>→</span> {route?.to}
          </h1>
          <p style={{ color: '#71717a', fontSize: 13, marginTop: 4 }}>
            {route?.operator} • {route?.vehicleType} • {new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
        </motion.div>

        <div style={{ display: 'flex', gap: 32, marginTop: 32, flexWrap: 'wrap' }}>
          {/* Seat Map */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ flex: 1, minWidth: 300 }}>
            <div className="glass-card" style={{ padding: 28 }}>
              {/* Driver / Front marker */}
              <div style={{ textAlign: 'center', marginBottom: 20, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 11, color: '#52525b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {route?.type === 'bus' ? '🏍 DRIVER' : route?.type === 'flight' ? '✈️ COCKPIT' : '🚆 ENGINE'}
                </span>
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', padding: 40 }}>
                  {[1,2,3,4,5].map(r => (
                    <div key={r} style={{ display: 'flex', gap: 6 }}>
                      {[1,2,3,4].map(c => <div key={c} className="skeleton" style={{ width: 36, height: 36, borderRadius: 6 }} />)}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {lowerSeats.length > 0 && renderSeatGrid(lowerSeats, 'Lower Deck')}
                  {upperSeats.length > 0 && renderSeatGrid(upperSeats, 'Upper Deck')}
                  {noDecks.length > 0 && renderSeatGrid(noDecks, route?.type === 'flight' ? 'Economy' : 'General')}
                </>
              )}

              {/* Legend */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {LEGEND.map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, ...l.style }} />
                    <span style={{ fontSize: 11, color: '#71717a' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Booking Summary Panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ width: 320, flexShrink: 0 }}>
            <div className="glass-card" style={{ padding: 24, position: 'sticky', top: 100 }}>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Booking Summary</h3>

              {selectedSeats.length === 0 ? (
                <p style={{ fontSize: 13, color: '#52525b', textAlign: 'center', padding: '20px 0' }}>Click on seats to select</p>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                    {selectedSeats.map(s => (
                      <div key={s.seatNumber} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(239,35,60,0.06)', border: '1px solid rgba(239,35,60,0.15)', borderRadius: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>Seat {s.seatNumber}</span>
                        <span style={{ fontSize: 13, color: '#ef233c', fontWeight: 700 }}>₹{s.price}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                    {[
                      ['Base Fare', `₹${fare.base}`],
                      ['GST (5%)', `₹${fare.gst}`],
                      ['Convenience Fee', `₹${fare.convenienceFee}`],
                    ].map(([label, val]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: 13, color: '#71717a' }}>{label}</span>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{val}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>Total</span>
                      <span style={{ fontSize: 22, fontWeight: 800, color: '#ef233c', fontFamily: 'Manrope,sans-serif' }}>₹{fare.total}</span>
                    </div>
                  </div>
                </>
              )}

              <button onClick={handleProceed} disabled={selectedSeats.length === 0}
                style={{
                  width: '100%', marginTop: 20, padding: '14px 0', borderRadius: 10,
                  fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                  background: selectedSeats.length > 0 ? '#ef233c' : 'rgba(255,255,255,0.05)',
                  color: selectedSeats.length > 0 ? '#fff' : '#52525b',
                  transition: 'all 0.15s', cursor: selectedSeats.length > 0 ? 'pointer' : 'not-allowed',
                }}>
                Proceed →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
