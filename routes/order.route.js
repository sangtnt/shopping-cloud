var express = require('express');
var router = express.Router();
var orderController = require('../controllers/order.controller')
var middleware = require('../middlewares/auth.middleware')

router.get('/',middleware.requireAuth, middleware.checkIsOrderManager, orderController.index)
router.get('/search',middleware.requireAuth, middleware.checkIsOrderManager, orderController.search)
router.get('/adding',middleware.requireAuth, middleware.checkIsOrderManager, orderController.adding)
router.get('/details',middleware.requireAuth, middleware.checkIsOrderManager, orderController.orderDetails)
router.get('/changeStatus',middleware.requireAuth, middleware.checkIsOrderManager, orderController.changeStatus)
module.exports = router;