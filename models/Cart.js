const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
    productName: String,
    quantity: Number,
    price: Number
});

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [cartItemSchema],
    total: Number
});

module.exports = mongoose.model('Cart', cartSchema);
