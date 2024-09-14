const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const Chapter = require("../models/Chapter");

exports.createChapter = catchAsyncError(async (req, res, next) => {
  const { title } = req.body;
  if (!title) return next(new ErrorHandler("Please Add Title", 400));

  const { bookId } = req.params;

  const chapter = await Chapter.create({
    book: bookId,
    title,
  });

  res.status(201).json({
    success: true,
    message: "Chapter created successfully",
    chapter,
  });
});

exports.getAllChapters = catchAsyncError(async (req, res, next) => {
  const { bookId } = req.params;
  const chapters = await Chapter.find({ book: bookId }).lean();

  res.status(200).json({
    success: true,
    chapters,
  });
});

exports.getChapter = catchAsyncError(async (req, res, next) => {
  const { chapterId } = req.params;

  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return next(new ErrorHandler("Chapter not found", 404));

  res.status(200).json({
    success: true,
    chapter,
  });
});