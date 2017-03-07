const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const BookSchema = new Schema({
  content: { type: String, require: true },
  title: String,
  author: String
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;
