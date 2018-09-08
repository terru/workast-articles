/**
 * Controller to do different auth checks
 * Today: Token authorization
 * Next: User authentication // authorization
 * Next: Rols Checking
 * @type {Passport|exports|module.exports}
 */

//authentication library
var passport = require('passport');
BearerStrategy = require('passport-http-bearer').Strategy;


var myLogClass = require('../utils/logger');
var logger = new myLogClass('access');

/***
 * This is the verification function, use to make the token checks that you want
 * @param token
 * @param cb
 */
function verify_token(token, cb) {
    //dev mode
    if (!process.env.TOKEN) return cb(null, true);
    //we only check the token against enviroment variable for now
    return cb(null, token === process.env.TOKEN);
}


//token verification with passport
passport.use(new BearerStrategy({passReqToCallback: true},// activate the callback to re-use the function in routers
        function (req, token, done) {
            //token verification async method, to change if it is necessary
            verify_token(token, function (err, result) {
                if (err) {
                    logger.error("Error in verification of token: " + token);
                    logger.error(error);
                    return done(401, err);
                }
                //check the authorization result
                if (!result) return done(401, null);
                else return done(null, req);
            });
        })
);


/**
 * Use this function to validate each route with the token
 * @usage router.route('/').get(authController.isAppAuthenticated,controller.cotrollerFunction)
 */
exports.isAppAuthenticated = passport.authenticate('bearer', {session: false});