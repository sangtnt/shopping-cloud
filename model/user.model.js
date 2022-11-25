const mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    username: String,
    fullname: String,
    email:String,
    phone: String,
    address: String,
    status: Boolean,
    permission: {},
    avatar: String,
    joined: String,
    password:String,
    branch: {}
});

const User = mongoose.model('User', userSchema, 'user')
module.exports = User