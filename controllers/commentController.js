const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const Comment = require("../models/Comment");

exports.createComment = catchAsyncError(async (req, res, next) => {
  const { lectureId } = req.params;
  const { content } = req.body;
  if (!content) return next(new ErrorHandler("Please Add Content", 400));

  const comment = await Comment.create({
    lecture: lectureId,
    user: req.userId,
    content,
  });

  res.status(201).json({
    success: true,
    comment,
  });
});

exports.replyComment = catchAsyncError(async (req, res, next) => {
  const { commentId } = req.params;
  const { content } = req.body;
  if (!content) return next(new ErrorHandler("Please Add Content", 400));

  const comment = await Comment.findById(commentId);
  if (!comment) return next(new ErrorHandler("Comment not found", 404));

  comment.replies.push({
    user: req.userId,
    content,
  });

  await comment.save();

  res.status(200).json({
    success: true,
    comment,
  });
});

exports.getAllComments = catchAsyncError(async (req, res, next) => {
  const { lectureId } = req.params;
  const comments = await Comment.find({ lecture: lectureId }).populate("user");

  res.status(200).json({
    success: true,
    comments,
  });
});

exports.deleteComment = catchAsyncError(async (req, res, next) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) return next(new ErrorHandler("Comment not found", 404));

  await comment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});
