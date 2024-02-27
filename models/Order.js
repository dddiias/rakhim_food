const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number
  }],
  total: Number,
  phone: String,
  address: String,
  paymentMethod: String,
  status: { type: String, default: 'Новый' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
