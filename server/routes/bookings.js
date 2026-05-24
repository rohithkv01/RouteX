const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const auth = require('../middleware/auth');
const { generatePNR } = require('../utils/generatePNR');
const { generateQR } = require('../utils/generateQR');
const { sendBookingConfirmationEmail, sendCancellationEmail } = require('../utils/sendEmail');

const isDemoMode = !process.env.RAZORPAY_KEY_ID ||
  process.env.RAZORPAY_KEY_ID === 'rzp_test_YOUR_KEY_ID';

// POST /api/bookings — Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { routeId, journeyDate, passengers, contactEmail, contactPhone, pickupPoint, dropPoint, fare, couponCode } = req.body;
    const pnr = generatePNR();
    const qrData = JSON.stringify({ pnr, routeId, journeyDate, passengers: passengers.map(p => p.name) });
    const qrCode = await generateQR(qrData);
    const booking = await Booking.create({
      userId: req.user._id,
      routeId, journeyDate, passengers, contactEmail, contactPhone,
      pickupPoint, dropPoint, fare, couponCode, pnr, qrCode, status: 'pending',
    });
    // Mark seats as booked
    for (const p of passengers) {
      await Seat.findOneAndUpdate(
        { routeId, seatNumber: p.seatNumber },
        { $push: { bookings: { date: journeyDate, bookingId: booking._id, passengerGender: p.gender } } }
      );
    }
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/my — User's bookings
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate('routeId').sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/:id — Single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('routeId');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    // Compare userId (stored as ObjectId) with req.user._id
    if (booking.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/bookings/:id/confirm — Confirm after payment
router.put('/:id/confirm', auth, async (req, res) => {
  try {
    const { paymentId, razorpayOrderId, razorpaySignature } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // In demo mode, skip signature check — just accept any paymentId
    if (!isDemoMode && razorpaySignature === 'demo_signature') {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    booking.status = 'confirmed';
    booking.paymentId = paymentId;
    booking.razorpayOrderId = razorpayOrderId;
    booking.razorpaySignature = razorpaySignature;
    await booking.save();
    await booking.populate('routeId');

    sendBookingConfirmationEmail(booking.contactEmail, booking)
      .catch(err => console.warn('Confirmation email skipped:', err.message));

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/bookings/:id — Cancel booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    if (booking.status === 'cancelled')
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });

    const refundAmount = Math.round(booking.fare.total * 0.9);
    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'User cancelled';
    booking.refundAmount = refundAmount;
    booking.refundStatus = 'pending';
    await booking.save();

    // Unmark seats
    for (const p of booking.passengers) {
      await Seat.findOneAndUpdate(
        { routeId: booking.routeId, seatNumber: p.seatNumber },
        { $pull: { bookings: { bookingId: booking._id } } }
      );
    }
    sendCancellationEmail(booking.contactEmail, booking, refundAmount)
      .catch(err => console.warn('Cancellation email skipped:', err.message));

    res.json({ success: true, message: 'Booking cancelled', refundAmount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
