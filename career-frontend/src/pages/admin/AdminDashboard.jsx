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
  webdev:"#2563eb", datascience:"#059669", uiux:"#7c3aed",
  mobile:"#d97706", cybersecurity:"#dc2626", cloud:"#0891b2",
  ai:"#db2777", devops:"#65a30d", blockchain:"#7c3aed", gamedev:"#ea580c",
};
const PATH_BG = {
  webdev:"#eff6ff", datascience:"#ecfdf5", uiux:"#f5f3ff",
  mobile:"#fffbeb", cybersecurity:"#fef2f2", cloud:"#ecfeff",
  ai:"#fdf2f8", devops:"#f7fee7", blockchain:"#f5f3ff", gamedev:"#fff7ed",
};

const MEDALS      = ["🥇","🥈","🥉"];
const RANK_COLORS = ["#d97706","#64748b","#b45309"];
const RANK_BG     = ["#fffbeb","#f8fafc","#fef3c7"];
const RANK_BORDER = ["#fde68a","#e2e8f0","#fde68a"];

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
    { icon:"🎓", label:"Total Students",    value:stats?.totalStudents,     accent:"#2563eb", bg:"#eff6ff",  border:"#bfdbfe", page:"admin-students"     },
    { icon:"💼", label:"Active Jobs",        value:stats?.totalJobs,         accent:"#7c3aed", bg:"#f5f3ff",  border:"#ddd6fe", page:"admin-jobs"         },
    { icon:"📋", label:"Applications",       value:stats?.totalApplications, accent:"#059669", bg:"#ecfdf5",  border:"#a7f3d0", page:"admin-applications" },
    { icon:"📝", label:"Assessments",        value:stats?.totalAssessments,  accent:"#d97706", bg:"#fffbeb",  border:"#fde68a", page:"admin-assessments"  },
  ];

  return (
    <div>
      <div style={{ marginBottom:"1.8rem" }}>
        <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:"1.75rem", fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em" }}>📊 Admin Dashboard</h1>
        <p style={{ color:"#64748b", marginTop:4, fontSize:"0.9rem" }}>Overview of the entire system</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"1rem", marginBottom:"1.8rem" }}>
        {cards.map((c, i) => (
          <div key={i} onClick={() => setPage(c.page)} style={{
            background:"#ffffff", border:"1px solid #e2e8f0",
            borderRadius:12, padding:"1.4rem", cursor:"pointer",
            transition:"all .2s", boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.borderColor=c.border; e.currentTarget.style.boxShadow=`0 4px 16px ${c.accent}12`; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.04)"; }}
          >
            <div style={{
              width:40, height:40, borderRadius:10,
              background:c.bg, border:`1px solid ${c.border}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"1.2rem", marginBottom:"1rem",
            }}>{c.icon}</div>
            <div style={{ fontFamily:"'Syne', sans-serif", fontSize:"1.8rem", fontWeight:800, color:c.accent, lineHeight:1 }}>
              {loading ? <Spinner /> : c.value ?? "—"}
            </div>
            <div style={{ color:"#64748b", fontSize:"0.82rem", marginTop:5, fontWeight:500 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.2rem", alignItems:"start" }}>

        {/* Recent Students */}
        <div style={{ background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:12, padding:"1.4rem", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.1rem" }}>
            <h3 style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, color:"#0f172a", fontSize:"0.95rem" }}>🎓 Recent Students</h3>
            <button onClick={() => setPage("admin-students")} style={{
              padding:"5px 12px", borderRadius:6, border:"1px solid #e2e8f0",
              background:"#f8fafc", color:"#7c3aed", cursor:"pointer", fontSize:"0.78rem",
              fontWeight:600, transition:"all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background="#f5f3ff"; e.currentTarget.style.borderColor="#ddd6fe"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#f8fafc"; e.currentTarget.style.borderColor="#e2e8f0"; }}
            >View All →</button>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
            {(stats?.recentStudents || []).map((s, i) => (
              <div key={s._id||i} style={{
                display:"flex", alignItems:"center", gap:"0.7rem",
                padding:"0.65rem 0.8rem", borderRadius:9,
                background:"#f8fafc", border:"1px solid #f1f5f9",
                transition:"background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background="#f1f5f9"}
                onMouseLeave={e => e.currentTarget.style.background="#f8fafc"}
              >
                <div style={{
                  width:32, height:32, borderRadius:"50%", flexShrink:0,
                  background:"#7c3aed",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontWeight:700, fontSize:"0.78rem", color:"#fff",
                }}>{s.name?.[0]?.toUpperCase()}</div>

                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ color:"#0f172a", fontSize:"0.84rem", fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
                  <div style={{ color:"#94a3b8", fontSize:"0.7rem", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.email}</div>
                </div>

                {s.careerPath ? (
                  <span style={{
                    flexShrink:0, padding:"2px 8px", borderRadius:20, fontSize:"0.66rem", fontWeight:600,
                    background: PATH_BG[s.careerPath] || "#f1f5f9",
                    color: PATH_COLORS[s.careerPath] || "#64748b",
                    border:`1px solid ${PATH_COLORS[s.careerPath]||"#e2e8f0"}22`,
                  }}>{PATH_LABELS[s.careerPath]||s.careerPath}</span>
                ) : <span style={{ color:"#94a3b8", fontSize:"0.7rem", flexShrink:0 }}>Not set</span>}

                <div style={{ flexShrink:0, display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:36, height:4, background:"#e2e8f0", borderRadius:2 }}>
                    <div style={{
                      width:`${s.profileCompletion||0}%`, height:"100%", borderRadius:2,
                      background: s.profileCompletion>=70?"#059669":s.profileCompletion>=40?"#d97706":"#dc2626",
                    }} />
                  </div>
                  <span style={{ color:"#94a3b8", fontSize:"0.68rem" }}>{s.profileCompletion||0}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div style={{ background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:12, padding:"1.4rem", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.1rem" }}>
            <h3 style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, color:"#0f172a", fontSize:"0.95rem" }}>🏆 Top Students</h3>
            <span style={{ color:"#94a3b8", fontSize:"0.76rem" }}>By avg quiz score</span>
          </div>

          {lbLoading ? (
            <div style={{ textAlign:"center", padding:"2rem" }}><Spinner /></div>
          ) : leaderboard.length === 0 ? (
            <div style={{ textAlign:"center", padding:"2rem" }}>
              <div style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>📭</div>
              <p style={{ color:"#94a3b8", fontSize:"0.84rem" }}>No quiz attempts yet</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
              {leaderboard.slice(0,5).map((s, i) => (
                <div key={s._id||i} style={{
                  display:"flex", alignItems:"center", gap:"0.7rem",
                  padding:"0.65rem 0.8rem", borderRadius:9,
                  background: i<3 ? RANK_BG[i] : "#f8fafc",
                  border:`1px solid ${i<3?RANK_BORDER[i]:"#f1f5f9"}`,
                }}>
                  <div style={{
                    flexShrink:0, width:28, height:28, borderRadius:8,
                    background: i<3 ? RANK_BG[i] : "#f1f5f9",
                    border:`1px solid ${i<3?RANK_BORDER[i]:"#e2e8f0"}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize: i<3 ? "0.95rem" : "0.72rem",
                    fontWeight:700, color: i<3 ? RANK_COLORS[i] : "#94a3b8",
                  }}>{i<3 ? MEDALS[i] : `#${i+1}`}</div>

                  <div style={{
                    flexShrink:0, width:28, height:28, borderRadius:"50%",
                    background:"#7c3aed",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:700, fontSize:"0.72rem", color:"#fff",
                  }}>{s.name?.[0]?.toUpperCase()}</div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ color:"#0f172a", fontSize:"0.84rem", fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
                    <div style={{ color:"#94a3b8", fontSize:"0.68rem" }}>{s.quizzesTaken} quiz{s.quizzesTaken!==1?"zes":""}</div>
                  </div>

                  <div style={{ flexShrink:0, textAlign:"right" }}>
                    <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:"0.95rem", color:i<3?RANK_COLORS[i]:"#64748b" }}>{s.avgScore}%</div>
                    <div style={{ color:"#94a3b8", fontSize:"0.65rem" }}>avg</div>
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