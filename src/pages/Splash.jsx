import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/'), 1800)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'radial-gradient(ellipse at center, #1a0505 0%, #000 70%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', zIndex: 9999,
    }}>
      {/* Glow circles */}
      <div style={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%', background: 'rgba(239,35,60,0.06)',
        filter: 'blur(60px)', animation: 'pulse-glow 2s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 200, height: 200,
        borderRadius: '50%', background: 'rgba(239,35,60,0.1)',
        filter: 'blur(30px)',
      }} />

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, zIndex: 1 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{
              width: 40, height: 40,
              background: 'linear-gradient(135deg, #ef233c, #b91c1c)',
              transform: 'rotate(45deg)',
              borderRadius: 6,
              boxShadow: '0 0 30px rgba(239,35,60,0.6)',
            }}
          />
          <span style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 52, fontWeight: 800,
            letterSpacing: '-2px',
            background: 'linear-gradient(to bottom, #fff, rgba(255,255,255,0.7))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            RouteX
          </span>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            fontFamily: 'Inter, sans-serif', fontSize: 15,
            color: 'rgba(161,161,170,0.9)', letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          Your Journey, Redefined.
        </motion.p>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ display: 'flex', gap: 8, marginTop: 16 }}
        >
          {[0,1,2].map(i => (
            <motion.div key={i}
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef233c' }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
