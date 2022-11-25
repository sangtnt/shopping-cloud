const express = require('express')
const expressLayouts = require('express-ejs-layouts')

require('dotenv').config()
const Product = require('./model/product.model')
const fs = require('fs');

// let rawdata = fs.readFileSync('./products.json');
// let pros = JSON.parse(rawdata);
// pros.forEach(pro => {
// 	var newpro = new Product({...pro})
// 	newpro.save((err, newpro)=>{
//         if (err){
//             return
//         }
//         console.log(newpro.proName + " saved in database!")
//     })
// });

//router
const homeRouter = require('./routes/home.route');
const homeClientRouter = require('./routes/client/home.route');
const userClientRouter = require('./routes/client/user.route');
const productClientRouter = require('./routes/client/product.route');
const authRouter = require('./routes/auth.route');
const categoryRouter = require('./routes/category.route');
const productRouter = require('./routes/product.route');
const userRouter = require('./routes/user.route');
const orderRouter = require('./routes/order.route');
const mongoose = require('mongoose');
const bodyparser = require('body-parser')
const url = process.env.DB_PATH;
const cookieParser = require('cookie-parser')

const app = express()
//config view engine
app.use(expressLayouts)
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
app.use(cookieParser(process.env.SECRET_KEY))
try{
	mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
	console.log("Database created!")
}
catch(err){
	if (err) throw err
}

//register static files
app.use("/public", express.static('./public'))

//redirect admin
app.use('/admin', homeRouter)
app.use('/auth', authRouter)
app.use('/admin/category', categoryRouter)
app.use('/admin/product', productRouter)
app.use('/admin/user', userRouter)
app.use('/admin/order', orderRouter)

//redirect client
app.use('/', homeClientRouter)
app.use('/product', productClientRouter)
app.use('/user', userClientRouter)

//open port
var port = process.env.PORT||3000
app.listen(port, ()=>{
	console.log('this port is listen on port '+port)
})