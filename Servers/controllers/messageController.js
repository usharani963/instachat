const Message = require("../models/Message");
const Chat = require("../models/Chat");

// 📩 Send a message
const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;

  try {
    const message = await Message.create({
      sender: req.user.id,
      chatId,
      content,
    });

    // Populate sender field with username
    const fullMessage = await message.populate("sender", "username").execPopulate();

    res.json(fullMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 📜 Get all messages in a chat
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate("sender", "username");

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✏️ Edit message
const editMessage = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg || msg.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    msg.content = req.body.content;
    await msg.save();

    // Populate sender field with username
    const updatedMsg = await msg.populate("sender", "username").execPopulate();

    res.json(updatedMsg);
  } catch (error) {
    console.error("Error editing message:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🗑️ Delete message
const deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg || msg.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await msg.deleteOne();
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
};
