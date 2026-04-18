export default function Navbar({ page, setPage, user, onLogout }) {
  const isAdmin = user?.role === "admin";

  const PATH_ICONS  = { webdev:"🌐", datascience:"📊", uiux:"🎨", mobile:"📱", cybersecurity:"🔐", cloud:"☁️", ai:"🤖", devops:"⚙️", blockchain:"⛓️", gamedev:"🎮" };
  const PATH_LABELS = { webdev:"Web Developer", datascience:"Data Scientist", uiux:"UI/UX Designer", mobile:"Mobile Developer", cybersecurity:"Cybersecurity Analyst", cloud:"Cloud Engineer", ai:"AI Engineer", devops:"DevOps Engineer", blockchain:"Blockchain Developer", gamedev:"Game Developer" };

  const navLinkClass = (p) => `navbar-link${page === p ? " active" : ""}`;

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => setPage(isAdmin ? "admin-dashboard" : "home")}> 
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: isAdmin ? "#7c3aed" : "#2563eb",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, boxShadow: isAdmin ? "0 2px 8px #7c3aed44" : "0 2px 8px #2563eb33",
        }}>🚀</div>
        <div>
          <span style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "1.05rem", color: "#0f172a", letterSpacing: "-0.01em",
          }}>CareerDev</span>
          {isAdmin && (
            <span style={{
              display: "block", fontSize: "0.6rem", fontWeight: 700,
              color: "#7c3aed", letterSpacing: "0.1em", lineHeight: 1,
              textTransform: "uppercase",
            }}>Admin Console</span>
          )}
        </div>
      </div>

      <div className="navbar-actions">
        {!user && (
          <>
            <span className={navLinkClass("home")} onClick={() => setPage("home")}>Home</span>
            <button className="navbar-button secondary" onClick={() => setPage("login")}>Sign In</button>
            <button className="navbar-button primary" onClick={() => setPage("register")}>Get Started</button>
          </>
        )}

        {user && !isAdmin && (
          <div className="navbar-group">
            {['dashboard', 'roadmap', 'jobs', 'assessment', 'leaderboard'].map(p => (
              <span key={p} className={navLinkClass(p)} onClick={() => setPage(p)}>{p}</span>
            ))}
          </div>
        )}

        {user && isAdmin && (
          <div className="badge badge-purple">🔐 Admin Panel</div>
        )}

        {user && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            paddingLeft: 12, borderLeft: "1px solid #e2e8f0",
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: isAdmin ? "#7c3aed" : "#2563eb",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "0.875rem", color: "#fff",
              flexShrink: 0,
            }}>{user.name?.[0]?.toUpperCase()}</div>
            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>{user.name}</div>
              {!isAdmin && user.careerPath && (
                <div style={{ fontSize: "0.7rem", color: "#2563eb", fontWeight: 500 }}>
                  {PATH_ICONS[user.careerPath] || "🎯"} {PATH_LABELS[user.careerPath] || user.careerPath}
                </div>
              )}
            </div>

            {!isAdmin && (
              <button className="navbar-button secondary" onClick={() => setPage("profile")}>Profile</button>
            )}
            <button className="navbar-button danger" onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
