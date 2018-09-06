// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// define schema
var UserSchema = new Schema({
    name: String, //username
    avatar: String, //url to the avatar image
    created_at: Date, //creation date
    updated_at: Date  //last updated date
});

module.exports = mongoose.model('User', UserSchema);
