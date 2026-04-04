export default function Navbar({ page, setPage, user, onLogout }) {
  const isAdmin = user?.role === "admin";

  const PATH_ICONS  = { webdev:"🌐", datascience:"📊", uiux:"🎨", mobile:"📱", cybersecurity:"🔐", cloud:"☁️", ai:"🤖", devops:"⚙️", blockchain:"⛓️", gamedev:"🎮" };
  const PATH_LABELS = { webdev:"Web Developer", datascience:"Data Scientist", uiux:"UI/UX Designer", mobile:"Mobile Developer", cybersecurity:"Cybersecurity Analyst", cloud:"Cloud Engineer", ai:"AI Engineer", devops:"DevOps Engineer", blockchain:"Blockchain Developer", gamedev:"Game Developer" };

  return (
    <nav style={{
      position:"fixed", top:0, width:"100%", zIndex:100,
      background:"rgba(10,15,30,0.9)", backdropFilter:"blur(20px)",
      borderBottom:`1px solid ${isAdmin ? "#7c3aed44" : "#1e2d45"}`,
      padding:"0 2rem",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      height:64,
    }}>

      {/* Logo */}
      <div onClick={() => setPage(isAdmin ? "admin-dashboard" : "home")} style={{
        display:"flex", alignItems:"center", gap:8, cursor:"pointer",
      }}>
        <div style={{
          width:32, height:32, borderRadius:8,
          background: isAdmin
            ? "linear-gradient(135deg,#7c3aed,#a78bfa)"
            : "linear-gradient(135deg,#00d4ff,#7c3aed)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
        }}>🚀</div>
        <span style={{ fontFamily:"Syne, sans-serif", fontWeight:800, fontSize:"1.1rem", color:"#fff" }}>
          CareerDev
        </span>
      </div>

      {/* Right side */}
      <div style={{ display:"flex", gap:20, alignItems:"center" }}>

        {/* ── NOT logged in ── */}
        {!user && (
          <>
            {["home"].map(p => (
              <span key={p} onClick={() => setPage(p)} style={{
                cursor:"pointer", fontSize:"0.9rem", fontWeight:500,
                textTransform:"capitalize",
                color: page===p ? "#00d4ff" : "#94a3b8",
              }}>{p}</span>
            ))}
            <button onClick={() => setPage("login")} style={{
              padding:"8px 20px", borderRadius:8,
              border:"1px solid #00d4ff", background:"transparent",
              color:"#00d4ff", cursor:"pointer",
              fontFamily:"DM Sans, sans-serif", fontWeight:500,
            }}>Login</button>
            <button onClick={() => setPage("register")} style={{
              padding:"8px 20px", borderRadius:8, border:"none",
              background:"linear-gradient(135deg,#00d4ff,#7c3aed)",
              color:"#fff", cursor:"pointer",
              fontFamily:"DM Sans, sans-serif", fontWeight:500,
            }}>Get Started</button>
          </>
        )}

        {/* ── Student links ── */}
        {user && !isAdmin && (
          <>
            {["dashboard","roadmap","jobs","assessment","leaderboard"].map(p => (
              <span key={p} onClick={() => setPage(p)} style={{
                cursor:"pointer", fontSize:"0.9rem", fontWeight:500,
                textTransform:"capitalize",
                color: page===p ? "#00d4ff" : "#94a3b8",
                transition:"color .2s",
              }}>{p}</span>
            ))}
          </>
        )}

        {/* ── Admin badge ── */}
        {user && isAdmin && (
          <div style={{
            padding:"4px 14px", borderRadius:20,
            background:"#7c3aed22", border:"1px solid #7c3aed55",
            color:"#a78bfa", fontSize:"0.8rem", fontWeight:700,
            letterSpacing:"0.05em",
          }}>🔐 ADMIN PANEL</div>
        )}

        {/* ── User info + logout ── */}
        {user && (
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>

            {/* Avatar */}
            <div style={{
              width:32, height:32, borderRadius:"50%",
              background: isAdmin
                ? "linear-gradient(135deg,#7c3aed,#a78bfa)"
                : "linear-gradient(135deg,#00d4ff,#7c3aed)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:700, fontSize:"0.85rem", color:"#fff",
            }}>{user.name?.[0]?.toUpperCase()}</div>

            {/* Name */}
            <span style={{ fontSize:"0.9rem", color:"#e2e8f0" }}>{user.name}</span>

            {/* ── Career path badge — students only ── */}
            {!isAdmin && user.careerPath && (
              <div style={{
                padding:"3px 10px", borderRadius:20, fontSize:"0.75rem",
                background:"#00d4ff11", border:"1px solid #00d4ff33",
                color:"#00d4ff", fontWeight:600,
                display:"flex", alignItems:"center", gap:4,
              }}>
                {PATH_ICONS[user.careerPath] || "🎯"} {PATH_LABELS[user.careerPath] || user.careerPath}
              </div>
            )}

            {/* Profile button — students only */}
            {!isAdmin && (
              <button onClick={() => setPage("profile")} style={{
                padding:"6px 14px", borderRadius:6,
                border:"1px solid #374151", background:"transparent",
                color:"#94a3b8", cursor:"pointer", fontSize:"0.8rem",
              }}>Profile</button>
            )}

            {/* Logout */}
            <button onClick={onLogout} style={{
              padding:"6px 14px", borderRadius:6,
              border:"1px solid #374151", background:"transparent",
              color:"#94a3b8", cursor:"pointer", fontSize:"0.8rem",
            }}>Logout</button>
          </div>
        )}

      </div>
    </nav>
  );
}