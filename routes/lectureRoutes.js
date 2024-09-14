const express = require("express");
const {
  createLecture,
  getAllLectures,
  getLecture,
  deleteLecture,
} = require("../controllers/lectureController");
const { auth, isAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/multer");

const router = express.Router();

router.post("/create-lecture/:chapterId", auth, isAdmin, upload, createLecture);
router.get("/get-all-lectures/:chapterId", auth, getAllLectures);
router.get("/get-lecture/:lectureId", auth, getLecture);
router.delete("/delete-lecture/:lectureId", auth, isAdmin, deleteLecture);

module.exports = router;
