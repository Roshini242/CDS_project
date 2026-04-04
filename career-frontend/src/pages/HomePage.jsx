export default function HomePage({ setPage }) {
  const stats = [
    { v: "500+", l: "Career Paths" },
    { v: "10K+", l: "Students"     },
    { v: "200+", l: "Companies"    },
    { v: "95%",  l: "Placement"    },
  ];
  const features = [
    { icon: "🗺️", title: "Smart Roadmaps",   desc: "Step-by-step career paths tailored to your goals."       },
    { icon: "💼", title: "Job Matching",      desc: "Find internships and jobs that match your skills."       },
    { icon: "📊", title: "Skill Assessment",  desc: "Test your knowledge and get improvement tips."           },
    { icon: "📁", title: "Resume Builder",    desc: "Build a professional resume with guided templates."      },
    { icon: "🎯", title: "Goal Tracking",     desc: "Set career goals and track progress over time."          },
    { icon: "🤝", title: "Mentorship",        desc: "Connect with industry professionals for guidance."       },
  ];

  return (
    <div style={{ paddingTop: 64 }}>
      {/* ── Hero ── */}
      <section style={{
        minHeight: "90vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "4rem 2rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,#00d4ff12,transparent)", top:"5%", left:"5%", animation:"float 7s ease-in-out infinite" }} />
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,#7c3aed12,transparent)", bottom:"5%", right:"5%", animation:"float 9s ease-in-out infinite reverse" }} />

        <div className="fade-up" style={{
          display:"inline-block", padding:"6px 16px", borderRadius:20,
          border:"1px solid #00d4ff44", background:"#00d4ff11",
          fontSize:"0.8rem", color:"#00d4ff", marginBottom:"1.5rem", fontWeight:500,
        }}>🎓 #1 Career Development Platform for Students</div>

        <h1 className="fade-up" style={{
          fontFamily:"Syne, sans-serif", fontSize:"clamp(2.4rem,6vw,4.5rem)",
          fontWeight:800, lineHeight:1.1, maxWidth:800,
          background:"linear-gradient(135deg,#fff 40%,#00d4ff)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          animationDelay:".1s",
        }}>Build Your Dream Career,<br />Step by Step</h1>

        <p className="fade-up" style={{
          fontSize:"1.1rem", color:"#94a3b8", maxWidth:540,
          lineHeight:1.7, marginTop:"1.5rem", animationDelay:".2s",
        }}>
          Navigate your career with personalized roadmaps, skill assessments,
          job listings, and expert guidance — all in one place.
        </p>

        <div className="fade-up" style={{
          display:"flex", gap:12, marginTop:"2.5rem",
          flexWrap:"wrap", justifyContent:"center", animationDelay:".3s",
        }}>
          <button className="glow-btn" onClick={() => setPage("register")} style={{
            padding:"14px 32px", borderRadius:10, border:"none",
            background:"linear-gradient(135deg,#00d4ff,#7c3aed)",
            color:"#fff", fontSize:"1rem", fontWeight:600,
            cursor:"pointer", fontFamily:"DM Sans, sans-serif",
          }}>Start Your Journey →</button>
          <button onClick={() => setPage("login")} style={{
            padding:"14px 32px", borderRadius:10, border:"1px solid #1e2d45",
            background:"transparent", color:"#e2e8f0",
            fontSize:"1rem", cursor:"pointer", fontFamily:"DM Sans, sans-serif",
          }}>Sign In</button>
        </div>

        {/* Stats */}
        <div className="fade-up" style={{
          display:"flex", gap:"3rem", marginTop:"5rem",
          flexWrap:"wrap", justifyContent:"center", animationDelay:".4s",
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"Syne, sans-serif", fontSize:"2rem", fontWeight:800, color:"#00d4ff" }}>{s.v}</div>
              <div style={{ fontSize:"0.85rem", color:"#64748b", marginTop:4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding:"4rem 2rem", maxWidth:1100, margin:"0 auto" }}>
        <h2 style={{
          fontFamily:"Syne, sans-serif", fontSize:"2.2rem", fontWeight:800,
          textAlign:"center", marginBottom:"2.5rem",
          background:"linear-gradient(135deg,#fff,#94a3b8)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        }}>Everything You Need to Succeed</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))", gap:"1.2rem" }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background:"#111827", border:"1px solid #1e2d45",
              borderRadius:16, padding:"1.8rem", transition:"all .25s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#00d4ff44"; e.currentTarget.style.transform="translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#1e2d45";   e.currentTarget.style.transform="translateY(0)";    }}
            >
              <div style={{ fontSize:"1.8rem", marginBottom:"0.8rem" }}>{f.icon}</div>
              <h3 style={{ fontFamily:"Syne, sans-serif", fontWeight:700, marginBottom:"0.4rem", color:"#fff" }}>{f.title}</h3>
              <p style={{ color:"#64748b", fontSize:"0.88rem", lineHeight:1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        margin:"2rem auto 5rem", maxWidth:780, textAlign:"center",
        padding:"3rem 2rem",
        background:"linear-gradient(135deg,#00d4ff0d,#7c3aed0d)",
        border:"1px solid #1e2d45", borderRadius:24,
      }}>
        <h2 style={{ fontFamily:"Syne, sans-serif", fontSize:"2rem", fontWeight:800, color:"#fff", marginBottom:"1rem" }}>
          Ready to launch your career? 🚀
        </h2>
        <p style={{ color:"#94a3b8", marginBottom:"2rem" }}>
          Join thousands of students already building their future.
        </p>
        <button onClick={() => setPage("register")} style={{
          padding:"14px 36px", borderRadius:10, border:"none",
          background:"linear-gradient(135deg,#00d4ff,#7c3aed)",
          color:"#fff", fontSize:"1rem", fontWeight:600,
          cursor:"pointer", fontFamily:"DM Sans, sans-serif",
        }}>Create Free Account</button>
      </section>
    </div>
  );
}