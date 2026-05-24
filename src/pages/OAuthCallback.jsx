import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../api/axios'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const token = params.get('token')
    if (token) {
      localStorage.setItem('routex_token', token)
      api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => {
          setAuth(r.data.user, token)
          navigate('/')
        })
        .catch(() => navigate('/login'))
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="animate-spin" style={{ width: 40, height: 40, border: '3px solid rgba(239,35,60,0.2)', borderTop: '3px solid #ef233c', borderRadius: '50%', margin: '0 auto 16px' }} />
        <p style={{ color: '#71717a', fontSize: 14 }}>Signing you in...</p>
      </div>
    </div>
  )
}
