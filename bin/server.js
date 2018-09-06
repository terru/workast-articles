//Load require packages
var express = require('express');
var mongoose = require('mongoose');
var config = require('../config');
var bodyParser = require('body-parser');
var passport = require('passport');


var app = express(); //Create the Express app
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(passport.initialize());

//routers are defined here
var users = require('../routes/users');
//var articles = require('../routes/articles');

//if your mongo is in a customized location, you can customize from development.json
//@see config/development.json
var urlMongoose = config.Mongo.client + "://" + config.Mongo.host + ":" + config.Mongo.port + "/" + config.Mongo.dbName;

mongoose.Promise = global.Promise;
mongoose.connect(urlMongoose, {useMongoClient: true}, function (err) {
    if (err) {
        console.warn("Error with database conection");
        console.warn("Check the development.json configuration file!");
        throw err;
    }
});

var port = process.env.PORT || 8000;

// Create our Express router
var router = express.Router();

// Initial dummy route for testing
router.get('/', function (req, res) {
    res.json({message: 'API Working!'});
});

// Register all our routes with /api
app.use('/api', router);
app.use('/api/users', users);
//app.use('/api/articles', articles);

//generic error handling from every controller
app.use(function (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    if (err == 401) { //handler para los errores de autorizacion
        return res.status(err).send({message: "Authorization Error"})
    }
    return res.status(500).send(err);
});

// Start the server
app.listen(port);

exports.app = app;

console.log('Express is running in port: ' + port);