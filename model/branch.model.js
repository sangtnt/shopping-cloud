const mongoose = require('mongoose');

var branchSchema = new mongoose.Schema({
    name: String
});

const Branch = mongoose.model('Branch', branchSchema, 'branch')
module.exports = Branch