const mongoose = require('mongoose');

var perSchema = new mongoose.Schema({
    perName: String
});

const Permission = mongoose.model('Permission', perSchema, 'permission')
module.exports = Permission