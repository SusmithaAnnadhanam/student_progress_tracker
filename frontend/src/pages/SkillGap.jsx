import { useEffect, useState } from "react";
import API from "../services/api";

function SkillGap({onDashboard}) {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSkillGap();
  }, []);

  const loadSkillGap = async () => {
    try {
      const response = await API.get("/skill-gap");
      setData(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
        "Failed to load skill gap analysis"
      );
    }
  };

  if (message) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
          <p className="text-red-600">{message}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">
          Loading skill gap analysis...
        </p>
      </div>
    );
  }

  const allSkills = [
    ...data.strong_skills,
    ...data.developing_skills,
    ...data.needs_improvement
  ];

  const totalSkills = allSkills.length;

  const averageProgress =
    totalSkills > 0
      ? Math.round(
          allSkills.reduce(
            (total, skill) => total + skill.progress,
            0
          ) / totalSkills
        )
      : 0;

  const focusAreas = [
    ...data.needs_improvement,
    ...data.developing_skills
  ]
    .sort((a, b) => a.progress - b.progress)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
         <button
  onClick={onDashboard}
  className="mb-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
>
  ← Back to Dashboard
</button>
      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Skill Gap Analysis
          </h1>

          <p className="text-gray-500 mt-2">
            Understand your current skill level and identify areas
            that need improvement.
          </p>
        </div>

        {/* Summary Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-gray-500">
              Total Skills
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {totalSkills}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-gray-500">
              Strong Skills
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {data.strong_skills.length}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-gray-500">
              Needs Improvement
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {data.needs_improvement.length}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-gray-500">
              Average Progress
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {averageProgress}%
            </h2>
          </div>

        </div>

        {/* Focus Areas */}

        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Focus Areas
              </h2>

              <p className="text-gray-500 mt-1">
                Skills that currently need the most attention.
              </p>
            </div>
          </div>

          {focusAreas.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 font-medium">
                Great! You currently don't have any developing or
                low-progress skills.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {focusAreas.map((skill) => (
                <div
                  key={skill.skill_name}
                  className="border border-gray-200 rounded-lg p-4"
                >

                  <div className="flex justify-between items-center mb-2">

                    <span className="font-semibold text-gray-700">
                      {skill.skill_name}
                    </span>

                    <span className="font-bold text-red-600">
                      {skill.progress}%
                    </span>

                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">

                    <div
                      className="bg-red-500 h-3 rounded-full"
                      style={{
                        width: `${skill.progress}%`
                      }}
                    ></div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* Skill Categories */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Strong Skills */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold text-green-600 mb-4">
              Strong Skills
            </h2>

            {data.strong_skills.length === 0 ? (
              <p className="text-gray-500">
                No strong skills yet.
              </p>
            ) : (
              data.strong_skills.map((skill) => (
                <div
                  key={skill.skill_name}
                  className="border-b py-3 last:border-b-0"
                >

                  <div className="flex justify-between">

                    <span className="font-medium text-gray-700">
                      {skill.skill_name}
                    </span>

                    <span className="font-semibold text-green-600">
                      {skill.progress}%
                    </span>

                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">

                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${skill.progress}%`
                      }}
                    ></div>

                  </div>

                </div>
              ))
            )}

          </div>

          {/* Developing Skills */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold text-yellow-600 mb-4">
              Developing Skills
            </h2>

            {data.developing_skills.length === 0 ? (
              <p className="text-gray-500">
                No developing skills yet.
              </p>
            ) : (
              data.developing_skills.map((skill) => (
                <div
                  key={skill.skill_name}
                  className="border-b py-3 last:border-b-0"
                >

                  <div className="flex justify-between">

                    <span className="font-medium text-gray-700">
                      {skill.skill_name}
                    </span>

                    <span className="font-semibold text-yellow-600">
                      {skill.progress}%
                    </span>

                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">

                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${skill.progress}%`
                      }}
                    ></div>

                  </div>

                </div>
              ))
            )}

          </div>

          {/* Needs Improvement */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold text-red-600 mb-4">
              Needs Improvement
            </h2>

            {data.needs_improvement.length === 0 ? (
              <p className="text-gray-500">
                No skills need improvement.
              </p>
            ) : (
              data.needs_improvement.map((skill) => (
                <div
                  key={skill.skill_name}
                  className="border-b py-3 last:border-b-0"
                >

                  <div className="flex justify-between">

                    <span className="font-medium text-gray-700">
                      {skill.skill_name}
                    </span>

                    <span className="font-semibold text-red-600">
                      {skill.progress}%
                    </span>

                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">

                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${skill.progress}%`
                      }}
                    ></div>

                  </div>

                </div>
              ))
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default SkillGap;