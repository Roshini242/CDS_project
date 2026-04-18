export default function AdminLayout({ page, setPage, children }) {
  const links = [
    { key:"admin-dashboard",    icon:"📊", label:"Dashboard"    },
    { key:"admin-jobs",         icon:"💼", label:"Manage Jobs"  },
    { key:"admin-students",     icon:"🎓", label:"Students"     },
    { key:"admin-applications", icon:"📋", label:"Applications" },
    { key:"admin-assessments",  icon:"📝", label:"Assessments"  },
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh", paddingTop:64 }}>
      {/* Sidebar */}
      <aside style={{
        width:230, background:"#ffffff", borderRight:"1px solid #e2e8f0",
        padding:"1.5rem 0", position:"fixed", top:64, bottom:0,
        display:"flex", flexDirection:"column",
        boxShadow:"1px 0 3px rgba(0,0,0,0.04)",
      }}>
        {/* Admin badge */}
        <div style={{ padding:"0 1.2rem", marginBottom:"1.5rem" }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:6,
            padding:"5px 12px", borderRadius:8,
            background:"#f5f3ff", border:"1px solid #ddd6fe",
            color:"#7c3aed", fontSize:"0.72rem", fontWeight:700,
            letterSpacing:"0.06em", textTransform:"uppercase",
          }}>🔐 Admin Panel</div>
        </div>

        {/* Nav links */}
        <nav style={{ flex:1 }}>
          {links.map(l => {
            const isActive = page === l.key;
            return (
              <div key={l.key} onClick={() => setPage(l.key)} style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"10px 1.2rem", cursor:"pointer",
                background: isActive ? "#f5f3ff" : "transparent",
                borderLeft: isActive ? "3px solid #7c3aed" : "3px solid transparent",
                transition:"all .15s",
                margin:"1px 0",
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background="#f8fafc"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background="transparent"; }}
              >
                <span style={{ fontSize:"1rem" }}>{l.icon}</span>
                <span style={{
                  fontSize:"0.875rem", fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#7c3aed" : "#475569",
                }}>{l.label}</span>
              </div>
            );
          })}
        </nav>

        {/* Footer info */}
        <div style={{ padding:"1.2rem" }}>
          <div style={{
            padding:"10px 12px", borderRadius:9,
            background:"#f8fafc", border:"1px solid #e2e8f0",
          }}>
            <div style={{ fontSize:"0.72rem", color:"#7c3aed", fontWeight:700 }}>🔐 Admin Access</div>
            <div style={{ fontSize:"0.72rem", color:"#94a3b8", marginTop:3 }}>Full system control</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft:230, flex:1, padding:"2rem", background:"#f8fafc", minHeight:"calc(100vh - 64px)" }}>
        {children}
      </main>
    </div>
  );
}