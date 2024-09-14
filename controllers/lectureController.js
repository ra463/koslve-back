const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const Lecture = require("../models/Lecture");
const Comment = require("../models/Comment");
const cloudinary = require("cloudinary");
const getDataUri = require("../utils/dataUri");

exports.createLecture = catchAsyncError(async (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return next(new ErrorHandler("Please Fill all the Fields", 400));
  }

  const { chapterId } = req.params;

  const file = req.file;
  const fileUri = await getDataUri(file);
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
    folder: "ksolve",
  });

  const lecture = await Lecture.create({
    chapter: chapterId,
    title,
    description,
    video: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Lecture Created Successfully",
    lecture,
  });
});

exports.getAllLectures = catchAsyncError(async (req, res, next) => {
  const { chapterId } = req.params;
  const lectures = await Lecture.find({ chapter: chapterId }).lean();

  res.status(200).json({
    success: true,
    lectures,
  });
});

exports.getLecture = catchAsyncError(async (req, res, next) => {
  const { lectureId } = req.params;

  const lecture = await Lecture.findById(lectureId);
  if (!lecture) return next(new ErrorHandler("Lecture not found", 404));

  res.status(200).json({
    success: true,
    lecture,
  });
});

exports.deleteLecture = catchAsyncError(async (req, res, next) => {
  const { lectureId } = req.params;

  const lecture = await Lecture.findById(lectureId);
  if (!lecture) return next(new ErrorHandler("Lecture not found", 404));

  await cloudinary.v2.uploader.destroy(lecture.video.public_id);
  await Comment.deleteMany({ lecture: lectureId });
  await lecture.deleteOne();

  res.status(200).json({
    success: true,
    message: "Lecture deleted successfully",
  });
});
