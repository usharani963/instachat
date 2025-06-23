const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/chat
// @desc    Create or fetch one-on-one chat
router.post("/", protect, async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, userId], $size: 2 },
    });

    if (!chat) {
      chat = new Chat({ participants: [req.user.id, userId] });
      await chat.save();
    }

    const populatedChat = await Chat.findById(chat._id)
      .populate("participants", "username profilePic");

    res.json(populatedChat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/chat
// @desc    Fetch all chats for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate("participants", "username profilePic")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
