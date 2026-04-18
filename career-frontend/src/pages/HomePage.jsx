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
    <div style={{ paddingTop: 64, background: "#f8fafc", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section style={{
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        padding: "5rem 2rem 4rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle grid background */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.4,
        }} />
        {/* Blue glow top center */}
        <div style={{
          position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
          width: 600, height: 300, borderRadius: "50%",
          background: "radial-gradient(ellipse, #2563eb18 0%, transparent 70%)",
          zIndex: 0,
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div className="fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 14px", borderRadius: 20,
            border: "1px solid #bfdbfe", background: "#eff6ff",
            fontSize: "0.78rem", color: "#1d4ed8", marginBottom: "1.5rem",
            fontWeight: 600, letterSpacing: "0.03em",
          }}>
            <span>🎓</span> #1 Career Development Platform for Students
          </div>

          <h1 className="fade-up" style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
            fontWeight: 800, lineHeight: 1.15,
            color: "#0f172a", maxWidth: 720, margin: "0 auto",
            letterSpacing: "-0.02em",
            animationDelay: ".1s",
          }}>
            Build Your Dream Career,{" "}
            <span style={{ color: "#2563eb" }}>Step by Step</span>
          </h1>

          <p className="fade-up" style={{
            fontSize: "1.05rem", color: "#64748b", maxWidth: 520,
            lineHeight: 1.75, margin: "1.5rem auto 0",
            animationDelay: ".2s",
          }}>
            Navigate your career with personalized roadmaps, skill assessments,
            job listings, and expert guidance — all in one place.
          </p>

          <div className="fade-up" style={{
            display: "flex", gap: 12, marginTop: "2.5rem",
            flexWrap: "wrap", justifyContent: "center",
            animationDelay: ".3s",
          }}>
            <button className="glow-btn" onClick={() => setPage("register")} style={{
              padding: "13px 30px", borderRadius: 8, border: "none",
              background: "#2563eb", color: "#fff",
              fontSize: "0.95rem", fontWeight: 600, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 14px #2563eb44",
              transition: "background 0.2s, transform 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1d4ed8"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#2563eb"; e.currentTarget.style.transform = "translateY(0)"; }}
            >Start Your Journey →</button>
            <button onClick={() => setPage("login")} style={{
              padding: "13px 30px", borderRadius: 8,
              border: "1px solid #cbd5e1", background: "#ffffff",
              color: "#334155", fontSize: "0.95rem",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500, transition: "border-color 0.2s, background 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#94a3b8"; e.currentTarget.style.background = "#f8fafc"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.background = "#ffffff"; }}
            >Sign In</button>
          </div>

          {/* Stats */}
          <div className="fade-up" style={{
            display: "flex", gap: "0", marginTop: "4rem",
            flexWrap: "wrap", justifyContent: "center",
            border: "1px solid #e2e8f0", borderRadius: 12,
            background: "#f8fafc", maxWidth: 600, margin: "4rem auto 0",
            overflow: "hidden",
            animationDelay: ".4s",
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                textAlign: "center", padding: "1.4rem 2rem",
                flex: 1, minWidth: 120,
                borderRight: i < stats.length - 1 ? "1px solid #e2e8f0" : "none",
              }}>
                <div style={{
                  fontFamily: "'Syne', sans-serif", fontSize: "1.6rem",
                  fontWeight: 800, color: "#2563eb",
                }}>{s.v}</div>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: 3, fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: "4rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            display: "inline-block", padding: "4px 14px", borderRadius: 20,
            background: "#eff6ff", border: "1px solid #bfdbfe",
            color: "#1d4ed8", fontSize: "0.75rem", fontWeight: 600,
            letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.9rem",
          }}>Features</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 800,
            color: "#0f172a", letterSpacing: "-0.02em",
          }}>Everything You Need to Succeed</h2>
          <p style={{ color: "#64748b", marginTop: "0.6rem", fontSize: "0.95rem" }}>
            One platform. Every tool for your career growth.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: "1rem",
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: "#ffffff", border: "1px solid #e2e8f0",
              borderRadius: 12, padding: "1.6rem",
              transition: "all 0.2s", cursor: "default",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#bfdbfe";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: "#eff6ff", border: "1px solid #bfdbfe",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.3rem", marginBottom: "1rem",
              }}>{f.icon}</div>
              <h3 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
                fontSize: "1rem", color: "#0f172a", marginBottom: "0.4rem",
              }}>{f.title}</h3>
              <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        margin: "0 auto 5rem", maxWidth: 760,
        textAlign: "center", padding: "3rem 2rem",
        background: "#2563eb",
        borderRadius: 16,
        boxShadow: "0 8px 32px #2563eb33",
      }}>
        <h2 style={{
          fontFamily: "'Syne', sans-serif", fontSize: "1.8rem",
          fontWeight: 800, color: "#ffffff", marginBottom: "0.8rem",
          letterSpacing: "-0.01em",
        }}>
          Ready to launch your career? 🚀
        </h2>
        <p style={{ color: "#bfdbfe", marginBottom: "2rem", fontSize: "0.95rem" }}>
          Join thousands of students already building their future.
        </p>
        <button onClick={() => setPage("register")} style={{
          padding: "13px 32px", borderRadius: 8, border: "none",
          background: "#ffffff", color: "#2563eb",
          fontSize: "0.95rem", fontWeight: 700, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          transition: "background 0.2s, transform 0.15s",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.transform = "translateY(0)"; }}
        >Create Free Account</button>
      </section>
    </div>
  );
}