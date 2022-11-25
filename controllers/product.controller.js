const Product = require('../model/product.model')
const Category = require('../model/category.model')
const date = require('date-and-time')
const User = require('../model/user.model')
const moment = require('moment')
module.exports.index = async (req, res)=>{
    var products = await Product.find({proStatus: true})
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('product', {activepage: 'product' ,layout: './layouts/common', products: products , moment: moment, user:user})
}
module.exports.search = async (req, res)=>{
    var search = req.query.search
    var products = await Product.find({proName: new RegExp(search.toLowerCase(),'i'),proStatus: true})
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('product', {activepage: 'product' ,layout: './layouts/common', products: products , moment: moment, user:user})
}
module.exports.adding = async (req, res)=>{
    var cats = await Category.find({status:true})
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('handle-product', {action: 'adding', activepage: 'product' ,layout: './layouts/common', cats:cats, user:user })
}
module.exports.editing = async(req, res)=>{
    var cats = await Category.find({status:true})
    var pro = await Product.find({_id: req.query.id})
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('handle-product', {action: 'editing', activepage: 'product' ,layout: './layouts/common', cats:cats, pro: pro[0], user:user})
}
module.exports.postAdding = async (req, res)=>{
    const now  =  new Date();
    // Formating the date and time
    // by using date.format() method
    const value = date.format(now,'YYYY/MM/DD HH:mm:ss');
    var category = await Category.find({_id: req.body.category})
    var user = await User.findOne({_id:req.signedCookies.userId})
    var cat = category[0]
    var newpro = new Product({
        proName: req.body.proName,
        proPrice: req.body.proPrice,
        category: {...cat},
        proDiscount: req.body.proDiscount,
        proDescription: req.body.proDescription,
        proImage: "/"+req.file.path,
        proSold: 0,
        proQty: 0,
        proStatus: true,
        proDateCreated: value,
        proDateModified: value,
        proRating: 0,
        proSearch: 0,
        proLike: 0,
        proComment:null,
        seller: {...user}
    })
    newpro.save((err, newpro)=>{
        if (err){
            res.status(500).send()
            return
        }
        console.log(newpro.proName + " saved in database!")
        res.redirect("/admin/product")
    })
}
module.exports.postEditing = (req, res)=>{
    Product.findOne({_id: req.body.proId}, async (err, pro)=>{
        const now  =  new Date();
        // Formating the date and time
        // by using date.format() method
        const value = date.format(now,'YYYY/MM/DD HH:mm:ss');
        var category = await Category.find({_id: req.body.category})
        var cat = category[0]
        var user = await User.findOne({_id:req.signedCookies.userId})
        pro.proName= req.body.proName
        pro.proPrice= req.body.proPrice
        pro.category= {...cat}
        pro.proDiscount= req.body.proDiscount
        pro.proDescription= req.body.proDescription
        pro.proDateModified= value
        pro.seller = {...user}
        if (req.file){
            if (req.file.path!==""){
                pro.proImage = "/"+req.file.path
            }
        }
        pro.save((err, pro)=>{
            if (err){
                res.status(500).send()
                return
            }
            console.log(pro.proName + " updated in database!")
            res.redirect("/admin/product")
        })
    })
}
module.exports.deleting = (req, res)=>{
    Product.findOne({_id: req.query.id}, async (err, pro)=>{
        pro.proStatus = false;
        pro.save((err, pro)=>{
            if (err){
                res.status(500).send()
                return
            }
            console.log(pro.proName + " moved to trash!")
            res.redirect("/admin/product")
        })
    })
}
module.exports.trash = async (req, res)=>{
    var products = await Product.find({proStatus: false})
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('product-trash', {activepage: 'trash' ,layout: './layouts/common', products: products, moment: moment , user:user})
}
module.exports.trashSearch = async (req, res)=>{
    var search = req.query.search
    var products = await Product.find({proName: new RegExp(search.toLowerCase(),'i'),proStatus: false})
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('product-trash', {activepage: 'trash' ,layout: './layouts/common', products: products, moment: moment , user:user})
}
module.exports.recover = async (req, res)=>{
    Product.findOne({_id: req.query.id}, async (err, pro)=>{
        pro.proStatus = true;
        pro.save((err, pro)=>{
            if (err){
                res.status(500).send()
                return
            }
            console.log(pro.proName + " moved to trash!")
            res.redirect("/admin/product/trash")
        })
    })
}
module.exports.stockin = async (req, res)=>{
    Product.findOne({_id: req.query.id}, async (err, pro)=>{
        var user = await User.findOne({_id:req.signedCookies.userId})
        res.render("stock-in",{activepage: 'product' ,layout: './layouts/common', pro: pro, user:user })
    })
}
module.exports.postStockin = async (req, res)=>{
    Product.findOne({_id: req.body.proId}, async (err, pro)=>{
        pro.proQty = parseInt(pro.proQty) + parseInt(req.body.qty)
        pro.save((err, pro)=>{
            if (err){
                res.status(500).send()
                return
            }
            res.redirect("/admin/product")
        })
    })
}