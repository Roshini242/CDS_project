import { useState, useEffect } from "react";
import { Roadmap, Assessment } from "../services/api";
import Spinner from "../components/Spinner";

export default function Dashboard({ user, setPage }) {
  const [roadmap, setRoadmap] = useState(null);
  const [scores,  setScores]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [rm, sc] = await Promise.all([Roadmap.getMine(), Assessment.getMyScores()]);
        setRoadmap(rm);
        setScores(sc.scores || []);
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const cards = [
    { icon:"🗺️", label:"Roadmap Progress", value: roadmap ? `${roadmap.progress}%` : "—", sub: roadmap?.label || "Choose a path", color:"#00d4ff", page:"roadmap"    },
    { icon:"📊", label:"Assessments Taken", value: scores.length || "0",                  sub:"Quizzes completed",                  color:"#10b981", page:"assessment" },
    { icon:"💼", label:"Jobs Applied",       value: user.appliedJobs?.length || "0",        sub:"Applications",                       color:"#7c3aed", page:"jobs"       },
    { icon:"👤", label:"Profile",            value:`${user.profileCompletion || 0}%`,       sub:"Complete",                           color:"#f59e0b", page:"profile"    },
  ];

  const todos = [
    { done: !!user.profile?.bio,                 text:"Add a bio to your profile"          },
    { done: user.profile?.skills?.length > 0,    text:"Add your skills"                    },
    { done: !!user.careerPath,                   text:"Choose a career path"               },
    { done: scores.length > 0,                   text:"Complete a skill assessment"        },
    { done: user.appliedJobs?.length > 0,        text:"Apply for a job or internship"      },
    { done: !!user.profile?.resumeUrl,           text:"Upload your resume"                 },
  ];

  return (
    <div style={{ paddingTop:80, minHeight:"100vh", padding:"80px 2rem 3rem", maxWidth:1100, margin:"0 auto" }}>
      <div style={{ marginBottom:"2rem" }}>
        <h1 style={{ fontFamily:"Syne, sans-serif", fontSize:"1.8rem", fontWeight:800, color:"#fff" }}>
          Welcome back, {user.name} 👋
        </h1>
        <p style={{ color:"#64748b", marginTop:4 }}>Here's your career development overview</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
        {cards.map((c, i) => (
          <div key={i} onClick={() => setPage(c.page)} style={{
            background:"#111827", border:"1px solid #1e2d45",
            borderRadius:16, padding:"1.5rem", cursor:"pointer", transition:"all .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.borderColor=c.color+"44"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.borderColor="#1e2d45";    }}
          >
            <div style={{ fontSize:"1.8rem", marginBottom:"0.8rem" }}>{c.icon}</div>
            <div style={{ fontFamily:"Syne, sans-serif", fontSize:"1.6rem", fontWeight:800, color:c.color }}>
              {loading ? <Spinner /> : c.value}
            </div>
            <div style={{ color:"#94a3b8", fontSize:"0.85rem" }}>{c.label}</div>
            <div style={{ color:"#64748b", fontSize:"0.75rem" }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>
        {/* Checklist */}
        <div style={{ background:"#111827", border:"1px solid #1e2d45", borderRadius:16, padding:"1.5rem" }}>
          <h3 style={{ fontFamily:"Syne, sans-serif", fontWeight:700, marginBottom:"1.2rem", color:"#fff" }}>📋 Career Checklist</h3>
          {todos.map((t, i) => (
            <div key={i} style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"10px 0",
              borderBottom: i < todos.length - 1 ? "1px solid #1e2d45" : "none",
            }}>
              <div style={{
                width:20, height:20, borderRadius:"50%",
                background: t.done ? "#10b981" : "transparent",
                border: t.done ? "none" : "2px solid #374151",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"0.65rem", color:"#fff", flexShrink:0,
              }}>{t.done ? "✓" : ""}</div>
              <span style={{
                fontSize:"0.88rem",
                color: t.done ? "#64748b" : "#e2e8f0",
                textDecoration: t.done ? "line-through" : "none",
              }}>{t.text}</span>
            </div>
          ))}
        </div>

        {/* Scores */}
        <div style={{ background:"#111827", border:"1px solid #1e2d45", borderRadius:16, padding:"1.5rem" }}>
          <h3 style={{ fontFamily:"Syne, sans-serif", fontWeight:700, marginBottom:"1.2rem", color:"#fff" }}>📊 Recent Quiz Scores</h3>
          {scores.length === 0 ? (
            <div style={{ textAlign:"center", padding:"2rem 0", color:"#64748b" }}>
              <div style={{ fontSize:"2rem", marginBottom:8 }}>🎯</div>
              <p style={{ fontSize:"0.9rem" }}>No assessments taken yet.</p>
              <button onClick={() => setPage("assessment")} style={{
                marginTop:"1rem", padding:"8px 20px", borderRadius:8, border:"none",
                background:"linear-gradient(135deg,#00d4ff,#7c3aed)",
                color:"#fff", cursor:"pointer", fontSize:"0.85rem", fontFamily:"DM Sans, sans-serif",
              }}>Take a Quiz</button>
            </div>
          ) : (
            scores.slice(-5).reverse().map((s, i) => (
              <div key={i} style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"10px 0",
                borderBottom: i < scores.length - 1 ? "1px solid #1e2d45" : "none",
              }}>
                <div>
                  <div style={{ fontWeight:500, color:"#e2e8f0", fontSize:"0.9rem" }}>{s.topic}</div>
                  <div style={{ color:"#64748b", fontSize:"0.75rem" }}>{new Date(s.takenAt).toLocaleDateString()}</div>
                </div>
                <div style={{
                  fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:"1rem",
                  color: s.score / s.total >= 0.7 ? "#10b981" : "#f59e0b",
                }}>{s.score}/{s.total}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}