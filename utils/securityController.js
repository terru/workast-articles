/**
 * Helper for security checks and validate outer params
 * @usage var controller = new SecurityController();
 *        controller.cleanup(paramToClean);
 *        controller.getValidid(id);
 */


var config = require('../config');
var sanitize = require('mongo-sanitize');
var mongoose = require('mongoose');

var SecurityController = function () {

    this.cleanup = function (param) {
        var clean = sanitize(param);
        return clean;
    };

    this.getValidId = function (param) {
        //Primero nos aseguramos que no tenga ninguna injection
        var clean = sanitize(param);
        //Despues que sea uno valido
        if (mongoose.Types.ObjectId.isValid(clean)) {
            return clean;
        }
        return false;//si no es válido retornar falso;
    };
};

module.exports = SecurityController;