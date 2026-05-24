const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  type: { type: String, enum: ['bus', 'train', 'flight'], required: true },
  operator: { type: String, required: true },
  operatorLogo: { type: String },
  from: { type: String, required: true },
  to: { type: String, required: true },
  fromCode: { type: String },
  toCode: { type: String },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  duration: { type: String, required: true },
  vehicleType: { type: String }, // AC Sleeper, Volvo, Rajdhani, IndiGo etc.
  totalSeats: { type: Number, required: true },
  pricePerSeat: { type: Number, required: true },
  amenities: [{ type: String }],
  rating: { type: Number, default: 4.0, min: 1, max: 5 },
  ratingCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  // Train specific
  trainNumber: { type: String },
  classes: [{ className: String, price: Number, seats: Number }],
  // Flight specific
  flightNumber: { type: String },
  airline: { type: String },
  cabin: [{ type: String, enum: ['economy', 'business', 'first'] }],
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
