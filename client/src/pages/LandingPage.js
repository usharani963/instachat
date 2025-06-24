// src/pages/LandingPage.js
export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-8">
      <h1 className="text-4xl font-bold text-pink-600">Welcome to InstaChat 💬</h1>
      <p className="mt-4 text-lg text-gray-700">Chat with anyone, instantly.</p>
      <a
        href="/login"
        className="mt-6 bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded shadow"
      >
        Get Started
      </a>
    </div>
  );
}
