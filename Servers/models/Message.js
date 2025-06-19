const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, default: "" }, // Optional text content
    image: { type: String }, // Cloudinary image URL
    media: { type: String }, // Optional: for videos/docs/etc.
    seen: { type: Boolean, default: false },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],


  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
