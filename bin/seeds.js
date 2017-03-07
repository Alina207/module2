const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/3000');

const Book = require('../models/book.js');

const books = [
  {
    title: 'Book 1',
    author: 'Author 1',
  },
  {
    title: 'Book 2',
    author: 'Author 2',
  },
  {
    name: 'Book 3',
    author: 'Author 3',
  }
];

Book.create(books, (err, docs) => {
  if (err) {
    throw err;
  }

  docs.forEach((oneBook) => {
    console.log(`${oneBook.name} ${oneBook._id}`);
  });

  mongoose.disconnect();
});
