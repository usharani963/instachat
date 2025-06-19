const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Decoded token:", decoded);

      const userId = decoded.id || decoded.userId; // 🔥 FIXED HERE
      const user = await User.findById(userId).select("-password");
      console.log("🧠 User from DB:", user);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("❌ Token verification failed:", error);
      return res.status(401).json({ message: "Token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
