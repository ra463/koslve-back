const express = require("express");
const { auth } = require("../middlewares/auth");
const {
  createComment,
  replyComment,
  getAllComments,
  deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

router.post("/create-comment/:lectureId", auth, createComment);
router.post("/reply-comment/:commentId", auth, replyComment);
router.get("/get-all-comments/:lectureId", auth, getAllComments);
router.delete("/delete-comment/:commentId", auth, deleteComment);

module.exports = router;
