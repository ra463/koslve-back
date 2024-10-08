const app = require("./app");
const { connectDB } = require("./config/database.js");
const cloudinary = require("cloudinary");

connectDB();
const port = process.env.PORT || 4000;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
