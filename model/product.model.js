const mongoose = require('mongoose');
var proSchema = new mongoose.Schema({
    proName: String,
    proPrice: Number,
    proQty: Number,
    proSold:Number,
    proStatus: Boolean,
    proDateCreated: Date,
    proDateModified: String,
    category: {},
    proImage: String,
    proRating: Number,
    proSearch: Number,
    proDiscount: Number,
    proDescription: String,
    proLike: Number,
    proComment: [],
    seller: {}
});

const Product = mongoose.model('Product', proSchema, 'product')
module.exports = Product