var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.controller')
const upload = require("../controllers/upload")
var middleware = require('../middlewares/auth.middleware')

router.get('/',middleware.requireAuth, middleware.checkIsAdmin, userController.index)
router.get('/search',middleware.requireAuth, middleware.checkIsAdmin, userController.search)
router.get('/adding',middleware.requireAuth, middleware.checkIsAdmin, userController.adding)
router.post('/adding',middleware.requireAuth, middleware.checkIsAdmin, upload.single("avatar"), userController.postAdding)
router.get('/editing',middleware.requireAuth, middleware.checkIsAdmin, userController.editing)
router.post('/editing',middleware.requireAuth, middleware.checkIsAdmin, upload.single("avatar"), userController.postEditing)
router.get('/deactivate',middleware.requireAuth, middleware.checkIsAdmin, userController.deactivate)
router.get('/activate',middleware.requireAuth, middleware.checkIsAdmin, userController.activate)

module.exports = router;