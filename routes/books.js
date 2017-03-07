const express = require('express');

const Book = require('../models/book.js');

const router = express.Router();


router.get('/books', (req, res, next) => {
  Book.find((err, books) => {
    if (err) {
      next(err);
      return;
    }

      // display views/books/index.ejs
    res.render('books/index', {
      books: books
    });
  });
});

router.get('/books/new', (req, res, next) => {
    // display views/products/new.ejs
  res.render('books/new', {
    errorMessage: ''
  });
});

router.post('/books', (req, res, next) => {
  const book = {
    title: req.body.title,
    author: req.body.author,
  };

  const theBook = new Book(book);

  theBook.save((err) => {
    if (err) {
      res.render('books/new', {
        errorMessage: 'Validation failed!',
        errors: theBook.errors
      });
      return;
    }

      // redirect to http://localhost:3000/books
      //                                  ---------
      //                                       |
      //              --------------------------
      //              |
    res.redirect('/books');
  });
});

router.get('/books/:id', (req, res, next) => {
    //                 --
    //                  |
    //                  --------
    //                         |
  const bookId = req.params.id;

    // db.books.findOne({ _id: bookId })
  Book.findById(bookId, (err, bookDoc) => {
    if (err) {
      next(err);
      return;
    }

    res.render('books/show', {
      book: bookDoc
    });
  });
});

router.get('/books/:id/edit', (req, res, next) => {
  const bookId = req.params.id;

  Book.findById(bookId, (err, bookDoc) => {
    if (err) {
      next(err);
      return;
    }

    res.render('books/edit', {
      book: bookDoc
    });
  });

});

router.post('/books/:id', (req, res, next) => {
  const bookId = req.params.id;
  const bookUpdates = {
    title: req.body.title,
    author: req.body.author,
  };

    // db.books.updateOne({ _id: bookId }, { $set: bookUpdates })
  Book.findByIdAndUpdate(bookId, bookUpdates, (err, book) => {
    if (err) {
      next(err);
      return;
    }

      // redirect to http://localhost:3000/books
      //                                  ---------
      //                                       |
      //               -------------------------
      //               |
    res.redirect('/books');
  });
  console.log("Updated and Saved?");
});

router.post('/books/:id/delete', (req, res, next) => {
  const bookId = req.params.id;

    // db.books.deleteOne({ _id: bookId })
  Book.findByIdAndRemove(bookId, (err, book) => {
    if (err) {
      next(err);
      return;
    }

      // redirect to http://localhost:3000/books
      //                                  ---------
      //                                       |
      //               -------------------------
      //               |
    res.redirect('/books');
  });
});


module.exports = router;
