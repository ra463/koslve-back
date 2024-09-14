const express = require("express");
const { auth, isAdmin } = require("../middlewares/auth");
const {
  createBook,
  getAllBooks,
  getBook,
  deleteBook,
} = require("../controllers/bookController");

const router = express.Router();

router.post("/create-book/:classId", auth, isAdmin, createBook);
router.get("/get-all-books/:classId", auth, getAllBooks);
router.get("/get-book/:bookId", auth, getBook);
router.delete("/delete-book/:bookId", auth, isAdmin, deleteBook);

module.exports = router;
