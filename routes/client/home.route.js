var express = require('express');
var router = express.Router();
var homeController = require('../../controllers/client/home.controller')

router.get('/', homeController.homePage)

module.exports = router;