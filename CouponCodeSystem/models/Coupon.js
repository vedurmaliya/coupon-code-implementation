const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountAmount: { type: Number, required: true },
  expirationDate: { type: Date, required: true },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model('Coupon', couponSchema);
