import { useState, useEffect } from "react";
import { Roadmap, Assessment } from "../services/api";
import Spinner from "../components/Spinner";

export default function Dashboard({ user, setPage }) {
  const [roadmap, setRoadmap] = useState(null);
  const [scores,  setScores]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setRoadmap(null);
      setScores([]);
      try {
        const [rm, sc] = await Promise.all([Roadmap.getMine(), Assessment.getMyScores()]);
        setRoadmap(rm);
        setScores(sc.scores || []);
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    };
    if (user) load();
  }, [user]);

  const cards = [
    { icon:"🗺️", label:"Roadmap Progress", value: roadmap ? `${roadmap.progress}%` : "—", sub: roadmap?.label || "Choose a path", accent:"#2563eb", bg:"#eff6ff", border:"#bfdbfe", page:"roadmap"    },
    { icon:"📊", label:"Assessments Taken", value: scores.length || "0",                  sub:"Quizzes completed",                  accent:"#059669", bg:"#ecfdf5", border:"#a7f3d0", page:"assessment" },
    { icon:"💼", label:"Jobs Applied",       value: user.appliedJobs?.length || "0",        sub:"Applications",                       accent:"#7c3aed", bg:"#f5f3ff", border:"#ddd6fe", page:"jobs"       },
    { icon:"👤", label:"Profile",            value:`${user.profileCompletion || 0}%`,       sub:"Complete",                           accent:"#d97706", bg:"#fffbeb", border:"#fde68a", page:"profile"    },
  ];

  const todos = [
    { done: !!user.profile?.bio,                 text:"Add a bio to your profile"          },
    { done: user.profile?.skills?.length > 0,    text:"Add your skills"                    },
    { done: !!user.careerPath,                   text:"Choose a career path"               },
    { done: scores.length > 0,                   text:"Complete a skill assessment"        },
    { done: user.appliedJobs?.length > 0,        text:"Apply for a job or internship"      },
    { done: !!user.profile?.resumeUrl,           text:"Upload your resume"                 },
  ];

  const completedCount = todos.filter(t => t.done).length;
  const progressPct = Math.round((completedCount / todos.length) * 100);

  const quickActions = [
    { label: "Update your profile", status: user.profileCompletion >= 70 ? "Up to date" : "Pending details", page: "profile" },
    { label: "Take a new assessment", status: scores.length > 0 ? "Recommended" : "First step", page: "assessment" },
    { label: "Browse matching jobs", status: user.appliedJobs?.length > 0 ? "Explore more" : "Start applying", page: "jobs" },
  ];

  return (
    <div className="page-container dashboard-page" style={{ paddingTop: 100, minHeight: "100vh" }}>
      <div className="dashboard-header">
        <div className="hero-card card">
          <div className="header-main">
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span className="badge badge-blue">Career Snapshot</span>
              <span style={{ fontSize: "0.9rem", color: "var(--slate-500)", fontWeight: 600 }}>Stay on track with your growth plan</span>
            </div>
            <h1>Welcome back, {user.name} 👋</h1>
            <p>Here's your career development overview.</p>
          </div>

          <div className="hero-panel">
            <div className="hero-info">
              <div style={{ fontSize: "0.95rem", color: "var(--slate-700)", fontWeight: 700, marginBottom: 8 }}>Focus for today</div>
              <p style={{ color: "var(--slate-500)", lineHeight: 1.8, maxWidth: 520 }}>
                Complete your profile details and take another assessment to improve your recommendations and job matches.
              </p>
            </div>
          </div>
        </div>

        <div className="hero-actions card">
          <div className="section-header">
            <h3>🚀 Quick Actions</h3>
          </div>
          <div className="hero-action-list">
            {quickActions.map((action, idx) => (
              <div key={idx} className="hero-action-card">
                <div>
                  <div style={{ fontWeight: 700, color: "var(--slate-900)", marginBottom: 4 }}>{action.label}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--slate-500)" }}>{action.status}</div>
                </div>
                <button className="hero-action-button" onClick={() => setPage(action.page)}>{action.page === "profile" ? "View" : "Go"}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {cards.map((c, i) => (
          <div key={i} className="metric-card card" onClick={() => setPage(c.page)}>
            <div className="metric-icon" style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.accent }}>{c.icon}</div>
            <div className="metric-value">{loading ? <Spinner /> : c.value}</div>
            <div className="metric-label">{c.label}</div>
            <div className="metric-subtitle">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-bottom">
        <div className="section-card card">
          <div className="section-header">
            <h3>📋 Career Checklist</h3>
            <span className="badge badge-blue">{completedCount}/{todos.length}</span>
          </div>
          {todos.map((t, i) => (
            <div key={i} className="check-item">
              <div className="check-box" style={{
                background: t.done ? "#059669" : "#ffffff",
                border: t.done ? "none" : "1px solid #cbd5e1",
                color: t.done ? "#fff" : "transparent",
              }}>{t.done ? "✓" : ""}</div>
              <div className={`check-text ${t.done ? "completed" : ""}`}>{t.text}</div>
            </div>
          ))}
        </div>

        <div className="section-card card">
          <div className="section-header">
            <h3>📊 Recent Quiz Scores</h3>
          </div>

          {scores.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>🎯</div>
              <p>No assessments taken yet.</p>
              <button onClick={() => setPage("assessment")} className="btn-primary">Take a Quiz</button>
            </div>
          ) : (
            scores.slice(-5).reverse().map((s, i) => (
              <div key={i} className="score-row">
                <div className="score-meta">
                  <div className="score-top">{s.topic}</div>
                  <div className="score-date">{new Date(s.takenAt).toLocaleDateString()}</div>
                </div>
                <div className={`score-pill ${s.score / s.total >= 0.7 ? "passed" : "at-risk"}`}>
                  {s.score}/{s.total}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
