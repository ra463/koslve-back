const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const Book = require("../models/Book");

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
    message: "Book created successfully",
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
