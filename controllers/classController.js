const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const Class = require("../models/Class");
const cloudinary = require("cloudinary");
const { getDataUri } = require("../utils/dataUri");
const Book = require("../models/Book");
const Chapter = require("../models/Chapter");
const Lecture = require("../models/Lecture");
const Comment = require("../models/Comment");
const User = require("../models/User");

exports.createClass = catchAsyncError(async (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return next(new ErrorHandler("Please Fill all the Fields", 400));
  }

  const file = req.file;

  let secure_url = null;
  let public_id = null;

  if (file) {
    const fileUri = await getDataUri(file);
    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
      folder: "ksolve",
    });

    secure_url = myCloud.secure_url;
    public_id = myCloud.public_id;
  }

  const clas = await Class.create({
    user: req.userId,
    title,
    description,
    image: {
      public_id,
      url: secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Class created successfully",
    clas,
  });
});

exports.getAllClasses = catchAsyncError(async (req, res, next) => {
  const classes = await Class.find({}).lean();

  res.status(200).json({
    success: true,
    classes,
  });
});

exports.getClass = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(req.userId);
  if (!user.enrolledClasses.includes(id)) {
    return next(new ErrorHandler("You are not enrolled in this class", 403));
  }
  const clas = await Class.findById(id);
  if (!clas) return next(new ErrorHandler("Class not found", 404));

  res.status(200).json({
    success: true,
    clas,
  });
});

exports.enrollInClass = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(req.userId);
  if (user.enrolledClasses.includes(id)) {
    return next(
      new ErrorHandler("You are already enrolled in this class", 403)
    );
  }

  user.enrolledClasses.push(id);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Class enrolled successfully",
  });
});

exports.getAllEnrolledClasses = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId).populate({
    path: "enrolledClasses",
    select: "title description image",
  });

  const enrolledClasses = user.enrolledClasses;

  res.status(200).json({
    success: true,
    enrolledClasses,
  });
});

exports.deleteClass = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const clas = await Class.findById(id);
  if (!clas) return next(new ErrorHandler("Class not found", 404));

  if (clas.user.toString() !== req.userId) {
    return next(new ErrorHandler("You are not authorized", 403));
  }

  if (clas.image.public_id) {
    await cloudinary.v2.uploader.destroy(clas.image.public_id);
  }

  const books = await Book.find({ class: id });
  const bookIds = books.map((book) => book._id);

  // Find all chapters for the books
  const chapters = await Chapter.find({ book: { $in: bookIds } });
  const chapterIds = chapters.map((chapter) => chapter._id);

  // Find all lectures for the chapters
  const lectures = await Lecture.find({ chapter: { $in: chapterIds } });
  const lectureIds = lectures.map((lecture) => lecture._id);
  lectureIds.forEach(async (id) => {
    const lecture = await Lecture.findById(id);
    if (lecture.video.public_id) {
      await cloudinary.v2.uploader.destroy(lecture.video.public_id);
    }
  });

  // Delete all comments , lectures , chapters and books associated with the class
  await Comment.deleteMany({ lecture: { $in: lectureIds } });
  await Lecture.deleteMany({ chapter: { $in: chapterIds } });
  await Chapter.deleteMany({ book: { $in: bookIds } });
  await Book.deleteMany({ class: id });

  await clas.deleteOne();
  res.status(200).json({
    success: true,
    message: "Class deleted successfully",
  });
});
