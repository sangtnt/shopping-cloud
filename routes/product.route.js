var express = require('express');
var router = express.Router();
var productController = require('../controllers/product.controller')
const upload = require("../controllers/upload")
var middleware = require('../middlewares/auth.middleware')

router.get('/',middleware.requireAuth, middleware.checkIsProductManager, productController.index)
router.get('/search',middleware.requireAuth, middleware.checkIsProductManager, productController.search)
router.get('/adding',middleware.requireAuth, middleware.checkIsProductManager, productController.adding)
router.post('/adding',middleware.requireAuth, middleware.checkIsProductManager, upload.single("proFile"), productController.postAdding)
router.post('/editing',middleware.requireAuth, middleware.checkIsProductManager, upload.single("proFile"), productController.postEditing)
router.get('/editing',middleware.requireAuth, middleware.checkIsProductManager, productController.editing)
router.get('/deleting',middleware.requireAuth, middleware.checkIsProductManager, productController.deleting)
router.get('/trash',middleware.requireAuth, middleware.checkIsProductManager, productController.trash)
router.get('/recover',middleware.requireAuth, middleware.checkIsProductManager, productController.recover)
router.get('/stockin',middleware.requireAuth, middleware.checkIsProductManager, productController.stockin)
router.post('/stockin',middleware.requireAuth, middleware.checkIsProductManager, productController.postStockin)

module.exports = router;