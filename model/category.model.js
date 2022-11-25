const mongoose = require('mongoose');

var catSchema = new mongoose.Schema({
    catName: String,
    catImage: String,
    status: Boolean
});

const Category = mongoose.model('Category', catSchema, 'category')
module.exports = Category