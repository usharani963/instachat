const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // multer+cloudinary middleware

const {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
} = require("../controllers/messageController");

const Message = require("../models/Message");

// Text message routes
router.post("/", protect, sendMessage);
router.get("/:chatId", protect, getMessages);
router.put("/:id", protect, editMessage);
router.delete("/:id", protect, deleteMessage);

// 📸 Image message upload route
router.post("/upload", protect, upload.single("image"), async (req, res) => {
  try {
    const message = await Message.create({
      sender: req.user.id,
      content: req.body.content || "", // Optional text
      image: req.file?.path, // Cloudinary image URL
      chat: req.body.chatId,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Image upload failed:", error);
    res.status(500).json({ message: "Failed to upload image message" });
  }
});

// PATCH - Mark messages as read
router.patch("/read/:chatId", protect, async (req, res) => {
  const messages = await Message.updateMany(
    {
      chat: req.params.chatId,
      readBy: { $ne: req.user._id }, // if not already marked
    },
    { $addToSet: { readBy: req.user._id } } // push only once
  );

  res.json({ message: "Marked as read" });
});





module.exports = router;
