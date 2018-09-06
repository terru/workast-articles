var appController = require('../controllers/userController');
var express = require('express');
var router = express.Router();


// '/api/applications'
router.route('/')
    .get(appController.listApps)
    .post(appController.createApp);

// '/api/applications/:id'
router.route('/:id')
    .get(appController.getApp)
    .delete(appController.deleteApp)
    .put(appController.updateApp);

module.exports = router;