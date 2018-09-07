//schemas
var User = require('../models/user');

//utils
var myLogClass = require('../utils/logger');
var logger = new myLogClass();
var securityController = require('../utils/securityController');
var sanitize = new securityController();


//configs
var config = require('../config');


//GET controller for /api/users
exports.listUsers = function (req, res, next) {
    User.find(function (err, users) {
        if (err) {
            logger.error('Error in users retrieve');
            logger.error(err);
            return next(err);
        }
        res.json({message: "Users retrieved", users: users});
    });
};


//POST controller for /api/users
exports.createUser = function (req, res, next) {
    var user = new User();
    //TODO validate name and URL
    user.name = validName;
    user.avatar = validUrl;
    user.created_at = new Date();
    user.updated_at = new Date();
    user.save(function (err) {
        if (err) {
            logger.error('Error in user creation');
            logger.error(err);
            return next(err);
        }
        logger.info('User with name: ' + user.name + ' successfully created');
        return res.json({message: 'User created', user: user});
    });
};
