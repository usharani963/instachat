const express = require("express");
const router = express.Router();
const { getMe, updateMe, searchUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// ✅ Test route to verify routing works
router.get("/test", (req, res) => {
  res.send("User route working ✅");
});

// Protected routes
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.get("/search", protect, searchUsers);

module.exports = router;
