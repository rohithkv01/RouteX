const express = require('express');
const router = express.Router();
const Route = require('../models/Route');
const Seat = require('../models/Seat');

// GET /api/routes/search?from=&to=&date=&type=
router.get('/search', async (req, res) => {
  try {
    const { from, to, type, date } = req.query;
    const query = { isActive: true };
    if (from) query.from = { $regex: from, $options: 'i' };
    if (to) query.to = { $regex: to, $options: 'i' };
    if (type) query.type = type;
    const routes = await Route.find(query).sort({ pricePerSeat: 1 });
    res.json({ success: true, count: routes.length, data: routes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/routes/:id/seats?date=
router.get('/:id/seats', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
    const seats = await Seat.find({ routeId: req.params.id });
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const dateStr = date.toDateString();
    const seatsWithStatus = seats.map(seat => {
      const booking = seat.bookings.find(b => new Date(b.date).toDateString() === dateStr);
      return {
        _id: seat._id,
        seatNumber: seat.seatNumber,
        deck: seat.deck,
        seatType: seat.seatType,
        isWindowSeat: seat.isWindowSeat,
        price: seat.price,
        isBooked: !!booking,
        passengerGender: booking ? booking.passengerGender : null,
      };
    });
    res.json({ success: true, route, seats: seatsWithStatus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/routes/:id
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
    res.json({ success: true, data: route });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
