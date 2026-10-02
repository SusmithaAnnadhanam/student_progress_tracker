import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Goals from "./pages/Goals";
import Certificates from "./pages/Certificates";
import SkillGap from "./pages/SkillGap";

function App() {
  const [page, setPage] = useState(
    localStorage.getItem("access_token")
      ? "dashboard"
      : "login"
  );

  const handleLogin = () => {
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setPage("login");
  };

  const handleDashboard = () => {
    setPage("dashboard");
  };

  return (
    <div>
      {page === "login" && (
        <Login
          onLogin={handleLogin}
          onRegister={() => setPage("register")}
        />
      )}

      {page === "register" && (
        <Register
          onLogin={() => setPage("login")}
        />
      )}

      {page === "dashboard" && (
        <Dashboard
          onLogout={handleLogout}
          onProfile={() => setPage("profile")}
          onSkills={() => setPage("skills")}
          onProjects={() => setPage("projects")}
          onGoals={() => setPage("goals")}
          onCertificates={() => setPage("certificates")}
          onSkillGap={() => setPage("skill-gap")}
        />
      )}

      {page === "profile" && (
        <Profile onDashboard={handleDashboard} />
      )}

      {page === "skills" && (
        <Skills onDashboard={handleDashboard} />
      )}

      {page === "projects" && (
        <Projects onDashboard={handleDashboard} />
      )}

      {page === "goals" && (
        <Goals onDashboard={handleDashboard} />
      )}

      {page === "certificates" && (
        <Certificates onDashboard={handleDashboard} />
      )}

      {page === "skill-gap" && (
        <SkillGap onDashboard={handleDashboard} />
      )}
    </div>
  );
}

export default App;