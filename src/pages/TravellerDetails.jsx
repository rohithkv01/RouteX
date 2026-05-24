import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import useBookingStore from '../store/bookingStore'

const STEPS = ['Search', 'Seats', 'Details', 'Review', 'Payment']
const CURRENT = 2

export default function TravellerDetails() {
  const navigate = useNavigate()
  const { selectedSeats, selectedRoute, setPassengers, setContactInfo } = useBookingStore()
  const [forms, setForms] = useState(
    selectedSeats.map(s => ({ seatNumber: s.seatNumber, name: '', age: '', gender: 'male', idType: 'aadhar', idNumber: '' }))
  )
  const [contact, setContact] = useState({ email: '', phone: '' })
  const [errors, setErrors] = useState({})

  const updateForm = (index, field, value) => {
    const updated = [...forms]
    updated[index] = { ...updated[index], [field]: value }
    setForms(updated)
  }

  const validate = () => {
    const errs = {}
    forms.forEach((f, i) => {
      if (!f.name.trim()) errs[`${i}-name`] = 'Required'
      if (!f.age || f.age < 1 || f.age > 120) errs[`${i}-age`] = 'Invalid age'
    })
    if (!contact.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs['email'] = 'Invalid email'
    if (!contact.phone.match(/^\d{10}$/)) errs['phone'] = 'Enter 10-digit number'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setPassengers(forms)
    setContactInfo(contact)
    navigate('/review')
  }

  if (selectedSeats.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: 100 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎫</div>
          <h2 className="font-display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>No seats selected</h2>
          <p style={{ color: '#71717a', marginBottom: 24 }}>Please go back and select your seats first.</p>
          <button onClick={() => navigate('/')} style={{ padding: '12px 28px', borderRadius: 8, background: '#ef233c', color: '#fff', fontSize: 14, fontWeight: 600 }}>Go Home</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 60px' }}>
        {/* Progress Bar */}
        <div className="progress-bar" style={{ marginBottom: 40 }}>
          {STEPS.map((s, i) => (
            <div key={s} className={`progress-step ${i < CURRENT ? 'done' : i === CURRENT ? 'active' : ''}`}>{s}</div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#ef233c', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step 3</span>
          <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-1px', marginTop: 4, marginBottom: 8 }}>Traveller Details</h1>
          <p style={{ color: '#71717a', fontSize: 13, marginBottom: 32 }}>
            {selectedRoute?.from} → {selectedRoute?.to} • {selectedSeats.length} passenger{selectedSeats.length > 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Passenger Forms */}
        {forms.map((f, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-card" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700 }}>
                Passenger {i + 1}
              </h3>
              <span className="badge badge-red">Seat {f.seatNumber}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* Name */}
              <div style={{ gridColumn: '1 / -1' }}>
                <input
                  className="input-flat" placeholder="Full Name *"
                  value={f.name} onChange={e => updateForm(i, 'name', e.target.value)}
                  style={{ borderColor: errors[`${i}-name`] ? '#ef233c' : undefined }}
                />
                {errors[`${i}-name`] && <span style={{ fontSize: 11, color: '#ef233c', marginTop: 4, display: 'block' }}>{errors[`${i}-name`]}</span>}
              </div>

              {/* Age */}
              <div>
                <input
                  className="input-flat" type="number" placeholder="Age *" min="1" max="120"
                  value={f.age} onChange={e => updateForm(i, 'age', e.target.value)}
                  style={{ borderColor: errors[`${i}-age`] ? '#ef233c' : undefined }}
                />
                {errors[`${i}-age`] && <span style={{ fontSize: 11, color: '#ef233c', marginTop: 4, display: 'block' }}>{errors[`${i}-age`]}</span>}
              </div>

              {/* Gender */}
              <div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['male', 'female', 'other'].map(g => (
                    <button key={g} onClick={() => updateForm(i, 'gender', g)}
                      style={{
                        flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 12, fontWeight: 600,
                        textTransform: 'capitalize', transition: 'all 0.15s',
                        background: f.gender === g ? '#ef233c' : 'rgba(255,255,255,0.04)',
                        color: f.gender === g ? '#fff' : '#71717a',
                        border: f.gender === g ? '1px solid #ef233c' : '1px solid rgba(255,255,255,0.06)',
                      }}>
                      {g === 'male' ? '♂' : g === 'female' ? '♀' : '⚧'} {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* ID Type */}
              <div>
                <select className="input-flat" value={f.idType} onChange={e => updateForm(i, 'idType', e.target.value)}
                  style={{ appearance: 'none', cursor: 'pointer' }}>
                  <option value="aadhar">Aadhar Card</option>
                  <option value="pan">PAN Card</option>
                  <option value="passport">Passport</option>
                </select>
              </div>

              {/* ID Number */}
              <div>
                <input className="input-flat" placeholder="ID Number" value={f.idNumber} onChange={e => updateForm(i, 'idNumber', e.target.value)} />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Contact Details */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: forms.length * 0.08 }}
          className="glass-card" style={{ padding: 24, marginBottom: 32 }}>
          <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Contact Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <input className="input-flat" type="email" placeholder="Email Address *"
                value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })}
                style={{ borderColor: errors['email'] ? '#ef233c' : undefined }} />
              {errors['email'] && <span style={{ fontSize: 11, color: '#ef233c', marginTop: 4, display: 'block' }}>{errors['email']}</span>}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRight: 'none', borderRadius: '8px 0 0 8px', padding: '11px 10px', fontSize: 13, color: '#71717a' }}>+91</span>
                <input className="input-flat" type="tel" placeholder="Mobile Number *"
                  value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  style={{ borderRadius: '0 8px 8px 0', borderColor: errors['phone'] ? '#ef233c' : undefined }} />
              </div>
              {errors['phone'] && <span style={{ fontSize: 11, color: '#ef233c', marginTop: 4, display: 'block' }}>{errors['phone']}</span>}
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <button onClick={() => navigate(-1)}
            style={{ padding: '14px 28px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#a1a1aa', fontSize: 14, fontWeight: 600, transition: 'all 0.15s' }}>
            ← Back
          </button>
          <button onClick={handleSubmit}
            style={{ padding: '14px 40px', borderRadius: 10, background: '#ef233c', color: '#fff', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', transition: 'all 0.15s' }}>
            Review Booking →
          </button>
        </div>
      </div>
    </div>
  )
}
