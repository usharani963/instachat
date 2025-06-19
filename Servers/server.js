const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const socketIO = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000", // frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB Error:", err));




// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// Socket.IO Logic
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("typing", ({ room }) => {
    socket.to(room).emit("typing", { room });
  });

  socket.on("stop_typing", ({ room }) => {
    socket.to(room).emit("stop_typing", { room });
  });

  socket.on("new_message", (message) => {
    socket.to(message.chatId).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
