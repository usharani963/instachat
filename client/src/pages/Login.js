import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/profile");
    } catch (error) {
      alert("Login failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80 relative">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          className="border p-2 mb-4 w-full"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="relative mb-4">
          <input
            className="border p-2 w-full pr-10"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          Login
        </button>
        <p className="text-sm mt-2">
          Don't have an account?{" "}
          <a className="text-pink-600" href="/register">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
