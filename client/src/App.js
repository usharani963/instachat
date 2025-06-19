import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./pages/ChatPage";
import Profile from "./pages/Profile"; // ✅ Imported Profile
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profile" element={<Profile />} /> {/* ✅ Added Profile route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
