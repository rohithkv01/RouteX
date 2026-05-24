const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  seatNumber: { type: String, required: true },
  deck: { type: String, enum: ['upper', 'lower', 'middle', 'none'], default: 'none' },
  seatType: { type: String, enum: ['sleeper', 'seater', 'window', 'aisle', 'middle'] },
  isWindowSeat: { type: Boolean, default: false },
  price: { type: Number, required: true },
  bookings: [{
    date: { type: Date },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    passengerGender: { type: String, enum: ['male', 'female', 'other'] },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Seat', seatSchema);
