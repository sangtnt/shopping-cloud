var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth.controller')

router.get('/login', authController.login)
router.post('/login', authController.postLogin)
router.post('/loginGoogle', authController.postLoginGoogle)
router.get('/register', authController.register)
router.post('/register', authController.postRegister)
router.get('/logout', authController.logout)

module.exports = router;