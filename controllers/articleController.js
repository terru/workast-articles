//requerir el documento
var App = require('../models/article');

//requerir el loger
var myLogClass = require('../utils/logger');
var logger = new myLogClass();

//requerir el generador de keys
var bCrypt = require('bcrypt-nodejs');
var config = require('../config');

//requerir el helper de seguridad
var securityController = require('../utils/securityController');
var sanitize = new securityController();

//simuacion de semilla para app_keys
KEY_SEED = 'adacqwe';


//Generador de app_key y app_secrets
function Key_gen() {
    var seed = KEY_SEED + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    return bCrypt.hashSync(seed, false);
}

//Métodos GET para /api/applications
exports.listApps = function (req, res, next) {
    App.find(function (err, apps) {
        if (err) {
            logger.error('Error al intentar recuperar todas las aplicaciones');
            logger.error('El error es: ' + err);
            return next(err);
        }
        res.json({message: "Las aplicaciones son: ", applications: apps});
    });
};

exports.getApp = function (req, res, next) {
    var validId = sanitize.getValidId(req.params.id);
    if (validId == false) {
        return res.json(412, {message: "Id inválido"});
    }
    App.findOne({_id: validId}, function (err, app) {
        if (err) {
            logger.error('Error al buscar una  app con id: ' + req.params.id + ' el error es:');
            logger.error(err);
            return next(err);
        }
        if (app != undefined) {
            return res.json({message: "La app es: ", app: app});
        } else {
            return res.json({message: 'No existe la app'});
        }
    });
};


// Métodos POST para /api/applications
exports.createApp = function (req, res, next) {
    var app = new App();
    app.app_key = Key_gen();
    app.app_secret = Key_gen();
    app.created_at = new Date();
    app.updated_at = new Date();
    app.save(function (err) {
        if (err) {
            logger.error('Error al añadir  la aplicación con app_key: ' + app.app_key + ' el error es:');
            logger.error(err);
            return next(err);
        }
        logger.info('App añadida con éxito');
        return res.json({message: 'App añadida', app: app});
    });

};


//Métodos PUT para /api/applications
//ESTE METODO VUELVE A ASIGNAR APP_KEY Y APP_SECRET
exports.updateApp = function (req, res, next) {
    var validId = sanitize.getValidId(req.params.id);
    if (validId == false) {
        return res.json(412, {message: "Id inválido"});
    }
    App.findOne({_id: validId},
        function (err, app) {
            if (err) {
                logger.error('Error al actualizar la aplicación: ' + req.params.id + 'el error es:');
                logger.error(err);
                return next(err);
            }
            //modifico los atributos de la app
            app.updated_at = new Date();
            app.app_key = Key_gen();
            app.app_secret = Key_gen();
            // guardo la app
            app.save(function (err) {
                if (err) {
                    return res.json(err);
                }
                logger.info('Se actualizó la app con id: ' + req.params.id);
                res.json({message: 'App updated!', app: app});
            });
        });
};


//Métodos DELETE de /api/applications
exports.deleteApp = function (req, res, next) {
    var validId = sanitize.getValidId(req.params.id);
    if (validId == false) {
        return res.json(412, {message: "Id inválido"});
    }
    App.remove({_id: validId},
        function (err, app) {
            if (err) {
                logger.error('Error al intentar borrar la aplicación: ' + req.params.id, ' el error es:');
                logger.error(err);
                return next(err);
            }
            logger.info('La aplicación: ' + req.params.id + ' fue eliminada exitosamente');
            res.json({message: 'Eliminacion exitosa'});
        });
};
