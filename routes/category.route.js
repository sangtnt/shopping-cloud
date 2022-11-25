var express = require('express');
var router = express.Router();
var categoryController = require('../controllers/category.controller')
const upload = require("../controllers/upload")
var middleware = require('../middlewares/auth.middleware')

router.get('/',middleware.requireAuth, middleware.checkIsProductManager, categoryController.index)
router.get('/search',middleware.requireAuth, middleware.checkIsProductManager, categoryController.search)
router.get('/adding',middleware.requireAuth, middleware.checkIsProductManager, categoryController.adding)
router.post('/adding',middleware.requireAuth, middleware.checkIsProductManager, upload.single("catFile"), categoryController.postAdding)
router.get('/editing',middleware.requireAuth, middleware.checkIsProductManager, categoryController.editing)
router.post('/editing',middleware.requireAuth, middleware.checkIsProductManager, upload.single("catFile"), categoryController.postEditing)
router.get('/deleting',middleware.requireAuth, middleware.checkIsProductManager, categoryController.deleting)
router.get('/trash',middleware.requireAuth, middleware.checkIsProductManager, categoryController.trash)
router.get('/recover',middleware.requireAuth, middleware.checkIsProductManager, categoryController.recover)

module.exports = router;