const express = require("express");
const { auth, isAdmin } = require("../middlewares/auth");
const {
  createChapter,
  getAllChapters,
  getChapter
} = require("../controllers/chapterController");

const router = express.Router();

router.post("/create-chapter/:bookId", auth, isAdmin, createChapter);
router.get("/get-all-chapters/:bookId", auth, getAllChapters);
router.get("/get-chapter/:chapterId", auth, getChapter);

module.exports = router;
