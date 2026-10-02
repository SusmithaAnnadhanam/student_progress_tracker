import { useEffect, useState } from "react";
import API from "../services/api";

function Profile({onDashboard}) {
 
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    department: "",
    year: "",
    bio: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await API.get("/profile");
        setProfile(response.data);
      } catch (error) {
        setMessage(
          error.response?.data?.detail || "Unable to load profile"
        );
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put("/profile", profile);
      setMessage("Profile updated successfully");
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Unable to update profile"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
       <button
          onClick={onDashboard}
          className="mb-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
        >
          ← Back to Dashboard
        </button>
      <div className="max-w-4xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your personal and academic information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center gap-4 mb-8">

            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {profile.name
                ? profile.name.charAt(0).toUpperCase()
                : "S"}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {profile.name || "Student"}
              </h2>

              <p className="text-gray-500">
                {profile.email || "Update your profile information"}
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            {/* Personal Information */}
            <div className="mb-8">

              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>

                  <input
                    name="name"
                    placeholder="Enter your name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>

                  <input
                    name="phone"
                    placeholder="Enter your phone number"
                    value={profile.phone || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

              </div>

            </div>

            {/* Academic Information */}
            <div className="mb-8">

              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Academic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* College */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College
                  </label>

                  <input
                    name="college"
                    placeholder="Enter your college"
                    value={profile.college || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>

                  <input
                    name="department"
                    placeholder="e.g. Computer Science"
                    value={profile.department || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year of Study
                  </label>

                  <input
                    name="year"
                    placeholder="e.g. 3rd Year"
                    value={profile.year || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

              </div>

            </div>

            {/* Bio */}
            <div className="mb-8">

              <h3 className="text-lg font-bold text-gray-900 mb-4">
                About Me
              </h3>

              <textarea
                name="bio"
                placeholder="Write a short description about yourself..."
                value={profile.bio || ""}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

            </div>

            {/* Save Button */}
            <div className="flex justify-end">

              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"
              >
                Save Profile
              </button>

            </div>

          </form>

          {/* Message */}
          {message && (
            <div className="mt-5 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Profile;