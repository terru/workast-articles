//models
var User = require('../models/user');
var Article = require('../models/article');

//utils
var myLogClass = require('../utils/logger');
var logger = new myLogClass();
var securityController = require('../utils/securityController');
var sanitize = new securityController();


//GET controller for/api/articles
exports.listArticles = function (req, res, next) {
    console.log(req.query.tags);
    //TODO poner aca la solucion para 1 solo tag
    //list all articles if not tags specifed
    var filter = {}; //dinamic filter, you can add more filter like with AND logic if you want HERE
    if (req.query.tags && req.query.tags.length > 0) {
        //sanitize tags to avoid mongo injection
        var sanitized = [];
        for (var t in req.query.tags) {
            sanitized.push(sanitize.cleanup(req.query.tags[t]));
        }
        console.log(sanitized);
        filter.tags = {$all: sanitized};
    }
    Article.find(filter, function (err, articles) {
        if (err) {
            logger.error('Error in articles retrieving');
            logger.error(err);
            return next(err);
        }
        //fixme you maybe will need to add pagination for navigate the articles listing
        res.json({message: "Articles retrieved", articles: articles});
    });
};

//POST controller for /api/articles
exports.createArticle = function (req, res, next) {
    //Do some validations
    //Fixme validations could be maded by mongoose or an specific library
    //title and text are required and the article at least needs 1 tag
    if (!req.body.title) return res.status(412).json({message: "Article title is required"});
    if (!req.body.text) return res.status(412).json({message: "Article text is required"});
    //the user id must be a valid mongo id
    var validUserId = sanitize.getValidId(req.body.userId);
    if (validUserId == false) return res.status(412).json({message: "Invalid User Id"});

    var tags = req.body.tags ? req.body.tags.replace(/\s/g, '').split(",") : [];
    if (tags.length < 1) return res.status(412).json({message: "The article needs at least one tag"});

    //check that user exists
    var article = new Article();
    User.findById(validUserId, function (err, usr) {
        if (err) {
            logger.error("Error looking for a user in article creation");
            logger.error(err);
            return next(err);
        }
        if (!usr) return res.status(412).json({message: "The User doesn't exist"});
        article.userId = usr._id;
        article.title = req.body.title;
        article.text = req.body.text;
        article.tags = tags;
        article.created_at = new Date();
        article.updated_at = new Date();
        article.save(function (err) {
            if (err) {
                logger.error('Error in article creation');
                logger.error(err);
                return next(err);
            }
            logger.info('Article with id: ' + article._id + " successfully created");
            return res.json({message: 'Article created', article: article});
        });
    });
};


//controllers for /api/article/:id


//controller for PUT /api/articles/:id
exports.updateArticle = function (req, res, next) {
    const private_update = function (articleId, userId) {
        Article.findById(articleId, function (err, article) {
            if (err) {
                logger.error('Error al actualizar la aplicación: ' + req.params.id + 'el error es:');
                logger.error(err);
                return next(err);
            }
            //update all the article properties that comes in the request chechinkg special cases
            for (var prop in article) {
                switch (prop) {
                    case "userId":
                        //use the validated userId
                        if (userId) article.userId = userId;
                        break;
                    case "tags":
                        article.tags = req.body.tags.split(",");
                        break;
                    default:
                        article[prop] = req.body[prop];
                }
            }
            //set de last_updated date;
            article.updated_at = new Date();
            // guardo la app
            article.save(function (err) {
                if (err) {
                    return res.json(err);
                }
                logger.info('Article with id : ' + req.params.id + 'successfully updated');
                res.json({message: 'Article updated!', article: article});
            });
        });
    };
    var validId = sanitize.getValidId(req.params.id);
    if (validId == false) {
        return res.status(412).json({message: "Invalid Article Id"});
    }
    //the request could come with userId to change article ownership
    if (req.body.userId) {
        var validUserId = sanitize.getValidId(req.body.userId);
        if (validUserId == false) return res.status(412).json({message: "Invalid User Id"});
        User.findById(validUserId, function (err, usr) {
            if (err) {
                logger.error("Error looking for an user for article with id:" + validId + "updating");
                logger.error(err);
                return next(err);
            }
            if (!usr) {
                return res.status(412).json({message: "The User doesn't exist"});
            }
            return private_update(validId, validUserId);
        });
    } else {
        //without ownership change, discard not needed databases querys
        return private_update(validId);
    }
};


//controller for DELETE /api/articles/:id
exports.deleteArticle = function (req, res, next) {
    var validId = sanitize.getValidId(req.params.id);
    if (validId == false) {
        return res.status(412).json({message: "Invalid Article Id"});
    }
    //Fixme we could use logical deletion in the short term
    Article.deleteOne({_id: validId}, function (err) {
        if (err) {
            logger.error('Error trying to delete an article with id: ' + req.params.id);
            logger.error(err);
            return next(err);
        }
        logger.info('Article ' + req.params.id + ' successfully deleted ');
        res.json({message: 'Article deleted'});
    });
};
