import { useState, useEffect } from "react";
import { Assessment } from "../services/api";
import Spinner from "../components/Spinner";

const MEDALS      = ["🥇","🥈","🥉"];
const RANK_COLORS = ["#d97706","#64748b","#b45309"];
const RANK_BG     = ["#fffbeb","#f8fafc","#fef3c7"];
const RANK_BORDER = ["#fde68a","#e2e8f0","#fde68a"];

export default function LeaderboardPage({ user }) {
  const [board,   setBoard]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("avgScore");

  useEffect(() => {
    Assessment.getLeaderboard()
      .then(d => setBoard(d.leaderboard || []))
      .catch(() => setBoard([]))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...board].sort((a,b) => b[filter] - a[filter]);
  const myRank  = sorted.findIndex(s => s.name === user?.name) + 1;

  return (
    <div style={{ paddingTop:80, minHeight:"100vh", background:"#f8fafc", padding:"80px 2rem 3rem", maxWidth:800, margin:"0 auto" }}>

      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:"2rem" }}>
        <div style={{
          width:64, height:64, borderRadius:16, background:"#fffbeb",
          border:"1px solid #fde68a", display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:"2rem", margin:"0 auto 0.8rem",
        }}>🏆</div>
        <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:"1.75rem", fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em", marginBottom:4 }}>
          Leaderboard
        </h1>
        <p style={{ color:"#64748b", fontSize:"0.9rem" }}>Top students ranked by assessment performance</p>
      </div>

      {/* My rank banner */}
      {myRank > 0 && (
        <div style={{
          marginBottom:"1.2rem", padding:"1rem 1.4rem",
          background:"#f5f3ff", border:"1px solid #ddd6fe",
          borderRadius:12, display:"flex", alignItems:"center",
          justifyContent:"space-between", flexWrap:"wrap", gap:"1rem",
          boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.8rem" }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"#ede9fe", border:"1px solid #ddd6fe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem" }}>🎯</div>
            <div>
              <div style={{ color:"#7c3aed", fontWeight:700, fontSize:"0.88rem" }}>Your Current Rank</div>
              <div style={{ color:"#94a3b8", fontSize:"0.76rem" }}>Keep taking quizzes to climb higher!</div>
            </div>
          </div>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:"1.8rem", color:"#7c3aed" }}>
            #{myRank}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1.2rem", flexWrap:"wrap" }}>
        {[
          { key:"avgScore",     label:"⭐ Avg Score"    },
          { key:"bestScore",    label:"🏆 Best Score"   },
          { key:"quizzesTaken", label:"📊 Most Quizzes" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding:"7px 15px", borderRadius:7, cursor:"pointer",
            border:`1px solid ${filter===f.key?"#2563eb":"#e2e8f0"}`,
            background: filter===f.key ? "#eff6ff" : "#ffffff",
            color: filter===f.key ? "#2563eb" : "#64748b",
            fontFamily:"'DM Sans', sans-serif", fontSize:"0.84rem", fontWeight:500,
            transition:"all 0.2s",
          }}>{f.label}</button>
        ))}
      </div>

      {/* Leaderboard */}
      {loading ? (
        <div style={{ textAlign:"center", padding:"3rem" }}><Spinner /></div>
      ) : sorted.length === 0 ? (
        <div style={{ textAlign:"center", padding:"4rem", background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:14, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize:"2.5rem", marginBottom:"1rem" }}>📭</div>
          <p style={{ color:"#64748b", fontSize:"0.9rem" }}>No quiz attempts yet. Be the first to take a quiz!</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
          {sorted.map((s, i) => {
            const isMe   = s.name === user?.name;
            const isTop3 = i < 3;

            return (
              <div key={s._id||i} style={{
                background: isMe ? "#f5f3ff" : "#ffffff",
                border:`1px solid ${isMe?"#ddd6fe":isTop3?RANK_BORDER[i]:"#e2e8f0"}`,
                borderRadius:12, padding:"1rem 1.4rem",
                display:"flex", alignItems:"center", gap:"1rem",
                transition:"all .2s", boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.08)"; e.currentTarget.style.transform="translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.04)"; e.currentTarget.style.transform="translateY(0)"; }}
              >
                {/* Rank badge */}
                <div style={{
                  flexShrink:0, width:42, height:42, borderRadius:10,
                  background: isTop3 ? RANK_BG[i] : "#f8fafc",
                  border:`1px solid ${isTop3?RANK_BORDER[i]:"#e2e8f0"}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize: isTop3 ? "1.3rem" : "0.88rem",
                  fontFamily:"'Syne', sans-serif", fontWeight:800,
                  color: isTop3 ? RANK_COLORS[i] : "#94a3b8",
                }}>
                  {isTop3 ? MEDALS[i] : `#${i+1}`}
                </div>

                {/* Avatar + Name */}
                <div style={{ display:"flex", alignItems:"center", gap:"0.7rem", flex:1 }}>
                  <div style={{
                    width:38, height:38, borderRadius:"50%",
                    background: isMe ? "#7c3aed" : "#2563eb",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:700, fontSize:"0.95rem", color:"#fff", flexShrink:0,
                  }}>{s.name?.[0]?.toUpperCase()}</div>
                  <div>
                    <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, color:isMe?"#7c3aed":"#0f172a", fontSize:"0.9rem", display:"flex", alignItems:"center", gap:6 }}>
                      {s.name}
                      {isMe && <span style={{ fontSize:"0.68rem", color:"#7c3aed", background:"#ede9fe", border:"1px solid #ddd6fe", padding:"1px 7px", borderRadius:20, fontWeight:600 }}>You</span>}
                    </div>
                    <div style={{ color:"#94a3b8", fontSize:"0.73rem" }}>
                      {s.quizzesTaken} quiz{s.quizzesTaken!==1?"zes":""} taken
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display:"flex", gap:"1.2rem", flexShrink:0 }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:"1.1rem", color:filter==="avgScore"?"#2563eb":"#94a3b8" }}>{s.avgScore}%</div>
                    <div style={{ color:"#94a3b8", fontSize:"0.66rem", fontWeight:500 }}>Avg</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:"1.1rem", color:filter==="bestScore"?"#d97706":"#94a3b8" }}>{s.bestScore}%</div>
                    <div style={{ color:"#94a3b8", fontSize:"0.66rem", fontWeight:500 }}>Best</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:"1.1rem", color:filter==="quizzesTaken"?"#059669":"#94a3b8" }}>{s.quizzesTaken}</div>
                    <div style={{ color:"#94a3b8", fontSize:"0.66rem", fontWeight:500 }}>Quizzes</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}