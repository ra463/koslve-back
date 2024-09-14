const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const Book = require("../models/Book");
const Chapter = require("../models/Chapter");
const Lecture = require("../models/Lecture");
const Comment = require("../models/Comment");

exports.createBook = catchAsyncError(async (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return next(new ErrorHandler("Please Fill all the Fields", 400));
  }

  const { classId } = req.params;

  const book = await Book.create({
    class: classId,
    title,
    description,
  });

  res.status(201).json({
    success: true,
    book,
  });
});

exports.getAllBooks = catchAsyncError(async (req, res, next) => {
  const { classId } = req.params;
  const books = await Book.find({ class: classId }).lean();

  res.status(200).json({
    success: true,
    books,
  });
});

exports.getBook = catchAsyncError(async (req, res, next) => {
  const { bookId } = req.params;

  const book = await Book.findById(bookId);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  res.status(200).json({
    success: true,
    book,
  });
});

exports.deleteBook = catchAsyncError(async (req, res, next) => {
  const { bookId } = req.params;

  const book = await Book.findById(bookId);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  const chapters = await Chapter.find({ book: bookId });
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

  // Delete all comments , lectures , chapters associated with the book
  await Comment.deleteMany({ lecture: { $in: lectureIds } });
  await Lecture.deleteMany({ chapter: { $in: chapterIds } });
  await Chapter.deleteMany({ book: { $in: bookId } });

  await book.deleteOne();
  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
});
