import { create } from 'zustand'

const useBookingStore = create((set, get) => ({
  searchParams: null,
  selectedRoute: null,
  selectedSeats: [],
  passengers: [],
  contactInfo: { email: '', phone: '' },
  fare: { base: 0, gst: 0, convenienceFee: 29, discount: 0, total: 0 },
  coupon: null,
  bookingId: null,

  setSearchParams: (params) => set({ searchParams: params }),
  setSelectedRoute: (route) => set({ selectedRoute: route }),

  toggleSeat: (seat) => {
    const { selectedSeats } = get()
    const exists = selectedSeats.find(s => s.seatNumber === seat.seatNumber)
    if (exists) {
      set({ selectedSeats: selectedSeats.filter(s => s.seatNumber !== seat.seatNumber) })
    } else {
      set({ selectedSeats: [...selectedSeats, seat] })
    }
  },

  clearSeats: () => set({ selectedSeats: [] }),

  setPassengers: (passengers) => set({ passengers }),
  setContactInfo: (info) => set({ contactInfo: info }),

  calculateFare: () => {
    const { selectedSeats, coupon } = get()
    const base = selectedSeats.reduce((sum, s) => sum + s.price, 0)
    const gst = Math.round(base * 0.05)
    const convenienceFee = 29
    const discount = coupon ? coupon.discount : 0
    const total = base + gst + convenienceFee - discount
    set({ fare: { base, gst, convenienceFee, discount, total } })
  },

  applyCoupon: (couponData) => {
    set({ coupon: couponData })
    get().calculateFare()
  },

  removeCoupon: () => {
    set({ coupon: null })
    get().calculateFare()
  },

  setBookingId: (id) => set({ bookingId: id }),

  reset: () => set({
    searchParams: null, selectedRoute: null, selectedSeats: [],
    passengers: [], contactInfo: { email: '', phone: '' },
    fare: { base: 0, gst: 0, convenienceFee: 29, discount: 0, total: 0 },
    coupon: null, bookingId: null,
  }),
}))

export default useBookingStore
