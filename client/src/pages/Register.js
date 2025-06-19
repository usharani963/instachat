import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <input
          className="border p-2 mb-2 w-full"
          type="text"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          className="border p-2 mb-2 w-full"
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <div className="relative mb-4">
          <input
            className="border p-2 w-full pr-10"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>

        <button type="submit" className="bg-pink-500 text-white py-2 px-4 w-full rounded">
          Register
        </button>
      </form>
    </div>
  );
}
