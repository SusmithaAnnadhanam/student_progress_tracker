import { useEffect, useState } from "react";
import API from "../services/api";

function Projects({onDashboard}) {
  
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    technologies: "",
    github_url: "",
    start_date: "",
    end_date: "",
    status: "In Progress"
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadProjects = async () => {
    try {
      const response = await API.get("/projects");
      setProjects(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Unable to load projects"
      );
    }
  };

  useEffect(() => {
    loadProjects();
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
        await API.put(`/projects/${editingId}`, form);
        setMessage("Project updated successfully");
      } else {
        await API.post("/projects", form);
        setMessage("Project added successfully");
      }

      setForm({
        title: "",
        description: "",
        technologies: "",
        github_url: "",
        start_date: "",
        end_date: "",
        status: "In Progress"
      });

      setEditingId(null);

      loadProjects();
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Unable to save project"
      );
    }
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title || "",
      description: project.description || "",
      technologies: project.technologies || "",
      github_url: project.github_url || "",
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      status: project.status || "In Progress"
    });

    setEditingId(project.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/projects/${id}`);

      setMessage("Project deleted successfully");

      loadProjects();
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Unable to delete project"
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
          My Projects
        </h1>

        <p className="text-gray-500 mt-2">
          Add, manage and track your projects and development work.
        </p>
      </div>

      {/* Add / Edit Project Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">

        <h2 className="text-xl font-bold text-gray-900 mb-5">
          {editingId ? "Edit Project" : "Add New Project"}
        </h2>

        <form onSubmit={handleSubmit}>

          {/* Project Title */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title
            </label>

            <input
              name="title"
              placeholder="e.g. Student Progress Tracker"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>

            <textarea
              name="description"
              placeholder="Describe your project"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Technologies + GitHub */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies
              </label>

              <input
                name="technologies"
                placeholder="e.g. React, FastAPI, MySQL"
                value={form.technologies}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub URL
              </label>

              <input
                name="github_url"
                placeholder="https://github.com/username/project"
                value={form.github_url}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

          </div>

          {/* Dates + Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>

              <input
                name="start_date"
                type="date"
                value={form.start_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>

              <input
                name="end_date"
                type="date"
                value={form.end_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

          </div>

          {/* Form Buttons */}
          <div className="flex gap-3 mt-6">

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {editingId ? "Update Project" : "Add Project"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);

                  setForm({
                    title: "",
                    description: "",
                    technologies: "",
                    github_url: "",
                    start_date: "",
                    end_date: "",
                    status: "In Progress"
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

      {/* Projects List */}
      <div>

        <div className="flex justify-between items-center mb-5">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              My Projects
            </h2>

            <p className="text-gray-500 mt-1">
              Your current projects and development work.
            </p>
          </div>

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
            {projects.length} Projects
          </span>

        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">

            <p className="text-gray-500">
              No projects added yet.
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Add your first project using the form above.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition"
              >

                {/* Project Header */}
                <div className="flex justify-between items-start gap-4 mb-4">

                  <h3 className="text-xl font-bold text-gray-900">
                    {project.title}
                  </h3>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                      project.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : project.status === "On Hold"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {project.status}
                  </span>

                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">
                  {project.description || "No description provided."}
                </p>

                {/* Technologies */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Technologies
                  </p>

                  <p className="text-gray-800">
                    {project.technologies || "Not specified"}
                  </p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 mb-4">

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Start Date
                    </p>

                    <p className="text-sm text-gray-800 mt-1">
                      {project.start_date || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      End Date
                    </p>

                    <p className="text-sm text-gray-800 mt-1">
                      {project.end_date || "Not specified"}
                    </p>
                  </div>

                </div>

                {/* GitHub */}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-blue-600 font-medium text-sm hover:text-blue-800 mb-5"
                  >
                    View GitHub Project →
                  </a>
                )}

                {/* Actions */}
                <div className="flex gap-3">

                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(project.id)}
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

export default Projects;