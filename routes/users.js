var authController = require('../controllers/authController');
var userController = require('../controllers/userController');
var express = require('express');
var router = express.Router();

// '/api/users'
router.route('/')
    .get(authController.isAppAuthenticated, userController.listUsers)
    .post(authController.isAppAuthenticated, userController.createUser);

module.exports = router;