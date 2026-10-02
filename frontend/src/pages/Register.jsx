import { useState } from "react";
import API from "../services/api";

function Register({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      setMessage("Please fill all fields");
      return;
    }

    if (trimmedName.length < 2) {
      setMessage("Name must contain at least 2 characters");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setMessage("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must contain at least 6 characters");
      return;
    }

    try {
      const response = await API.post("/register", {
        name: trimmedName,
        email: trimmedEmail,
        password
      });

      setMessage(response.data.message);

      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold text-gray-900">
              Student Registration
            </h1>

            <p className="text-gray-500 mt-2">
              Create your student account
            </p>

          </div>

          <form onSubmit={handleRegister} className="space-y-5">

            {/* Name */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Email */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Password */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <p className="text-xs text-gray-500 mt-2">
                Password must contain at least 6 characters.
              </p>

            </div>

            {/* Register */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Register
            </button>

          </form>

          {/* Message */}
          {message && (
            <div className="mt-5 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
              {message}
            </div>
          )}

          {/* Login */}
          <div className="text-center mt-6">

            <p className="text-gray-500 text-sm mb-2">
              Already have an account?
            </p>

            <button
              onClick={onLogin}
              className="text-blue-600 font-semibold hover:text-blue-800"
            >
              Back to Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;