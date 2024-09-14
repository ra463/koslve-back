const express = require("express");
const { auth, isAdmin } = require("../middlewares/auth");
const {
  createBook,
  getAllBooks,
  getBook,
} = require("../controllers/bookController");

const router = express.Router();

router.post("/create-book/:classId", auth, isAdmin, createBook);
router.get("/get-all-books/:classId", auth, getAllBooks);
router.get("/get-book/:bookId", auth, getBook);

module.exports = router;
