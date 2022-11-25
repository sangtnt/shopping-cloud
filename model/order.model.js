const mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    customer: {},
    date: Date,
    total: Number,
    orderDetails:[],
    status: Number,
    shippingFee: Number,
    paymentMethod: String
});

const Order = mongoose.model('Order', orderSchema, 'order')
module.exports = Order