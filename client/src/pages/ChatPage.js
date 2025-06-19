import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import UserSearch from "../components/UserSearch";

const socket = io("http://localhost:5000");

export default function ChatPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchChats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setChats(res.data);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat?._id) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/messages/${selectedChat._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessages(res.data);
      await markMessagesAsRead(); // 👁️ Mark as read after fetching
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/messages/read/${selectedChat._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat?._id) {
      socket.emit("join_room", selectedChat._id);
      fetchMessages(); // fetch + mark as read
    }
  }, [selectedChat]);

  useEffect(() => {
    const handleReceive = (msg) => {
      if (msg.chat === selectedChat?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleTyping = ({ room }) => {
      if (room === selectedChat?._id) setTyping(true);
    };

    const handleStopTyping = ({ room }) => {
      if (room === selectedChat._id) setTyping(false);
    };

    socket.on("receive_message", handleReceive);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [selectedChat]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat?._id) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/messages",
        { chatId: selectedChat._id, content: newMessage },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      socket.emit("new_message", res.data);
      socket.emit("stop_typing", { room: selectedChat._id });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!selectedChat?._id) return;
    socket.emit("typing", { room: selectedChat._id });
    setTimeout(() => socket.emit("stop_typing", { room: selectedChat._id }), 1000);
  };

  const handleEdit = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/messages/${id}`,
        { content: editText },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessages((prev) => prev.map((m) => (m._id === id ? res.data : m)));
      setEditingMsgId(null);
      setEditText("");
    } catch (err) {
      console.error("Error editing message:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedChat?._id) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("chatId", selectedChat._id);

    try {
      const res = await axios.post("http://localhost:5000/api/messages/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      socket.emit("new_message", res.data);
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };
  


  return (
    <div className="p-4 relative min-h-screen">
      <a
        href="/profile"
        className="absolute top-4 right-4 text-blue-600 font-semibold"
      >
        Profile
      </a>

      <h1 className="text-xl font-bold mb-4">Welcome, {user?.username}</h1>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Left: Chat list */}
        <div className="md:w-1/3 bg-gray-100 p-4 rounded h-full">
          <UserSearch onChatCreated={fetchChats} />
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`p-2 border-b cursor-pointer ${
                selectedChat?._id === chat._id ? "bg-blue-200" : ""
              }`}
            >
              {chat.participants.find((p) => p._id !== user?._id)?.username}
            </div>
          ))}
        </div>

        {/* Right: Chat box */}
        <div className="md:w-2/3 w-full bg-white p-4 rounded shadow h-full">
          <div className="h-64 overflow-y-auto border mb-2">
            {messages.map((msg) => {
              const isOwn = msg.sender?._id === user?._id;
              const senderName = isOwn ? "You" : msg.sender?.username || "Unknown";

              return (
                <div key={msg._id} className="p-2 group hover:bg-gray-50 relative">
                  {editingMsgId === msg._id ? (
                    <div className="flex gap-2">
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="border p-1 flex-1"
                      />
                      <button
                        onClick={() => handleEdit(msg._id)}
                        className="text-green-600 text-sm font-medium"
                      >
                        Save
                      </button>
                    </div>
                  ) : msg.image ? (
                    <div>
                      <strong>{senderName}:</strong>
                      <img
                        src={msg.image}
                        alt="sent"
                        className="max-w-xs mt-2 rounded-lg border"
                      />
                    </div>
                  ) : (
                    <p>
                      <strong>{senderName}:</strong> {msg.content}
                    </p>
                  )}

                  {isOwn && editingMsgId !== msg._id && !msg.image && (
                    <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">
                      <button
                        onClick={() => {
                          setEditingMsgId(msg._id);
                          setEditText(msg.content);
                        }}
                        className="text-blue-600 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="text-red-600 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {isOwn && (
                    <>
                      <div className="text-xs text-gray-500 mt-1">
                        {msg.readBy.length > 1 ? "Seen" : "Sent"}
                      </div>
                      {msg.readBy.length > 1 && (
                        <div className="text-xs text-green-600">
                          Seen by: {msg.readBy.filter((u) => u !== user._id).length} user(s)
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}

            {typing && selectedChat && (
              <div className="text-sm text-gray-500 italic">Typing...</div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="imgUpload"
              onChange={handleImageUpload}
            />
            <label htmlFor="imgUpload" className="cursor-pointer text-blue-500 mr-2">
              📷
            </label>

            <input
              className="border flex-1 p-2"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type a message"
            />
            <button onClick={sendMessage} className="bg-pink-500 text-white px-4">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
