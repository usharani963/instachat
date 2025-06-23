import { useState } from "react";
import axios from "axios";

export default function UserSearch({ onChatCreated }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/users/search?q=${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setResults(res.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const createChat = async (userId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/chats",
        { userId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      onChatCreated(res.data); // Refresh chats in parent
      setQuery("");
      setResults([]);
    } catch (error) {
      console.error("Create chat error:", error);
    }
  };

  return (
    <div className="p-4">
      <input
        className="border p-2 w-full mb-2"
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="bg-pink-500 text-white px-4 py-2 rounded mb-2"
      >
        Search
      </button>

      <div className="bg-white border rounded">
        {results.map((user) => (
          <div
            key={user._id}
            onClick={() => createChat(user._id)}
            className="p-2 cursor-pointer hover:bg-gray-100 border-b"
          >
            {user.username}
          </div>
        ))}
      </div>
    </div>
  );
}
