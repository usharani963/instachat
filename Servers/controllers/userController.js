const User = require("../models/User");

// @desc    Get current logged-in user info
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

// @desc    Update current user's username
// @route   PUT /api/users/me
// @access  Private
const updateMe = async (req, res) => {
  const { username } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { username },
    { new: true }
  ).select("-password");

  res.json(user);
};

// @desc    Search users by username
// @route   GET /api/users/search?q=keyword
// @access  Private
const searchUsers = async (req, res) => {
  const keyword = req.query.q || "";

  const users = await User.find({
    username: { $regex: keyword, $options: "i" },
    _id: { $ne: req.user.id },
  }).select("-password");

  res.json(users);
};

module.exports = { getMe, updateMe, searchUsers };
