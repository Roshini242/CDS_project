export default function NotFoundPage({ setPage }) {
  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center",
      justifyContent:"center", flexDirection:"column", textAlign:"center",
      padding:"2rem", background:"#0a0f1e",
    }}>
      <div style={{
        fontFamily:"Syne, sans-serif", fontSize:"8rem", fontWeight:800,
        background:"linear-gradient(135deg,#00d4ff,#7c3aed)",
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        lineHeight:1, marginBottom:"1rem",
        filter:"drop-shadow(0 0 30px #00d4ff44)",
      }}>404</div>

      <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🚀</div>

      <h2 style={{ fontFamily:"Syne, sans-serif", fontSize:"1.8rem", fontWeight:800, color:"#fff", marginBottom:"0.8rem" }}>
        Page Not Found
      </h2>
      <p style={{ color:"#64748b", fontSize:"1rem", maxWidth:400, lineHeight:1.6, marginBottom:"2rem" }}>
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", justifyContent:"center" }}>
        <button onClick={() => setPage("home")} style={{
          padding:"12px 28px", borderRadius:12,
          border:"1px solid #1e2d45", background:"transparent",
          color:"#94a3b8", cursor:"pointer", fontSize:"0.95rem",
          fontFamily:"DM Sans, sans-serif", fontWeight:600,
        }}>🏠 Go Home</button>
        <button onClick={() => setPage("dashboard")} style={{
          padding:"12px 28px", borderRadius:12, border:"none",
          background:"linear-gradient(135deg,#00d4ff,#7c3aed)",
          color:"#fff", cursor:"pointer", fontSize:"0.95rem",
          fontFamily:"DM Sans, sans-serif", fontWeight:600,
        }}>📊 Go to Dashboard</button>
      </div>

      <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden" }}>
        {[...Array(20)].map((_,i) => (
          <div key={i} style={{
            position:"absolute",
            width:Math.random()*3+1+"px", height:Math.random()*3+1+"px",
            borderRadius:"50%", background:"#ffffff",
            opacity:Math.random()*0.4+0.1,
            top:Math.random()*100+"%", left:Math.random()*100+"%",
            animation:`twinkle ${Math.random()*3+2}s infinite alternate`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes twinkle {
          from { opacity:0.1; transform:scale(1); }
          to   { opacity:0.6; transform:scale(1.5); }
        }
      `}</style>
    </div>
  );
}