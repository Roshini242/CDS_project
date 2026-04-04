import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Assessment } from "../../services/api";
import Spinner from "../../components/Spinner";

const PATH_LABELS = {
  webdev:"Web Developer", datascience:"Data Scientist", uiux:"UI/UX Designer",
  mobile:"Mobile Developer", cybersecurity:"Cybersecurity Analyst", cloud:"Cloud Engineer",
  ai:"AI Engineer", devops:"DevOps Engineer", blockchain:"Blockchain Developer", gamedev:"Game Developer",
};
const PATH_COLORS = {
  webdev:"#00d4ff", datascience:"#10b981", uiux:"#7c3aed",
  mobile:"#f59e0b", cybersecurity:"#ef4444", cloud:"#38bdf8",
  ai:"#ec4899", devops:"#84cc16", blockchain:"#a78bfa", gamedev:"#f97316",
};
const MEDALS = ["🥇","🥈","🥉"];
const RANK_COLORS = ["#f59e0b","#94a3b8","#cd7f32"];

export default function AdminDashboard({ setPage }) {
  const [stats,       setStats]       = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [lbLoading,   setLbLoading]   = useState(true);

  useEffect(() => {
    api("/admin/stats")
      .then(d => setStats(d.stats))
      .catch(() => setStats({
        totalStudents:12, totalJobs:8, totalApplications:5, totalAssessments:8,
        recentStudents:[
          { _id:"1", name:"Arjun Kumar",  email:"arjun@mail.com",  careerPath:"webdev",      profileCompletion:80 },
          { _id:"2", name:"Priya Sharma", email:"priya@mail.com",  careerPath:"datascience", profileCompletion:65 },
          { _id:"3", name:"Rahul Singh",  email:"rahul@mail.com",  careerPath:"ai",          profileCompletion:40 },
          { _id:"4", name:"Sneha Patel",  email:"sneha@mail.com",  careerPath:"cloud",       profileCompletion:90 },
          { _id:"5", name:"Vikram Nair",  email:"vikram@mail.com", careerPath:"",            profileCompletion:20 },
        ],
      }))
      .finally(() => setLoading(false));

    Assessment.getLeaderboard()
      .then(d => setLeaderboard(d.leaderboard || []))
      .catch(() => setLeaderboard([]))
      .finally(() => setLbLoading(false));
  }, []);

  const cards = [
    { icon:"🎓", label:"Total Students",    value:stats?.totalStudents,     color:"#00d4ff", page:"admin-students"     },
    { icon:"💼", label:"Active Jobs",        value:stats?.totalJobs,         color:"#7c3aed", page:"admin-jobs"         },
    { icon:"📋", label:"Applications",       value:stats?.totalApplications, color:"#10b981", page:"admin-applications" },
    { icon:"📝", label:"Assessments",        value:stats?.totalAssessments,  color:"#f59e0b", page:"admin-assessments"  },
  ];

  return (
    <div>
      <div style={{ marginBottom:"2rem" }}>
        <h1 style={{ fontFamily:"Syne, sans-serif", fontSize:"1.8rem", fontWeight:800, color:"#fff" }}>📊 Admin Dashboard</h1>
        <p style={{ color:"#64748b", marginTop:4 }}>Overview of the entire system</p>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
        {cards.map((c, i) => (
          <div key={i} onClick={() => setPage(c.page)} style={{
            background:"#111827", border:"1px solid #1e2d45",
            borderRadius:16, padding:"1.5rem", cursor:"pointer", transition:"all .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.borderColor=c.color+"44"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.borderColor="#1e2d45";    }}
          >
            <div style={{ fontSize:"1.8rem", marginBottom:"0.8rem" }}>{c.icon}</div>
            <div style={{ fontFamily:"Syne, sans-serif", fontSize:"2rem", fontWeight:800, color:c.color }}>
              {loading ? <Spinner /> : c.value ?? "—"}
            </div>
            <div style={{ color:"#94a3b8", fontSize:"0.85rem", marginTop:4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* ── Bottom grid: Recent Students + Leaderboard ───────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem", alignItems:"start" }}>

        {/* Recent Students */}
        <div style={{ background:"#111827", border:"1px solid #1e2d45", borderRadius:16, padding:"1.5rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.2rem" }}>
            <h3 style={{ fontFamily:"Syne, sans-serif", fontWeight:700, color:"#fff" }}>🎓 Recent Students</h3>
            <button onClick={() => setPage("admin-students")} style={{
              padding:"6px 14px", borderRadius:8, border:"1px solid #1e2d45",
              background:"transparent", color:"#a78bfa", cursor:"pointer", fontSize:"0.8rem",
            }}>View All →</button>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
            {(stats?.recentStudents || []).map((s, i) => (
              <div key={s._id||i} style={{
                display:"flex", alignItems:"center", gap:"0.8rem",
                padding:"0.7rem 0.8rem", borderRadius:10,
                background:"#0d1424", border:"1px solid #1e2d4533",
              }}>
                {/* Avatar */}
                <div style={{
                  width:34, height:34, borderRadius:"50%", flexShrink:0,
                  background:"linear-gradient(135deg,#00d4ff,#7c3aed)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontWeight:700, fontSize:"0.8rem", color:"#fff",
                }}>{s.name?.[0]?.toUpperCase()}</div>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ color:"#e2e8f0", fontSize:"0.85rem", fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
                  <div style={{ color:"#64748b", fontSize:"0.72rem", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.email}</div>
                </div>

                {/* Career path */}
                {s.careerPath ? (
                  <span style={{
                    flexShrink:0, padding:"2px 8px", borderRadius:20, fontSize:"0.68rem",
                    background:(PATH_COLORS[s.careerPath]||"#94a3b8")+"22",
                    color: PATH_COLORS[s.careerPath]||"#94a3b8",
                  }}>{PATH_LABELS[s.careerPath]||s.careerPath}</span>
                ) : <span style={{ color:"#64748b", fontSize:"0.72rem", flexShrink:0 }}>Not set</span>}

                {/* Profile % */}
                <div style={{ flexShrink:0, display:"flex", alignItems:"center", gap:4 }}>
                  <div style={{ width:40, height:5, background:"#1e2d45", borderRadius:3 }}>
                    <div style={{
                      width:`${s.profileCompletion||0}%`, height:"100%", borderRadius:3,
                      background: s.profileCompletion>=70?"#10b981":s.profileCompletion>=40?"#f59e0b":"#ef4444",
                    }} />
                  </div>
                  <span style={{ color:"#64748b", fontSize:"0.7rem" }}>{s.profileCompletion||0}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Leaderboard ─────────────────────────────────────────────────── */}
        <div style={{ background:"#111827", border:"1px solid #1e2d45", borderRadius:16, padding:"1.5rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.2rem" }}>
            <h3 style={{ fontFamily:"Syne, sans-serif", fontWeight:700, color:"#fff" }}>🏆 Top Students</h3>
            <span style={{ color:"#64748b", fontSize:"0.78rem" }}>By avg quiz score</span>
          </div>

          {lbLoading ? (
            <div style={{ textAlign:"center", padding:"2rem" }}><Spinner /></div>
          ) : leaderboard.length === 0 ? (
            <div style={{ textAlign:"center", padding:"2rem" }}>
              <div style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>📭</div>
              <p style={{ color:"#64748b", fontSize:"0.85rem" }}>No quiz attempts yet</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
              {leaderboard.slice(0,5).map((s, i) => (
                <div key={s._id||i} style={{
                  display:"flex", alignItems:"center", gap:"0.8rem",
                  padding:"0.7rem 0.8rem", borderRadius:10,
                  background: i<3 ? RANK_COLORS[i]+"08" : "#0d1424",
                  border:`1px solid ${i<3?RANK_COLORS[i]+"33":"#1e2d4533"}`,
                }}>
                  {/* Rank */}
                  <div style={{
                    flexShrink:0, width:30, height:30, borderRadius:8,
                    background: i<3 ? RANK_COLORS[i]+"22" : "#1e2d45",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize: i<3 ? "1rem" : "0.75rem",
                    fontWeight:700, color: i<3 ? RANK_COLORS[i] : "#64748b",
                  }}>
                    {i<3 ? MEDALS[i] : `#${i+1}`}
                  </div>

                  {/* Avatar */}
                  <div style={{
                    flexShrink:0, width:30, height:30, borderRadius:"50%",
                    background:"linear-gradient(135deg,#00d4ff,#7c3aed)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:700, fontSize:"0.75rem", color:"#fff",
                  }}>{s.name?.[0]?.toUpperCase()}</div>

                  {/* Name */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ color:"#e2e8f0", fontSize:"0.85rem", fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
                    <div style={{ color:"#64748b", fontSize:"0.7rem" }}>{s.quizzesTaken} quiz{s.quizzesTaken!==1?"zes":""}</div>
                  </div>

                  {/* Score */}
                  <div style={{ flexShrink:0, textAlign:"right" }}>
                    <div style={{
                      fontFamily:"Syne, sans-serif", fontWeight:800, fontSize:"1rem",
                      color: i<3 ? RANK_COLORS[i] : "#94a3b8",
                    }}>{s.avgScore}%</div>
                    <div style={{ color:"#64748b", fontSize:"0.68rem" }}>avg</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}