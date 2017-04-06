const express = require('express');
const ensure = require('connect-ensure-login');
const SpotifyWebApi = require('spotify-web-api-node');

const Book = require('../models/book-model.js');
const Song = require('../models/song-model.js');
const bookRoutes = express.Router();

const multer = require('multer');

const upload = multer({ dest: __dirname + '/../public/uploads/'});





bookRoutes.get('/books', ensure.ensureLoggedIn('/'), (req, res, next) => {
  Book.find({ owner: req.user._id }, (err, myBooks) => {
    if (err) {
      next(err);
      return;
    }
    res.render('books/books-index.ejs', { books: myBooks });
  });
});




bookRoutes.get('/books/new', ensure.ensureLoggedIn('/'),
(req, res, next) => {
  res.render('books/new.ejs', {
    message: req.flash('success')
  });
});




bookRoutes.post('/books', ensure.ensureLoggedIn('/'), upload.single('picture'),
(req, res, next) => {
  let bookInfo = '';

  var filename = req.file.filename;

  if (filename === undefined){
    bookInfo = {
      title: req.body.title,
      author: req.body.author,
      owner: req.user._id,
      img_path: `/uploads/${defaultCover}`
    };
  } else {
    bookInfo = {
      title: req.body.title,
      author: req.body.author,
      owner: req.user._id,
      img_path: `/uploads/${filename}`
    };
  }

  console.log("Trying to see this object: " + req.file.filename);

  const newBook = new Book(bookInfo);

  console.log("New book: " + newBook);

  newBook.save((err) => {
    if (err) {
      next(err);
      return;
    } else {
      console.log("new book created");
      //redirect to http://localhost:3000/books
        //                               ---------
          //                                  |
            //       --------------------------
              //     |
              res.redirect('/books');
    }
  });
});





bookRoutes.get('/books/:id', (req, res, next) => {
    //                 --
    //                  |
    //                  --------
    //                         |
  const bookId = req.params.id;

  Book.findById(bookId, (err, bookDoc) => {
    if (err) {
      next(err);
      return;
    }
  Song.find({owner: bookId}, (err, song) => {
    if(err) {
      console.log(err);
      return;
    }
    console.log("Is song defined??? Lets find out!" + song);

    res.render('books/show', {
      book: bookDoc,
      songs: song
    });
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
    res.redirect('/books', {});
  });
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






bookRoutes.post('/books/:id/search-spotify', (req, res, next) => {
  const bookId = req.params.id;
  const term = req.body.searchTrack;
  const spotify = new SpotifyWebApi();

  // spotify.searchTracks(term, {}, (err, results) => {
  //   if (err) {
  //     res.send('Oh noes! Error!');
  //     return;
  //   }

  //Search tracks whose name, album or artist contains 'Love'

  spotify.searchTracks(term, { limit : 3})
  .then(function(data) {

    Book.findById(bookId, (err, bookDoc) => {
      if (err) {  next(err);return; }
      res.render("books/show", {
        response: data.body,
        book: bookDoc,
        bookId: bookId
      });
    });
  }, function(err) {
    console.log('Something went wrong!', err);
    });
     //const theTrack = results.body.tracks.items[1];
    // const theTrack = data.body.artists.items[1];

    // Object still needs to be identified
    // const newSong = new Song ({
    //   artist: req.body.artist,
    //   track: req.body.track,
    //   url: req.body.url,
    //   owner: req.user._id
    // });
});










module.exports = bookRoutes;
