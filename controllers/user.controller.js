const User = require('../model/user.model')
const Permission = require('../model/permission.model')
const Branch = require('../model/branch.model')
const date = require('date-and-time')
const moment = require ('moment')

module.exports.index = async (req, res)=>{
    var users = await User.find()
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('user', {activepage: 'user' ,layout: './layouts/common' , users: users, moment:moment, user:user})
}
module.exports.search = async (req, res)=>{
    var search = req.query.search
    var users = await User.find({$or:[{username: new RegExp(search.toLowerCase(),'i')},{ phone: new RegExp(search.toLowerCase(),'i')}, {fullname: new RegExp(search.toLowerCase(),'i')}, {email: new RegExp(search.toLowerCase(),'i')}]})
    var user = await User.findOne({_id:req.signedCookies.userId})
    res.render('user', {activepage: 'user' ,layout: './layouts/common' , users: users, moment:moment, user:user})
}
module.exports.adding = async (req, res)=>{
    var pers = await Permission.find()
    var user = await User.findOne({_id:req.signedCookies.userId})
    var branches = await Branch.find({})
    res.render('handle-user', {action: 'adding', activepage: 'user' ,layout: './layouts/common', pers: pers, user:user, branches: branches})
}
module.exports.postAdding = async (req, res)=>{
    var pers = await Permission.find({_id: req.body.per})
    var per = pers[0]
    const now  =  new Date();
    var newuser = new User({
        username: req.body.username,
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        status: true,
        permission: {...per},
        avatar: "/"+req.file.path,
        joined: now,
        password: req.body.password
    })
    if (per.perName==="PRODUCT_MANAGER"){
        var branch = await Branch.findOne({_id: req.body.branch})
        console.log(branch)
        newuser.branch = {...branch}
    }
    newuser.save((err, newuser)=>{
        if (err){
            res.status(500).send()
            return
        }
        console.log(newuser.username + " saved in database!")
        res.redirect("/admin/user")
    })
}
module.exports.editing = async(req, res)=>{
    var pers = await Permission.find()
    var useredit =  await User.findOne({_id : req.query.id})
    var user = await User.findOne({_id:req.signedCookies.userId})
    var branches = await Branch.find({})
    res.render('handle-user', {action: 'editing', activepage: 'user' ,layout: './layouts/common', pers: pers, user: user, useredit: useredit, branches: branches})
}

module.exports.postEditing = async (req, res)=>{
    var pers = await Permission.find({_id: req.body.per})
    var per = pers[0]
    User.findOne({_id: req.body.userId}, async (err, user)=>{
        user.username= req.body.username
        user.fullname= req.body.fullname
        user.email= req.body.email
        user.phone= req.body.phone
        user.address= req.body.address
        user.permission= {...per},
        user.password= req.body.password
        if(req.file){
            if(req.file.path!==""){
                user.avatar= "/"+req.file.path
            }
        }
        if (per.perName==="PRODUCT_MANAGER"){
            var branch = await Branch.findOne({_id: req.body.branch})
            console.log(branch)
            user.branch = {...branch}
        }
        else{
            user.branch = undefined
        }
        user.save((err, user)=>{
            if (err){
                res.status(500).send()
                return
            }
            console.log(user.username + " updated in database!")
            res.redirect("/admin/user")
        })
    })
}

module.exports.deactivate = async (req, res)=>{
    User.findOne({_id: req.query.id}, (err, user)=>{
        user.status = false
        user.save((err, user)=>{
            if (err){
                res.status(500).send()
                return
            }
            console.log(user.username + " deactivated!")
            res.redirect("/admin/user")
        })
    })
}

module.exports.activate = async (req, res)=>{
    User.findOne({_id: req.query.id}, (err, user)=>{
        user.status = true
        user.save((err, user)=>{
            if (err){
                res.status(500).send()
                return
            }
            console.log(user.username + " activated!")
            res.redirect("/admin/user")
        })
    })
}