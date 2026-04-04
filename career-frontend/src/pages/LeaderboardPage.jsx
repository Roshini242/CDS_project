import { useState, useEffect } from "react";
import { Assessment } from "../services/api";
import Spinner from "../components/Spinner";

const MEDALS = ["🥇","🥈","🥉"];
const RANK_COLORS = ["#f59e0b","#94a3b8","#cd7f32"];

export default function LeaderboardPage({ user }) {
  const [board,   setBoard]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("avgScore"); // avgScore | bestScore | quizzesTaken

  useEffect(() => {
    Assessment.getLeaderboard()
      .then(d => setBoard(d.leaderboard || []))
      .catch(() => setBoard([]))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...board].sort((a,b) => b[filter] - a[filter]);
  const myRank = sorted.findIndex(s => s.name === user?.name) + 1;

  return (
    <div style={{ paddingTop:80, minHeight:"100vh", padding:"80px 2rem 3rem", maxWidth:800, margin:"0 auto" }}>

      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:"2rem" }}>
        <div style={{ fontSize:"3.5rem", marginBottom:"0.5rem" }}>🏆</div>
        <h1 style={{ fontFamily:"Syne, sans-serif", fontSize:"2rem", fontWeight:800, color:"#fff", marginBottom:4 }}>
          Leaderboard
        </h1>
        <p style={{ color:"#64748b" }}>Top students ranked by assessment performance</p>
      </div>

      {/* My rank banner */}
      {myRank > 0 && (
        <div style={{
          marginBottom:"1.5rem", padding:"1rem 1.5rem",
          background:"#7c3aed11", border:"1px solid #7c3aed33",
          borderRadius:14, display:"flex", alignItems:"center",
          justifyContent:"space-between", flexWrap:"wrap", gap:"1rem",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.8rem" }}>
            <span style={{ fontSize:"1.5rem" }}>🎯</span>
            <div>
              <div style={{ color:"#a78bfa", fontWeight:700, fontSize:"0.9rem" }}>Your Current Rank</div>
              <div style={{ color:"#64748b", fontSize:"0.78rem" }}>Keep taking quizzes to climb higher!</div>
            </div>
          </div>
          <div style={{ fontFamily:"Syne, sans-serif", fontWeight:800, fontSize:"2rem", color:"#a78bfa" }}>
            #{myRank}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:"0.6rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
        {[
          { key:"avgScore",     label:"⭐ Avg Score"     },
          { key:"bestScore",    label:"🏆 Best Score"    },
          { key:"quizzesTaken", label:"📊 Most Quizzes"  },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding:"7px 16px", borderRadius:8, cursor:"pointer",
            border:`1px solid ${filter===f.key?"#00d4ff":"#1e2d45"}`,
            background: filter===f.key ? "#00d4ff22" : "transparent",
            color: filter===f.key ? "#00d4ff" : "#64748b",
            fontFamily:"DM Sans, sans-serif", fontSize:"0.85rem", fontWeight:500,
          }}>{f.label}</button>
        ))}
      </div>

      {/* Leaderboard */}
      {loading ? (
        <div style={{ textAlign:"center", padding:"3rem" }}><Spinner /></div>
      ) : sorted.length === 0 ? (
        <div style={{ textAlign:"center", padding:"4rem", background:"#111827", border:"1px solid #1e2d45", borderRadius:16 }}>
          <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>📭</div>
          <p style={{ color:"#64748b" }}>No quiz attempts yet. Be the first to take a quiz!</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"0.8rem" }}>
          {sorted.map((s, i) => {
            const isMe    = s.name === user?.name;
            const isTop3  = i < 3;

            return (
              <div key={s._id||i} style={{
                background: isMe ? "#7c3aed11" : "#111827",
                border:`1px solid ${isMe?"#7c3aed44":isTop3?RANK_COLORS[i]+"44":"#1e2d45"}`,
                borderRadius:14, padding:"1rem 1.5rem",
                display:"flex", alignItems:"center", gap:"1rem",
                transition:"all .2s",
              }}>
                {/* Rank */}
                <div style={{
                  flexShrink:0, width:44, height:44, borderRadius:12,
                  background: isTop3 ? RANK_COLORS[i]+"22" : "#1e2d45",
                  border:`1px solid ${isTop3?RANK_COLORS[i]+"55":"#374151"}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize: isTop3 ? "1.4rem" : "1rem",
                  fontFamily:"Syne, sans-serif", fontWeight:800,
                  color: isTop3 ? RANK_COLORS[i] : "#64748b",
                }}>
                  {isTop3 ? MEDALS[i] : `#${i+1}`}
                </div>

                {/* Avatar + Name */}
                <div style={{ display:"flex", alignItems:"center", gap:"0.8rem", flex:1 }}>
                  <div style={{
                    width:40, height:40, borderRadius:"50%",
                    background: isMe
                      ? "linear-gradient(135deg,#7c3aed,#a78bfa)"
                      : "linear-gradient(135deg,#00d4ff,#7c3aed)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:700, fontSize:"1rem", color:"#fff", flexShrink:0,
                  }}>{s.name?.[0]?.toUpperCase()}</div>
                  <div>
                    <div style={{
                      fontFamily:"Syne, sans-serif", fontWeight:700,
                      color: isMe ? "#a78bfa" : "#fff", fontSize:"0.95rem",
                    }}>
                      {s.name} {isMe && <span style={{ fontSize:"0.72rem", color:"#7c3aed", background:"#7c3aed22", padding:"1px 8px", borderRadius:20 }}>You</span>}
                    </div>
                    <div style={{ color:"#64748b", fontSize:"0.75rem" }}>
                      {s.quizzesTaken} quiz{s.quizzesTaken!==1?"zes":""} taken
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display:"flex", gap:"1.5rem", flexShrink:0 }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{
                      fontFamily:"Syne, sans-serif", fontWeight:800, fontSize:"1.2rem",
                      color: filter==="avgScore" ? "#00d4ff" : "#94a3b8",
                    }}>{s.avgScore}%</div>
                    <div style={{ color:"#64748b", fontSize:"0.68rem" }}>Avg</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{
                      fontFamily:"Syne, sans-serif", fontWeight:800, fontSize:"1.2rem",
                      color: filter==="bestScore" ? "#f59e0b" : "#94a3b8",
                    }}>{s.bestScore}%</div>
                    <div style={{ color:"#64748b", fontSize:"0.68rem" }}>Best</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{
                      fontFamily:"Syne, sans-serif", fontWeight:800, fontSize:"1.2rem",
                      color: filter==="quizzesTaken" ? "#10b981" : "#94a3b8",
                    }}>{s.quizzesTaken}</div>
                    <div style={{ color:"#64748b", fontSize:"0.68rem" }}>Quizzes</div>
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