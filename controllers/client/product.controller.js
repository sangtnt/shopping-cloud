const Product = require('../../model/product.model')
const Category = require('../../model/category.model')
const User = require('../../model/user.model')
const Order = require('../../model/order.model')
const date = require('date-and-time')

module.exports.proByCat = async (req, res)=>{
    var cat = await Category.findOne({_id: req.query.catId, status: true})
    var pros = await Product.find({category: cat})
    var cats = await Category.find({status:true})
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('client/products-by-category', {layout: './layouts/client-common', pros: pros, cats:cats, cat:cat, cart: req.signedCookies.cart, user: user})
}
module.exports.search = async (req, res)=>{
    var search = req.query.search
    var cat = req.query.cat
    var pros = null
    if(cat=="all"){
        pros = await Product.find({proName: new RegExp(search.toLowerCase(),'i'), proStatus: true})
    }else{
        Category.findOne({_id:cat}, async (err, cate)=>{
            pros = await Product.find({proName: new RegExp(search.toLowerCase(),'i'), proStatus: true, category: cate})
        })
    }
    var cats = await Category.find({status:true})
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('client/products-search', {layout: './layouts/client-common', pros: pros, cats:cats, cart: req.signedCookies.cart, user: user})
}
module.exports.productDetails = async (req, res)=>{
    var pro = await Product.findOne({_id: req.query.id})
    var cats = await Category.find({status:true})
    var relatedPros = await Product.find({category: pro.category}).sort({proSold:'desc'}).limit(6)
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('client/product-details', {layout: './layouts/client-common', cats:cats, pro:pro, relatedPros: relatedPros, cart: req.signedCookies.cart, user: user})
}
module.exports.addtocart = async (req, res)=>{
    if(!req.signedCookies.cart){
        try{
            var product = await Product.findOne({_id:req.body.proId})
            res.cookie('cart',[{product: product.id, qty: req.body.qty}], {signed: true})
        }
        catch(err){
            res.status(500).send()
            console.log(err)
        }
    }
    else{
        var cart = req.signedCookies.cart
        var product = await Product.findOne({_id:req.body.proId})
        var ok = false
        cart.forEach(item=>{
            if(item.product._id==product.id){
                var temp =parseInt(item.qty) + parseInt(req.body.qty)
                if(temp>item.product.proQty){
                    item.qty = item.product.proQty
                }
                else{
                    item.qty = temp
                }
                ok= true
            }
        })
        if(ok===false){
            cart.push({product: product.id, qty: req.body.qty})
        }
        res.cookie('cart',cart, {signed: true})
    }
    res.redirect('/')
}
module.exports.cart = async (req, res)=>{
    var cats = await Category.find({status:true})
    var cart = req.signedCookies.cart === undefined ? [] : req.signedCookies.cart
    var pros = []
    for (var c of cart){
        await Product.findOne({_id: c.product}, (err, pro)=>{
            pros.push({product:pro, qty: c.qty})
            console.log(pros)
        })
    }
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('client/view-cart', {layout: './layouts/client-common', cats:cats, cart:cart, user: user, pros: pros})
}
module.exports.removeItemFromCart = async (req, res)=>{
    var cart = req.signedCookies.cart
    cart.splice(req.index,1)
    res.cookie('cart',cart, {signed: true})
    res.redirect('/product/cart')
}
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
module.exports.checkout = async (req, res)=>{
    var cats = await Category.find({status:true})
    var cart = req.signedCookies.cart
    var user = await User.findOne({_id:req.signedCookies.userId})
    if(user.phone===""||user.email===""||user.fullname===""||user.address===""){
        res.render('client/change-profile', {layout: './layouts/client-common', cats: cats, cart: req.signedCookies.cart, user: user, error: 'Please fill your information'})
        return
    }
    if(!user.phone||!user.email||!user.fullname||!user.address){
        res.render('client/change-profile', {layout: './layouts/client-common', cats: cats, cart: req.signedCookies.cart, user: user, error: 'Please fill your information'})
        return
    }
    if(cart.length===0){
        res.render('client/view-cart', {layout: './layouts/client-common', cats:cats, cart:cart, user: user, error: 'There is not any product to check out!'})
        return
    }
    var pros = []
    var total = 0
    const start = async()=>{
        await asyncForEach(cart, async (c) => {
            await waitFor(200);
            await Product.findOne({_id: c.product}, (err, pro)=>{
                pros.push({product:pro, qty: c.qty})
            })
        })
        pros.forEach(item=>{
            total = total + parseInt(item.qty)*parseInt(item.product.proPrice*((100-item.product.proDiscount)/100))
        })
    }
    await start()
    console.log(pros)
    const now  =  new Date();
    // Formating the date and time
    // by using date.format() method
    var order = new Order({
        customer: {...user},
        date: now,
        total: total,
        orderDetails: [...pros],
        status: 0,
        shippingFee: 50000,
        paymentMethod: 'Payment on delivery',
    })
    order.save((err, user)=>{
        if (err){
            res.status(500).send()
            return
        }
        console.log(order.id + " created!")
        cart=[]
        res.cookie('cart',cart, {signed: true})
        res.render('client/view-cart', {layout: './layouts/client-common', cats:cats, cart:cart, user: user, message: 'Finish order!'})
    })
}