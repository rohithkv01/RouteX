const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../middleware/auth');

// Check if real Razorpay keys are configured
const isRealKey =
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_ID !== 'rzp_test_YOUR_KEY_ID' &&
  process.env.RAZORPAY_KEY_SECRET &&
  process.env.RAZORPAY_KEY_SECRET !== 'YOUR_RAZORPAY_KEY_SECRET';

// Lazy-initialize: only create the SDK instance when real keys exist
let razorpay = null;
if (isRealKey) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// POST /api/payment/create-order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    // Demo mode — return a synthetic order so the frontend can proceed
    if (!isRealKey) {
      return res.json({
        success: true,
        demoMode: true,
        order: {
          id: `demo_order_${Date.now()}`,
          amount: Math.round(amount * 100),
          currency: 'INR',
        },
      });
    }

    const options = {
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `routex_${Date.now()}`,
      notes: { userId: req.user._id.toString() },
    };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/payment/verify
router.post('/verify', auth, async (req, res) => {
  try {
    // Demo mode — always pass
    if (!isRealKey) {
      return res.json({ success: true, message: 'Demo payment verified', demoMode: true });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
    res.json({ success: true, message: 'Payment verified', paymentId: razorpay_payment_id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
