const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String },
  discountType: { type: String, enum: ['flat', 'percent'], required: true },
  discountValue: { type: Number, required: true },
  minAmount: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  expiryDate: { type: Date, required: true },
  applicableTypes: [{ type: String, enum: ['bus', 'train', 'flight'] }],
  usageLimit: { type: Number, default: 1000 },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  bannerColor: { type: String, default: '#ef233c' },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
