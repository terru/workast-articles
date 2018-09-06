// import the necessary modules
//@see http://mongoosejs.com/docs/guide.html
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// define schema
var ArticleSchema = new Schema({
    userId: {type: Schema.ObjectId, ref: "User"}, //article author
    title: String, //the title of the article
    text: String, //the main-text
    tags: [String], //tags to categorize the article
    created_at: Date, //creation_date
    updated_at: Date  //last updated_date
});

module.exports = mongoose.model('Article', ArticleSchema);
