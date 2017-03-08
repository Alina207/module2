const express = require('express');
const ensure = require('connect-ensure-login');

const Book = require('../models/book-model.js');

const bookRoutes = express.Router();

// roomsRoutes.get('/user/:id', ensure.ensureLoggedIn(), (req, res, next) => {
//   Room.find({ owner: req.params.id }, (err, myRooms) => {

bookRoutes.get('/books', ensure.ensureLoggedIn(), (req, res, next) => {
  Book.find({ owner: req.user._id }, (err, myBooks) => {
    if (err) {
      next(err);
      return;
    }
    res.render('books/books-index.ejs', { books: myBooks });
  });
});

bookRoutes.get('/books/new', ensure.ensureLoggedIn(),
(req, res, next) => {
  res.render('books/new.ejs', {
    message: req.flash('success')
  });
});


bookRoutes.post('/books',   ensure.ensureLoggedIn(),
(req, res, next) => {
  const newBook = new Book ({
    title: req.body.title,
    author: req.body.author,
    owner: req.user._id
  });


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

bookRoutes.get('/books/:id', (req, res, next) => {
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

bookRoutes.get('/books/:id/edit', (req, res, next) => {
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

bookRoutes.post('/books/:id', (req, res, next) => {
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

bookRoutes.post('/books/:id/delete', (req, res, next) => {
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

module.exports = bookRoutes;
