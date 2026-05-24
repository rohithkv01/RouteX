import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useGoogleLogin } from '@react-oauth/google'
import api from '../api/axios'
import useAuthStore from '../store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      setAuth(res.data.user, res.data.token)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true)
      try {
        const res = await api.post('/auth/google/verify', {
          access_token: tokenResponse.access_token,
        })
        setAuth(res.data.user, res.data.token)
        toast.success('Welcome!')
        navigate('/')
      } catch (err) {
        toast.error(err.response?.data?.message || 'Google sign-in failed')
      } finally {
        setGoogleLoading(false)
      }
    },
    onError: () => {
      toast.error('Google sign-in was cancelled or failed')
      setGoogleLoading(false)
    },
  })

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex' }}>
      {/* Left — Branding */}
      <div className="hide-mobile" style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a0505, #000)' }} />
        <div className="stars-1" style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1, background: 'transparent' }} />
        <div className="stars-2" style={{ position: 'absolute', top: 0, left: 0, width: 2, height: 2, background: 'transparent' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 400, background: 'rgba(239,35,60,0.06)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, background: '#ef233c', transform: 'rotate(45deg)', borderRadius: 5, boxShadow: '0 0 30px rgba(239,35,60,0.5)' }} />
            <span className="font-display" style={{ fontSize: 36, fontWeight: 800 }}>RouteX</span>
          </div>
          <p style={{ fontSize: 18, color: '#a1a1aa', maxWidth: 280, margin: '0 auto' }}>Your Journey, Redefined.</p>
        </div>
      </div>

      {/* Right — Login form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          style={{ width: '100%', maxWidth: 400 }}>
          <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: '#71717a', fontSize: 14, marginBottom: 32 }}>Sign in to your RouteX account</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input className="input-flat" type="email" placeholder="Email address" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
            <input className="input-flat" type="password" placeholder="Password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
            <button type="submit" disabled={loading}
              style={{ padding: '14px 0', borderRadius: 10, background: '#ef233c', color: '#fff', fontSize: 14, fontWeight: 700, transition: 'all 0.15s', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: 11, color: '#52525b' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <button
            onClick={() => { setGoogleLoading(true); googleLogin() }}
            disabled={googleLoading}
            style={{ width: '100%', padding: '12px 0', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#a1a1aa', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s', opacity: googleLoading ? 0.6 : 1 }}
            onMouseEnter={e => { if (!googleLoading) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' } }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#a1a1aa' }}>
            {googleLoading ? (
              <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.2)', borderTop: '2px solid #a1a1aa', borderRadius: '50%' }} className="animate-spin" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            )}
            {googleLoading ? 'Signing in with Google...' : 'Continue with Google'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#71717a' }}>
            Don't have an account? <Link to="/register" style={{ color: '#ef233c', fontWeight: 600 }}>Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
