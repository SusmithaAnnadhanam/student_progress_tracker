import { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
function Dashboard({
  onLogout,
  onProfile,
  onSkills,
  onProjects,
  onGoals,
  onCertificates,
  onSkillGap
}) {
  const [dashboard, setDashboard] = useState(null)
   const [analytics, setAnalytics] = useState(null);
  const [message, setMessage] = useState("");

  const loadDashboard = async () => {
    try {
      const response = await API.get("/dashboard");
      setDashboard(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
        "Unable to load dashboard"
      );
    }
  };
  const loadAnalytics = async () => {
  try {
    const response = await API.get("/analytics");
    setAnalytics(response.data);
  } catch (error) {
    console.log(
      error.response?.data?.detail || "Unable to load analytics"
    );
  }
};
  useEffect(() => {
    loadDashboard();
    loadAnalytics();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    onLogout();
  };

  if (!dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">
          {message || "Loading dashboard..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Student Progress Tracker
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Welcome back, {dashboard.student.name}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition shadow-sm"
            >
              Logout
            </button>

          </div>
        </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h2>

          <p className="text-gray-500 mt-2">
            Track your skills, projects and goals in one place.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
            <p className="text-gray-500">
              Skills
            </p>

            <h3 className="text-3xl font-bold text-blue-600 mt-2">
              {dashboard.summary.total_skills}
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-500">
              Projects
            </p>

            <h3 className="text-3xl font-bold text-purple-600 mt-2">
              {dashboard.summary.total_projects}
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-500">
              Goals
            </p>

            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {dashboard.summary.total_goals}
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-500">
              Completed Goals
            </p>

            <h3 className="text-3xl font-bold text-orange-500 mt-2">
              {dashboard.summary.completed_goals}
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-500">
              Avg. Skill Progress
            </p>

            <h3 className="text-3xl font-bold text-indigo-600 mt-2">
              {dashboard.summary.average_skill_progress}%
            </h3>
          </div>

        </div>
        
        {/*ANALYTICS CHARTS */}
    {analytics && (
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Skill Progress
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.skills}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill_name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar
                dataKey="progress"
                fill="#2563eb"
                name="Progress %"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Project & Goal Status
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  {
                    name: "Completed Projects",
                    value: analytics.summary.completed_projects
                  },
                  {
                    name: "In Progress Projects",
                    value: analytics.summary.in_progress_projects
                  },
                  {
                    name: "Completed Goals",
                    value: analytics.summary.completed_goals
                  },
                  {
                    name: "In Progress Goals",
                    value: analytics.summary.in_progress_goals
                  }
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                <Cell fill="#2563eb" />
                <Cell fill="#60a5fa" />
                <Cell fill="#16a34a" />
                <Cell fill="#86efac" />
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    )}
        {/* Skills */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-8">

          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-gray-800">
              My Skills
            </h2>

            <button
              onClick={onSkills}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Manage Skills →
            </button>
          </div>

          {dashboard.skills.length === 0 ? (
            <p className="text-gray-500">
              No skills added yet.
            </p>
          ) : (
            <div className="space-y-5">
              {dashboard.skills.map((skill) => (
                <div key={skill.id}>

                  <div className="flex justify-between mb-2">
                    <div>
                      <span className="font-semibold text-gray-800">
                        {skill.skill_name}
                      </span>

                      <span className="text-sm text-gray-500 ml-2">
                        {skill.level}
                      </span>
                    </div>

                    <span className="font-semibold text-gray-700">
                      {skill.progress}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{
                        width: `${skill.progress}%`
                      }}
                    ></div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </section>

        {/* Projects and Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Projects */}
          <section className="bg-white rounded-xl shadow-sm p-6">

            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800">
                My Projects
              </h2>

              <button
                onClick={onProjects}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Manage Projects →
              </button>
            </div>

            {dashboard.projects.length === 0 ? (
              <p className="text-gray-500">
                No projects added yet.
              </p>
            ) : (
              <div className="space-y-4">

                {dashboard.projects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">

                      <h3 className="font-semibold text-gray-800">
                        {project.title}
                      </h3>

                      <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                        {project.status}
                      </span>

                    </div>

                    <p className="text-gray-500 text-sm mt-2">
                      {project.description}
                    </p>

                    <p className="text-sm text-gray-600 mt-3">
                      {project.technologies}
                    </p>
                  </div>
                ))}

              </div>
            )}

          </section>

          {/* Goals */}
          <section className="bg-white rounded-xl shadow-sm p-6">

            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800">
                My Goals
              </h2>

              <button
                onClick={onGoals}
                className="text-green-600 hover:text-green-800 font-medium"
              >
                Manage Goals →
              </button>
            </div>

            {dashboard.goals.length === 0 ? (
              <p className="text-gray-500">
                No goals added yet.
              </p>
            ) : (
              <div className="space-y-5">

                {dashboard.goals.map((goal) => (
                  <div key={goal.id}>

                    <div className="flex justify-between items-center mb-2">

                      <span className="font-semibold text-gray-800">
                        {goal.title}
                      </span>

                      <span className="text-sm text-gray-500">
                        {goal.progress}%
                      </span>

                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full"
                        style={{
                          width: `${goal.progress}%`
                        }}
                      ></div>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      {goal.status}
                    </p>

                  </div>
                ))}

              </div>
            )}

          </section>

        </div>

        {/* Navigation */}
        <section className="mt-8 bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Quick Navigation
          </h2>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={onProfile}
              className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-medium"
            >
              My Profile
            </button>

            <button
              onClick={onSkills}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              My Skills
            </button>

            <button
              onClick={onProjects}
             className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              My Projects
            </button>

            <button
              onClick={onGoals}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              My Goals
            </button>
            <button
              onClick={onSkillGap}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Skill Gap Analysis
            </button>
            <button
              onClick={onCertificates}
              className="px-5 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium"
            >
              Certificates
            </button>
            
          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;