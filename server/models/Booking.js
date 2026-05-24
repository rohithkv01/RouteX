const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  journeyDate: { type: Date, required: true },
  passengers: [{
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    idType: { type: String, enum: ['aadhar', 'pan', 'passport'] },
    idNumber: { type: String },
    seatNumber: { type: String, required: true },
  }],
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  pickupPoint: { type: String },
  dropPoint: { type: String },
  fare: {
    base: { type: Number },
    gst: { type: Number },
    convenienceFee: { type: Number, default: 29 },
    discount: { type: Number, default: 0 },
    total: { type: Number },
  },
  couponCode: { type: String },
  pnr: { type: String, unique: true },
  qrCode: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  paymentId: { type: String },
  razorpayOrderId: { type: String },
  razorpaySignature: { type: String },
  cancellationReason: { type: String },
  refundAmount: { type: Number },
  refundStatus: { type: String, enum: ['none', 'pending', 'processed'], default: 'none' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
