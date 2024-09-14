const express = require("express");
const cors = require("cors");
const app = express();
const { error } = require("./middlewares/error.js");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: "https://ksolve-front-aibe.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// import routes
const userRoutes = require("./routes/userRoutes.js");
const classRoutes = require("./routes/classRoutes.js");
const bookRoutes = require("./routes/bookRoutes.js");
const chapterRoutes = require("./routes/chapterRoutes.js");
const lectureRoutes = require("./routes/lectureRoutes.js");
const commentRoutes = require("./routes/commentRoute.js");

//import validators
const userValidator = require("./validators/userValidator.js");
const classValidator = require("./validators/classValidator.js");
const bookValidator = require("./validators/bookValidator.js");
const chapterValidator = require("./validators/chapterValidator.js");
const lectureValidator = require("./validators/lectureValidator.js");
const commentValidator = require("./validators/commentValidator.js");

// use routes
app.use("/api/user", userValidator, userRoutes);
app.use("/api/class", classValidator, classRoutes);
app.use("/api/book", bookValidator, bookRoutes);
app.use("/api/chapter", chapterValidator, chapterRoutes);
app.use("/api/lecture", lectureValidator, lectureRoutes);
app.use("/api/comment", commentValidator, commentRoutes);

app.get("/", (req, res) =>
  res.send(`<h1>Its working. Click to visit Link.</h1>`)
);

app.all("*", (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
app.use(error);
