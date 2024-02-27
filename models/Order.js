const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    quantity: Number,
    price: Number
  }],
  total: Number,
  phone: String,
  address: String,
  paymentMethod: String,
  status: { type: String, default: 'Ожидает' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
