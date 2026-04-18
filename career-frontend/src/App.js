import { useState, useEffect } from "react";
import { Auth, clearToken, getToken } from "./services/api";
import Navbar         from "./components/Navbar";
import HomePage       from "./pages/HomePage";
import AuthPage       from "./pages/AuthPage";
import Dashboard      from "./pages/Dashboard";
import RoadmapPage    from "./pages/RoadmapPage";
import JobsPage       from "./pages/JobsPage";
import AssessmentPage from "./pages/AssessmentPage";
import ProfilePage    from "./pages/ProfilePage";
import AdminLayout       from "./pages/admin/AdminLayout";
import AdminDashboard    from "./pages/admin/AdminDashboard";
import AdminJobs         from "./pages/admin/AdminJobs";
import AdminStudents     from "./pages/admin/AdminStudents";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminAssessments  from "./pages/admin/AdminAssessments";
import NotFoundPage from "./pages/NotFoundPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import "./index.css";

// ── Debug check ───────────────────────────────────────────────
const components = {
  Navbar, HomePage, AuthPage, Dashboard, RoadmapPage,
  JobsPage, AssessmentPage, ProfilePage,
  AdminLayout, AdminDashboard, AdminJobs,
  AdminStudents, AdminApplications, AdminAssessments,
};
Object.entries(components).forEach(([name, comp]) => {
  if (!comp || typeof comp !== "function") {
    console.error(`❌ BROKEN IMPORT: "${name}" is`, comp);
  } else {
    console.log(`✅ OK: ${name}`);
  }
});
// ─────────────────────────────────────────────────────────────

const ADMIN_PAGES = [
  "admin-dashboard",
  "admin-jobs",
  "admin-students",
  "admin-applications",
  "admin-assessments",
];
const AUTH_PAGES = [
  "dashboard","roadmap","jobs","assessment","profile","leaderboard",
  ...ADMIN_PAGES,
];

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      Auth.getMe()
        .then(d => {
          setUser(d.user);
          setPage(d.user.role === "admin" ? "admin-dashboard" : "dashboard");
        })
        .catch(() => clearToken());
    }
  }, []);

  const handleLogout = () => {
    clearToken();
    setUser(null);
    setPage("home");
  };

  const handleLogin = (u) => {
    setUser(u);
    setPage(u.role === "admin" ? "admin-dashboard" : "dashboard");
  };
const guard = (p) => {
  // Not logged in → send to login
  if (!user && AUTH_PAGES.includes(p)) return "login";
  // Student trying to access admin → send to student dashboard
  if (user?.role !== "admin" && ADMIN_PAGES.includes(p)) return "dashboard";
  // Admin trying to access student pages → send to admin dashboard
  if (user?.role === "admin" && ["dashboard","roadmap","jobs","assessment","profile"].includes(p)) return "admin-dashboard";
  return p;
};

  const currentPage = guard(page);
  const isAdminPage = ADMIN_PAGES.includes(currentPage);

  const renderContent = () => {
    switch (currentPage) {
      case "home":               return <HomePage       setPage={setPage} />;
      case "login":              return <AuthPage       type="login"    setPage={setPage} onLogin={handleLogin} />;
      case "register":           return <AuthPage       type="register" setPage={setPage} onLogin={handleLogin} />;
      case "dashboard":          return <Dashboard      user={user} setPage={setPage} />;
      case "roadmap":            return <RoadmapPage    user={user} />;
      case "jobs": return <JobsPage user={user} />;
      case "assessment":         return <AssessmentPage />;
      case "profile":            return <ProfilePage    user={user} onUpdate={setUser} />;
      case "admin-dashboard":    return <AdminDashboard    setPage={setPage} />;
      case "admin-jobs":         return <AdminJobs />;
      case "admin-students":     return <AdminStudents />;
      case "admin-applications": return <AdminApplications />;
      case "admin-assessments":  return <AdminAssessments />;
      case "leaderboard": return <LeaderboardPage user={user} />;
      default:                   return <NotFoundPage setPage={setPage} />;
    }
  };

  return (
    <div className="app-shell">
      <Navbar
        page={currentPage}
        setPage={setPage}
        user={user}
        onLogout={handleLogout}
      />
      {isAdminPage ? (
        <AdminLayout page={currentPage} setPage={setPage}>
          {renderContent()}
        </AdminLayout>
      ) : (
        renderContent()
      )}
    </div>
  );
}