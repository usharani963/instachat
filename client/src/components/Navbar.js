// components/Navbar.js
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const [searchUser, setSearchUser] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (!searchUser.trim()) return;
    try {
      const { data } = await axios.get(`/api/users?search=${searchUser}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const startChat = async (userId) => {
    try {
      const { data } = await axios.post(
        "/api/chat",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/chat", { state: { selectedChat: data } });
      setSearchUser("");
      setSearchResults([]);
    } catch (error) {
      console.error("Chat error:", error);
    }
  };

  return (
    <div className="bg-pink-600 text-white px-6 py-3 shadow">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">InstaChat</div>
        <div className="space-x-4 flex items-center">
          <Link to="/profile" className="hover:underline">
            Profile
          </Link>
          <Link to="/chat" className="hover:underline">
            Chat
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="hover:underline"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search Box */}
      <div className="mt-2 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search users..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="text-black px-2 py-1 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-white text-pink-600 px-3 py-1 rounded font-semibold"
        >
          Search
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <ul className="bg-white text-black mt-2 rounded shadow p-2">
          {searchResults.map((user) => (
            <li
              key={user._id}
              className="flex justify-between items-center border-b py-1"
            >
              <span>{user.username}</span>
              <button
                onClick={() => startChat(user._id)}
                className="bg-pink-500 text-white px-2 py-1 rounded"
              >
                Message
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
