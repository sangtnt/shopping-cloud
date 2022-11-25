const Product = require('../../model/product.model')
const Category = require('../../model/category.model')
const User = require('../../model/user.model')

module.exports.homePage = async (req, res)=>{
    var featuredPros = await Product.find({proStatus: true}).sort({proSold: 'desc'}).limit(16)
    var latestPros = await Product.find({proStatus: true}).sort({proDateCreated: 'desc'}).limit(6)
    var cats = await Category.find({status:true})
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('client/home', {layout: './layouts/client-common', featuredPros: featuredPros, latestPros: latestPros, cats: cats, cart: req.signedCookies.cart, user: user})
}