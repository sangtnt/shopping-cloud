const User = require('../model/user.model')
module.exports.requireAuth = async (req, res, next)=>{
    if (!req.signedCookies.userId){
        res.redirect('/auth/login')
        return
    }
    var user = await User.findOne({_id:req.signedCookies.userId})
    if (!user){
        res.redirect('/auth/login')
        return
    }
    res.locals.user = user
    next()
}
module.exports.checkPermissionManager = async (req, res, next)=>{
    if(res.locals.user.permission.perName==="CUSTOMER"){
        res.status(400).send('you do not have MANAGER role to do this action')
        return
    }
    next()
}
module.exports.checkIsCustomer = async (req, res, next)=>{
    if(res.locals.user.permission.perName!=="CUSTOMER"){
        res.status(400).send('you do not have CUSTOMER role to do this action')
        return
    }
    next()
}
module.exports.checkIsProductManager = async (req, res, next)=>{
    if(res.locals.user.permission.perName!=="PRODUCT_MANAGER"){
        res.status(400).send('you do not have PRODUCT MANAGER role to do this action')
        return
    }
    next()
}
module.exports.checkIsAdmin = async (req, res, next)=>{
    if(res.locals.user.permission.perName!=="ADMIN"){
        res.status(400).send('you do not have ADMIN role to do this action')
        return
    }
    next()
}
module.exports.checkIsOrderManager = async (req, res, next)=>{
    if(res.locals.user.permission.perName!=="ORDER_MANAGER"){
        res.status(400).send('you do not have ORDER MANAGER role to do this action')
        return
    }
    next()
}