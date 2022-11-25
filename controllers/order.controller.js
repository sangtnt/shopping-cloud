const Order = require('../model/order.model')
const moment = require ('moment')
const User = require('../model/user.model')
const Product = require('../model/product.model')

module.exports.index = async (req, res)=>{
    var orders = await Order.find().sort({date: 'desc'})
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('order', {activepage: 'order' ,layout: './layouts/common', orders: orders, moment:moment, user:user})
}
module.exports.search = async (req, res)=>{
    var search = req.query.search
    try{
        var orders = await Order.find({_id: search})
        var user = await User.findOne({_id:req.signedCookies.userId})
        res.render('order', {activepage: 'order' ,layout: './layouts/common', orders: orders, moment:moment, user:user})
    }catch(err){
        var user = await User.findOne({_id:req.signedCookies.userId})
        res.render('order', {activepage: 'order' ,layout: './layouts/common', orders: [], moment:moment, user:user})
    }
}
module.exports.adding = async(req, res)=>{
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('add-order', {activepage: 'order' ,layout: './layouts/common' , user:user})
}
module.exports.orderDetails = async (req, res)=>{
    try{
        var user = await User.findOne({_id:req.signedCookies.userId})
        var order = await Order.findOne({_id: req.query.id})
        res.render('order-details', {activepage: 'order' ,layout: './layouts/common', order: order ,user:user})
    }
    catch(err){
        res.redirect('/admin/order')
        return
    }
}
module.exports.changeStatus = async (req, res)=>{
    var status = req.query.status
    var order = await Order.findOne({_id: req.query.id})
    order.status = status
    order.save((err, order)=>{
        if (err){
            res.status(500).send()
            return
        }
        res.redirect("/admin/order/details?id="+order.id)
    })
    if (status==1){
        order.orderDetails.forEach(item=>{
            Product.findOne({_id:item.product._id}, (err, pro)=>{
                pro.proQty = parseInt(pro.proQty)-parseInt(item.qty)
                pro.proSold = parseInt(pro.proQty)+parseInt(item.qty)
                pro.save((err, pro)=>{
                    if (err){
                        res.status(500).send()
                        return
                    }
                })
            })
        })
    }
}