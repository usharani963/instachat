// components/Navbar.js
import { Link } from "react-router-dom";

export default function Navbar() {
  return (



  
    <div className="bg-pink-600 text-white flex justify-between items-center px-6 py-3 shadow">
      <div className="text-xl font-bold">InstaChat</div>
      <div className="space-x-4">
        <Link to="/profile" className="hover:underline">Profile</Link>
        <Link to="/chat" className="hover:underline">Chat</Link>
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
  );
}
