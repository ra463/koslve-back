const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: [true, "Email already exists"],
      validate: [validator.isEmail, "Please enter valid email address"],
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [7, "Password must be at least 7 characters long"],
      maxLength: [14, "Password must be at most 14 characters long"],
    },
    enrolledClasses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

schema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

schema.methods.getToken = async function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", schema);
