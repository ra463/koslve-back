const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const Chapter = require("../models/Chapter");
const Lecture = require("../models/Lecture");
const Comment = require("../models/Comment");

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

exports.deleteChapter = catchAsyncError(async (req, res, next) => {
  const { chapterId } = req.params;

  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return next(new ErrorHandler("Chapter not found", 404));

  const lectures = await Lecture.find({ chapter: chapterId });
  const lectureIds = lectures.map((lecture) => lecture._id);
  lectureIds.forEach(async (id) => {
    const lecture = await Lecture.findById(id);
    if (lecture.video.public_id) {
      await cloudinary.v2.uploader.destroy(lecture.video.public_id);
    }
  });

  await Comment.deleteMany({ lecture: { $in: lectureIds } });
  await Lecture.deleteMany({ chapter: chapterId });

  await chapter.deleteOne();

  res.status(200).json({
    success: true,
    message: "Chapter deleted successfully",
  });
});
