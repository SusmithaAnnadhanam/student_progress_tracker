import { useEffect, useState } from "react";
import API from "../services/api";

function Certificates({onDashboard}) {
  const [certificates, setCertificates] = useState([]);

  const [form, setForm] = useState({
    title: "",
    issuer: "",
    issue_date: "",
    certificate_url: ""
  });

  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadCertificates = async () => {
    try {
      const response = await API.get("/certificates");
      setCertificates(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Unable to load certificates"
      );
    }
  };

  useEffect(() => {
    loadCertificates();
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
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("issuer", form.issuer);
      formData.append("issue_date", form.issue_date);
      formData.append("certificate_url", form.certificate_url);

      if (file) {
        formData.append("file", file);
      }

      if (editingId) {
        await API.put(
          `/certificates/${editingId}`,
          formData
        );

        setMessage("Certificate updated successfully");
      } else {
        await API.post(
          "/certificates",
          formData
        );

        setMessage("Certificate added successfully");
      }

      setForm({
        title: "",
        issuer: "",
        issue_date: "",
        certificate_url: ""
      });

      setFile(null);
      setEditingId(null);

      loadCertificates();

    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
        "Unable to save certificate"
      );
    }
  };

  const handleEdit = (certificate) => {
    setForm({
      title: certificate.title || "",
      issuer: certificate.issuer || "",
      issue_date: certificate.issue_date || "",
      certificate_url: certificate.certificate_url || ""
    });

    setEditingId(certificate.id);
    setFile(null);
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/certificates/${id}`);

      setMessage("Certificate deleted successfully");

      loadCertificates();

    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
        "Unable to delete certificate"
      );
    }
  };

  const cancelEdit = () => {
    setForm({
      title: "",
      issuer: "",
      issue_date: "",
      certificate_url: ""
    });

    setFile(null);
    setEditingId(null);
    setMessage("");
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

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Certificates
          </h1>

          <p className="text-gray-500 mt-2">
            Add and manage your certificates and achievements.
          </p>
        </div>

        {/* Add Certificate Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">

          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {editingId
              ? "Update Certificate"
              : "Add Certificate"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Python Programming Certificate"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Issuer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issuing Organization
                </label>

                <input
                  name="issuer"
                  value={form.issuer}
                  onChange={handleChange}
                  placeholder="e.g. Coursera"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Date
                </label>

                <input
                  type="date"
                  name="issue_date"
                  value={form.issue_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Certificate URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate URL
                </label>

                <input
                  type="url"
                  name="certificate_url"
                  value={form.certificate_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            {/* File Upload */}
            {!editingId && (
              <div className="mt-5">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Certificate
                </label>

                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                />

                <p className="text-xs text-gray-500 mt-2">
                  Accepted formats: PDF, JPG, JPEG, PNG
                </p>

              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-6">

              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {editingId
                  ? "Update Certificate"
                  : "Add Certificate"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

          {message && (
            <div className="mt-5 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}

        </div>

        {/* Certificate Count */}
        <div className="flex items-center justify-between mb-5">

          <h2 className="text-xl font-bold text-gray-900">
            Your Certificates
          </h2>

          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
            {certificates.length} Certificate
            {certificates.length !== 1 ? "s" : ""}
          </span>

        </div>

        {/* Certificate Cards */}
        {certificates.length === 0 ? (

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">

            <div className="text-4xl mb-3">
              📜
            </div>

            <h3 className="text-lg font-semibold text-gray-800">
              No certificates yet
            </h3>

            <p className="text-gray-500 mt-2">
              Add your first certificate using the form above.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {certificates.map((certificate) => (

              <div
                key={certificate.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition"
              >

                {/* Certificate Header */}
                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-start gap-4">

                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">
                      📜
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {certificate.title}
                      </h3>

                      <p className="text-gray-500 mt-1">
                        {certificate.issuer || "Issuer not specified"}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Certificate Details */}
                <div className="mt-5 space-y-3">

                  {certificate.issue_date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Issue Date
                      </span>

                      <span className="font-medium text-gray-800">
                        {certificate.issue_date}
                      </span>
                    </div>
                  )}

                  {certificate.certificate_url && (
                    <div>
                      <a
                        href={certificate.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Certificate Link →
                      </a>
                    </div>
                  )}

                  {certificate.file_path && (
                    <div>
                      <a
                        href={`http://127.0.0.1:8000/${certificate.file_path.replaceAll("\\", "/")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        View Uploaded Certificate →
                      </a>
                    </div>
                  )}

                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">

                  <button
                    onClick={() => handleEdit(certificate)}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(certificate.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition"
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
  );
}

export default Certificates;