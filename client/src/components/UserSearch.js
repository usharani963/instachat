import { useState } from "react";
import axios from "axios";

export default function UserSearch({ onChatCreated }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query) return;
    const res = await axios.get(`http://localhost:5000/api/users/search?q=${query}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setResults(res.data);
  };

  const createChat = async (userId) => {
    const res = await axios.post(
      "http://localhost:5000/api/chats",
      { userId },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    onChatCreated(res.data); // refresh chats in parent
    setQuery("");
    setResults([]);
  };

  return (
    <div className="mb-4">
      <input
        className="border p-2 w-full"
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && handleSearch()}
      />
      <div className="bg-white border mt-1">
        {results.map((user) => (
          <div
            key={user._id}
            onClick={() => createChat(user._id)}
            className="p-2 cursor-pointer hover:bg-gray-100"
          >
            {user.username}
          </div>
        ))}
      </div>
    </div>
  );
}
