const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

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
