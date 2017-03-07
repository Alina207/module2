var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get("/:id", (req, res, next) => {
  console.log(req.user);
  res.render("profile", {books: req.user.bookList});
});

module.exports = router;
