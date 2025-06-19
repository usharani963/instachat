import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [newBio, setNewBio] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setUser(res.data);
      setNewUsername(res.data.username || "");
      setNewBio(res.data.bio || "");
      setPreviewUrl(res.data.profilePic || "");
    } catch (err) {
      console.error("Error fetching profile:", err.response?.data || err.message);
    }
  };

  const saveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("username", newUsername);
      formData.append("bio", newBio);
      if (imageFile) formData.append("profilePic", imageFile);

      await axios.put("http://localhost:5000/api/users/me", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setIsEditing(false);
      fetchProfile(); // Refresh data from server
    } catch (err) {
      console.error("Error saving profile:", err.response?.data || err.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) return <div className="p-4">Loading profile...</div>;

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-md mx-auto bg-white rounded shadow mt-10 text-center">
        <h2 className="text-xl font-bold mb-4">My Profile</h2>

        {previewUrl && (
          <div className="flex justify-center mb-4">
            <img
              src={previewUrl}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover border-2 border-pink-500"
            />
          </div>
        )}

        <div className="mb-4 text-left">
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <div className="mb-4 text-left">
          <label className="block text-sm font-medium text-gray-700">Username:</label>
          <input
            className="border p-2 w-full"
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="mb-4 text-left">
          <label className="block text-sm font-medium text-gray-700">Bio:</label>
          <textarea
            className="border p-2 w-full"
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            disabled={!isEditing}
          ></textarea>
        </div>

        <div className="mb-4 text-left">
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={!isEditing}
          />
        </div>

        <div className="flex justify-center space-x-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={saveProfile}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </>
  );
}
