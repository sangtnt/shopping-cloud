const Category = require('../model/category.model')
const Product = require('../model/product.model')
const User = require('../model/user.model')
module.exports.index = async (req, res)=>{
    var categories = await Category.find({status:true})
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('category', {activepage: 'category' ,layout: './layouts/common', cats: categories, user: user})
}
module.exports.search = async (req, res)=>{
    var search = req.query.search
    var categories = await Category.find({catName: new RegExp(search.toLowerCase(),'i'),status: true})
    var user = await User.findOne({_id:req.signedCookies.userId})
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('category', {activepage: 'category' ,layout: './layouts/common', cats: categories, user: user})
}
module.exports.adding = async(req, res)=>{
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('handle-category', {action: 'adding', activepage: 'category' ,layout: './layouts/common', user: user })
}
module.exports.editing =async (req, res)=>{
    var id =req.query.id
    var user = await User.findOne({_id:req.signedCookies.userId})
    var cat = await Category.find({_id: id})
    res.render('handle-category', {action: 'editing', activepage: 'category' ,layout: './layouts/common', cat:cat[0] , user: user})
}
module.exports.postAdding = (req, res)=>{
    var newcat = new Category({
        catName: req.body.catName,
        catImage: "/"+req.file.path,
        status: true
    })
    newcat.save((err, newcat)=>{
        if (err){
            res.status(500).send()
            return
        }
        console.log(newcat.catName + " saved in database!")
    })
    res.redirect("/admin/category")
}
module.exports.postEditing = (req, res)=>{
    Category.findOne({_id:req.body.catId}, (err, cat)=>{
        if(err){
            res.status(500).send()
        }
        else{
            if (!cat){
                res.status(404).send()
            }
            else{
                cat.catName = req.body.catName
                if(req.file){
                    cat.catImage = "/"+req.file.path
                }
                cat.save((err, cat)=>{
                    if(err){
                        res.status(500).send(err)
                    }
                    else{
                        console.log(cat.catName+" was updated in database")
                        res.redirect('/admin/category')
                    }
                })
            }
        }
    })
}
module.exports.deleting = async (req, res)=>{
    Category.findOne({_id:req.query.id}, async (err, cat)=>{
        if(err){
            res.status(500).send()
        }
        else{
            if (!cat){
                res.status(404).send()
            }
            else{
                var pros = await Product.find({category: cat})
                console.log(cat)
                pros.forEach(pro=>{
                    pro.proStatus = false
                    pro.save((err, cat)=>{})
                })
                cat.status = false
                cat.save((err, cat)=>{
                    if(err){
                        res.status(500).send(err)
                    }
                    else{
                        console.log(cat.catName+" was removed to trash")
                        res.redirect('/admin/category')
                    }
                })
            }
        }
    })
}
module.exports.recover = async (req, res)=>{
    Category.findOne({_id:req.query.id}, (err, cat)=>{
        if(err){
            res.status(500).send()
        }
        else{
            if (!cat){
                res.status(404).send()
            }
            else{
                cat.status = true
                cat.save((err, cat)=>{
                    if(err){
                        res.status(500).send(err)
                    }
                    else{
                        console.log(cat.catName+" was recovered")
                        res.redirect('/admin/category/trash')
                    }
                })
            }
        }
    })
}
module.exports.trash = async (req, res)=>{
    var categories = await Category.find({status: false})
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('category-trash', {activepage: 'cat-trash' ,layout: './layouts/common', cats: categories, user:user})
}
module.exports.trashSearch = async (req, res)=>{
    var search = req.query.search
    var categories = await Category.find({catName: new RegExp(search.toLowerCase(),'i'),status: false})
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('category-trash', {activepage: 'cat-trash' ,layout: './layouts/common', cats: categories, user:user})
}