var express = require('express');
var router = express.Router();
var productController = require('../../controllers/client/product.controller')
var middleware = require('../../middlewares/auth.middleware')

router.get('/products-by-category', productController.proByCat)
router.get('/search', productController.search)
router.get('/product-details', productController.productDetails)
router.post('/addtocart',middleware.requireAuth,middleware.checkIsCustomer, productController.addtocart)
router.get('/cart',middleware.requireAuth,middleware.checkIsCustomer, productController.cart)
router.get('/removeItemFromCart',middleware.requireAuth,middleware.checkIsCustomer, productController.removeItemFromCart)
router.get('/checkout',middleware.requireAuth,middleware.checkIsCustomer, productController.checkout)

module.exports = router;