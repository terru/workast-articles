//schemas
var User = require('../models/user');

//library
var validUrl = require('valid-url');

//utils
var myLogClass = require('../utils/logger');
var logger = new myLogClass();

function isValidUrl(url) {
    return validUrl.isUri(url);
}

//GET controller for /api/users
exports.listUsers = function (req, res, next) {
    var filter = {}; //dynamic filter empty for now
    User.find(filter, function (err, users) {
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
    if (!req.body.name) return res.status(412).json({message: "The User needs a name"});
    if (!req.body.avatar || !isValidUrl(req.body.avatar)) return res.status(412).json({message: "The avatar needs to be a valid URL"});
    var user = new User();
    user.name = req.body.name;
    user.avatar = req.body.avatar;
    user.created_at = new Date();
    user.updated_at = new Date();
    user.save(function (err) {
        if (err) {
            logger.error('Error in user creation');
            logger.error(err);
            return next(err);
        }
        logger.info('User with id: ' + user._id + ' successfully created');
        return res.json({message: 'User created', user: user});
    });
};
