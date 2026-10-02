import { useEffect, useState } from "react";
import API from "../services/api";

function Goals({onDashboard}) {
  const [goals, setGoals] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    target_date: "",
    progress: 0,
    status: "In Progress"
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadGoals = async () => {
    try {
      const response = await API.get("/goals");
      setGoals(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Unable to load goals"
      );
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
        setMessage("Goal name is required");
        return;
      }
    try {
      const goalData = {
        ...form,
        progress: Number(form.progress)
      };

      if (editingId) {
        await API.put(`/goals/${editingId}`, goalData);
        setMessage("Goal updated successfully");
      } else {
        await API.post("/goals", goalData);
        setMessage("Goal added successfully");
      }

      setForm({
        title: "",
        description: "",
        target_date: "",
        progress: 0,
        status: "In Progress"
      });

      setEditingId(null);

      loadGoals();
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Unable to save goal"
      );
    }
  };

  const handleEdit = (goal) => {
    setForm({
      title: goal.title || "",
      description: goal.description || "",
      target_date: goal.target_date || "",
      progress: goal.progress ?? 0,
      status: goal.status || "In Progress"
    });

    setEditingId(goal.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/goals/${id}`);

      setMessage("Goal deleted successfully");

      loadGoals();
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Unable to delete goal"
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
            My Goals
          </h1>

          <p className="text-gray-500 mt-2">
            Set, track and manage your learning and career goals.
          </p>
        </div>

        {/* Add / Edit Goal Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">

          <h2 className="text-xl font-bold text-gray-900 mb-5">
            {editingId ? "Edit Goal" : "Add New Goal"}
          </h2>

          <form onSubmit={handleSubmit}>

            {/* Goal Title */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Title
              </label>

              <input
                name="title"
                placeholder="e.g. Learn React"
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
                placeholder="Describe your goal"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Target Date + Progress + Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Target Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Date
                </label>

                <input
                  name="target_date"
                  type="date"
                  value={form.target_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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

              {/* Status */}
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
                {editingId ? "Update Goal" : "Add Goal"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);

                    setForm({
                      title: "",
                      description: "",
                      target_date: "",
                      progress: 0,
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

        {/* Goals List */}
        <div>

          <div className="flex justify-between items-center mb-5">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                My Goals
              </h2>

              <p className="text-gray-500 mt-1">
                Track your goals and monitor your progress.
              </p>
            </div>

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              {goals.length} Goals
            </span>

          </div>

          {goals.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">

              <p className="text-gray-500">
                No goals added yet.
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Add your first goal using the form above.
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition"
                >

                  {/* Goal Header */}
                  <div className="flex justify-between items-start gap-4 mb-4">

                    <h3 className="text-xl font-bold text-gray-900">
                      {goal.title}
                    </h3>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                        goal.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : goal.status === "On Hold"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {goal.status}
                    </span>

                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-5">
                    {goal.description || "No description provided."}
                  </p>

                  {/* Target Date */}
                  <div className="mb-5">

                    <p className="text-sm font-medium text-gray-500">
                      Target Date
                    </p>

                    <p className="text-gray-800 mt-1">
                      {goal.target_date || "Not specified"}
                    </p>

                  </div>

                  {/* Progress */}
                  <div className="mb-5">

                    <div className="flex justify-between mb-2">

                      <span className="text-sm font-medium text-gray-600">
                        Progress
                      </span>

                      <span className="text-sm font-bold text-blue-600">
                        {goal.progress}%
                      </span>

                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">

                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all"
                        style={{
                          width: `${goal.progress}%`
                        }}
                      ></div>

                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">

                    <button
                      onClick={() => handleEdit(goal)}
                      className="flex-1 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(goal.id)}
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

export default Goals;