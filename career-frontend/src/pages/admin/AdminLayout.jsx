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
        width:240, background:"#0d1424", borderRight:"1px solid #1e2d45",
        padding:"2rem 0", position:"fixed", top:64, bottom:0,
        display:"flex", flexDirection:"column",
      }}>
        <div style={{ padding:"0 1.5rem", marginBottom:"2rem" }}>
          <div style={{
            display:"inline-block", padding:"4px 12px", borderRadius:20,
            background:"#7c3aed22", border:"1px solid #7c3aed44",
            color:"#a78bfa", fontSize:"0.75rem", fontWeight:600,
          }}>ADMIN PANEL</div>
        </div>

        {links.map(l => (
          <div key={l.key} onClick={() => setPage(l.key)} style={{
            display:"flex", alignItems:"center", gap:12,
            padding:"12px 1.5rem", cursor:"pointer",
            background: page===l.key ? "#7c3aed22" : "transparent",
            borderLeft: page===l.key ? "3px solid #7c3aed" : "3px solid transparent",
            transition:"all .2s",
          }}
            onMouseEnter={e => { if(page!==l.key) e.currentTarget.style.background="#ffffff08"; }}
            onMouseLeave={e => { if(page!==l.key) e.currentTarget.style.background="transparent"; }}
          >
            <span style={{ fontSize:"1.1rem" }}>{l.icon}</span>
            <span style={{
              fontSize:"0.9rem", fontWeight:500,
              color: page===l.key ? "#a78bfa" : "#94a3b8",
            }}>{l.label}</span>
          </div>
        ))}

        <div style={{ marginTop:"auto", padding:"1.5rem" }}>
          <div style={{
            padding:"12px", borderRadius:10,
            background:"#7c3aed11", border:"1px solid #7c3aed33",
          }}>
            <div style={{ fontSize:"0.75rem", color:"#a78bfa", fontWeight:600 }}>🔐 Admin Access</div>
            <div style={{ fontSize:"0.75rem", color:"#64748b", marginTop:4 }}>Full system control</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft:240, flex:1, padding:"2rem", background:"#0a0f1e" }}>
        {children}
      </main>
    </div>
  );
}