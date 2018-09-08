var authController = require('../controllers/authController');
var articleController = require('../controllers/articleController');
var express = require('express');
var router = express.Router();

// '/api/articles'
router.route('/')
    .get(authController.isAppAuthenticated, articleController.listArticles)
    .post(authController.isAppAuthenticated, articleController.createArticle);

// /api/articles/:id
router.route('/:id')
    .put(authController.isAppAuthenticated, articleController.updateArticle)
    .delete(authController.isAppAuthenticated, articleController.deleteArticle);

module.exports = router;