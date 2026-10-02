import { useEffect, useState } from "react";
import API from "../services/api";

function Skills({onDashboard}) {
  const [skills, setSkills] = useState([]);

  const [form, setForm] = useState({
    skill_name: "",
    category: "",
    level: "",
    progress: 0
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadSkills = async () => {
    try {
      const response = await API.get("/skills");
      setSkills(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Unable to load skills"
      );
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/skills/${editingId}`, {
          ...form,
          progress: Number(form.progress)
        });

        setMessage("Skill updated successfully");
      } else {
        await API.post("/skills", {
          ...form,
          progress: Number(form.progress)
        });

        setMessage("Skill added successfully");
      }

      setForm({
        skill_name: "",
        category: "",
        level: "",
        progress: 0
      });

      setEditingId(null);

      loadSkills();
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Unable to save skill"
      );
    }
  };

  const handleEdit = (skill) => {
    setForm({
      skill_name: skill.skill_name,
      category: skill.category || "",
      level: skill.level || "",
      progress: skill.progress
    });

    setEditingId(skill.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/skills/${id}`);

      setMessage("Skill deleted successfully");

      loadSkills();
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Unable to delete skill"
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
    <div className="max-w-6xl mx-auto">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          My Skills
        </h1>

        <p className="text-gray-500 mt-2">
          Add, update and track your skills and learning progress.
        </p>
      </div>

      {/* Add / Edit Skill Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">

        <h2 className="text-xl font-bold text-gray-900 mb-5">
          {editingId ? "Edit Skill" : "Add New Skill"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Skill Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Name
              </label>

              <input
                name="skill_name"
                placeholder="e.g. Python"
                value={form.skill_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              <input
                name="category"
                placeholder="e.g. Programming"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Level
              </label>

              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Progress */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress (%)
              </label>

              <input
                name="progress"
                type="number"
                min="0"
                max="100"
                value={form.progress}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

          </div>

          {/* Form Buttons */}
          <div className="flex gap-3 mt-6">

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {editingId ? "Update Skill" : "Add Skill"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    skill_name: "",
                    category: "",
                    level: "",
                    progress: 0
                  });
                  setMessage("");
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            )}

          </div>

        </form>

        {/* Message */}
        {message && (
          <div className="mt-5 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

      </div>

      {/* Skills List */}
      <div>

        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              My Skills
            </h2>

            <p className="text-gray-500 mt-1">
              Your current skills and progress.
            </p>
          </div>

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
            {skills.length} Skills
          </span>
        </div>

        {skills.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <p className="text-gray-500">
              No skills added yet.
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Add your first skill using the form above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {skills.map((skill) => (
              <div
                key={skill.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition"
              >

                {/* Skill Header */}
                <div className="flex justify-between items-start mb-4">

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {skill.skill_name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {skill.category || "No category"}
                    </p>
                  </div>

                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {skill.level || "Not specified"}
                  </span>

                </div>

                {/* Progress */}
                <div className="mb-5">

                  <div className="flex justify-between mb-2">

                    <span className="text-sm font-medium text-gray-600">
                      Progress
                    </span>

                    <span className="text-sm font-bold text-blue-600">
                      {skill.progress}%
                    </span>

                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">

                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{
                        width: `${skill.progress}%`
                      }}
                    ></div>

                  </div>

                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="flex-1 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="flex-1 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  </div>
);
}
export default Skills;