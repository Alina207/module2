const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const bookSchema = new Schema({
  content: { type: String, require: true },
  title: String,
  author: String,
  //add google stuff
  owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
