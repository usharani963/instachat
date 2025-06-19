const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const { protect } = require("../middleware/authMiddleware");

// Create or fetch a chat
router.post("/", protect, async (req, res) => {
  const { userId } = req.body;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, userId] },
    });

    if (!chat) {
      chat = new Chat({ participants: [req.user.id, userId] });
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all chats of current user
router.get("/", protect, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate("participants", "username profilePic")
      .populate("lastMessage");

    res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
