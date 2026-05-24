const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// GET /api/coupons — Active coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true, expiryDate: { $gte: new Date() } });
    res.json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/coupons/apply
router.post('/apply', async (req, res) => {
  try {
    const { code, amount, type } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    if (new Date() > coupon.expiryDate) return res.status(400).json({ success: false, message: 'Coupon expired' });
    if (coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    if (amount < coupon.minAmount) return res.status(400).json({ success: false, message: `Minimum order amount is ₹${coupon.minAmount}` });
    if (coupon.applicableTypes.length > 0 && !coupon.applicableTypes.includes(type))
      return res.status(400).json({ success: false, message: `Coupon not applicable for ${type}` });
    let discount = 0;
    if (coupon.discountType === 'flat') {
      discount = coupon.discountValue;
    } else {
      discount = (amount * coupon.discountValue) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    }
    res.json({ success: true, discount, coupon: { code: coupon.code, description: coupon.description } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
