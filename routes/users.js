var userController = require('../controllers/userController');
var express = require('express');
var router = express.Router();

// '/api/users'
router.route('/')
    .get(userController.listUsers)
    .post(userController.createUser);

module.exports = router;