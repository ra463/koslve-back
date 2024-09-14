const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const Class = require("../models/Class");
const cloudinary = require("cloudinary");
const { getDataUri } = require("../utils/dataUri");
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