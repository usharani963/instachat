const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat_images",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });
module.exports = upload;
