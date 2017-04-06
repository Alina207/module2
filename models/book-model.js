const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const bookSchema = new Schema({
  content: { type: String, require: true },
  title: String,
  author: String,
  songs: [
    { artist: String,
      track: String,
      url: String}
    ],
  img_path: String,
  //add google API stuff here later
  owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
