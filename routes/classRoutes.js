const express = require("express");
const { auth, isAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/multer");
const {
  createClass,
  getAllClasses,
  getClass,
  deleteClass,
  getAllEnrolledClasses,
} = require("../controllers/classController");

const router = express.Router();

router.post("/create-class", auth, isAdmin, upload, createClass);
router.get("/get-all-class", auth, getAllClasses);
router.get("/get-class/:id", auth, getClass);
router.get("/get-enrolled-classes", auth, getAllEnrolledClasses);
router.delete("/delete-class/:id", auth, isAdmin, deleteClass);

module.exports = router;
