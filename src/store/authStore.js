import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('routex_user') || 'null'),
  token: localStorage.getItem('routex_token') || null,
  isAuthenticated: !!localStorage.getItem('routex_token'),

  setAuth: (user, token) => {
    localStorage.setItem('routex_user', JSON.stringify(user))
    localStorage.setItem('routex_token', token)
    set({ user, token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('routex_user')
    localStorage.removeItem('routex_token')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))

export default useAuthStore
