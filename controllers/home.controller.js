const User = require('../model/user.model')
const Order = require('../model/order.model')
module.exports.homePage =async (req, res)=>{
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('index', {activepage: 'dashboard' ,layout: './layouts/common' , user:user})
}
module.exports.report =async (req, res)=>{
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('report', {activepage: 'report' ,layout: './layouts/common' , user:user})
}
module.exports.postReport =async (req, res)=>{
    var dateFrom = req.body.dateFrom
    var dateTo = req.body.dateTo
    var orders = await Order.find({date:{$gte: new Date(new Date(dateFrom).setHours(00, 00, 00)), $lt: new Date(new Date(dateTo).setHours(23, 59, 59))}})
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('report', {activepage: 'report' ,layout: './layouts/common' , user:user, orders: orders, dateFrom:dateFrom, dateTo: dateTo})
}