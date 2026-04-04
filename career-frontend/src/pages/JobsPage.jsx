import { useState, useEffect, useCallback } from "react";
import { Jobs } from "../services/api";
import Toast from "../components/Toast";
import Spinner from "../components/Spinner";

const FALLBACK = [
  { _id:"1", title:"Frontend Developer Intern", company:"TechCorp",  type:"Internship", location:"Remote",    tags:["React","CSS"],        salary:"₹15,000/mo",
    rounds:[
      { step:1, name:"Online Aptitude Test", description:"Quantitative aptitude and logical reasoning" },
      { step:2, name:"Technical Interview",  description:"React, HTML/CSS, JavaScript concepts" },
      { step:3, name:"HR Interview",         description:"Culture fit and offer discussion" },
    ]},
  { _id:"2", title:"Data Analyst",              company:"DataWorks",  type:"Full-time",  location:"Chennai",   tags:["Python","SQL"],        salary:"₹6 LPA",
    rounds:[
      { step:1, name:"Online Test",          description:"Aptitude, reasoning and basic coding" },
      { step:2, name:"Technical Interview",  description:"Python, SQL, data analysis concepts" },
      { step:3, name:"HR Interview",         description:"Salary negotiation and final offer" },
    ]},
  { _id:"3", title:"UI/UX Designer",            company:"DesignHub",  type:"Part-time",  location:"Bangalore", tags:["Figma","XD"],          salary:"₹20,000/mo",
    rounds:[
      { step:1, name:"Portfolio Review",     description:"Review of past design work and case studies" },
      { step:2, name:"Design Challenge",     description:"Live design task using Figma" },
      { step:3, name:"HR Interview",         description:"Role expectations and offer" },
    ]},
  { _id:"4", title:"Backend Developer",         company:"CloudSoft",  type:"Full-time",  location:"Hybrid",    tags:["Node.js","MongoDB"],   salary:"₹8 LPA",
    rounds:[
      { step:1, name:"Coding Test",          description:"DSA problems and algorithm challenges" },
      { step:2, name:"Technical Interview",  description:"Node.js, MongoDB, system design" },
      { step:3, name:"HR Interview",         description:"Compensation and joining formalities" },
    ]},
  { _id:"5", title:"ML Engineer Intern",        company:"AILabs",     type:"Internship", location:"Remote",    tags:["Python","TensorFlow"], salary:"₹12,000/mo",
    rounds:[
      { step:1, name:"Online Assessment",    description:"Python, ML theory and aptitude" },
      { step:2, name:"Technical Interview",  description:"ML concepts, model building discussion" },
      { step:3, name:"HR Interview",         description:"Internship terms and final selection" },
    ]},
  { _id:"6", title:"Mobile Developer",          company:"AppWorks",   type:"Full-time",  location:"Mumbai",    tags:["React Native"],        salary:"₹9 LPA",
    rounds:[
      { step:1, name:"Aptitude Test",        description:"Logical reasoning and quantitative aptitude" },
      { step:2, name:"Technical Interview",  description:"React Native, mobile architecture" },
      { step:3, name:"HR Interview",         description:"Culture fit and offer discussion" },
    ]},
];

const TYPE_COLORS = { Internship:"#00d4ff", "Full-time":"#a78bfa", "Part-time":"#10b981" };

// ── Skill gap analysis ────────────────────────────────────────────────────────
const getSkillGap = (jobTags, userSkills) => {
  if (!userSkills?.length || !jobTags?.length) return null;
  const normalized = userSkills.map(s => s.toLowerCase().trim());
  const matched = jobTags.filter(tag => normalized.some(s => s.includes(tag.toLowerCase()) || tag.toLowerCase().includes(s)));
  const missing = jobTags.filter(tag => !normalized.some(s => s.includes(tag.toLowerCase()) || tag.toLowerCase().includes(s)));
  return { matched, missing, matchPct: Math.round((matched.length / jobTags.length) * 100) };
};

export default function JobsPage({ user }) {
  const [jobs,     setJobs]     = useState([]);
  const [filter,   setFilter]   = useState("All");
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(true);
  const [applying, setApplying] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [view,     setView]     = useState("all"); // "all" | "saved"

  // Persist applied + saved in localStorage
  const [applied,  setApplied]  = useState(() => {
    try { return JSON.parse(localStorage.getItem("careerdev_applied") || "[]"); } catch { return []; }
  });
  const [saved,    setSaved]    = useState(() => {
    try { return JSON.parse(localStorage.getItem("careerdev_saved") || "[]"); } catch { return []; }
  });

  const [toast, setToast] = useState({ msg:"", type:"" });
  const showToast = (msg, type="success") => { setToast({ msg, type }); setTimeout(()=>setToast({msg:"",type:""}),3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== "All") params.type = filter;
      if (search) params.search = search;
      const data = await Jobs.getAll(params);
      setJobs(data.jobs?.length ? data.jobs : FALLBACK);
    } catch {
      let list = FALLBACK;
      if (filter !== "All") list = list.filter(j => j.type === filter);
      if (search) list = list.filter(j =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase())
      );
      setJobs(list);
    } finally { setLoading(false); }
  }, [filter, search]);

  useEffect(() => { load(); }, [load]);

  // ── Apply ─────────────────────────────────────────────────────────────────
  const apply = async (jobId) => {
    setApplying(jobId);
    try {
      await Jobs.apply(jobId);
      setApplied(prev => {
        const updated = [...prev, jobId];
        localStorage.setItem("careerdev_applied", JSON.stringify(updated));
        return updated;
      });
      showToast("Application submitted! 🎉");
    } catch (err) {
      if (err.message?.toLowerCase().includes("already")) {
        setApplied(prev => {
          const updated = [...prev, jobId];
          localStorage.setItem("careerdev_applied", JSON.stringify(updated));
          return updated;
        });
        showToast("Already applied!", "error");
      } else showToast(err.message, "error");
    } finally { setApplying(null); }
  };

  // ── Bookmark toggle ───────────────────────────────────────────────────────
  const toggleSave = (jobId) => {
    setSaved(prev => {
      const isSaved = prev.includes(jobId);
      const updated = isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId];
      localStorage.setItem("careerdev_saved", JSON.stringify(updated));
      showToast(isSaved ? "Removed from saved jobs" : "Job saved! 🔖", isSaved ? "error" : "success");
      return updated;
    });
  };

  const toggleRounds = (id) => setExpanded(prev => prev === id ? null : id);

  // ── Jobs to display ───────────────────────────────────────────────────────
  const displayJobs = view === "saved" ? jobs.filter(j => saved.includes(j._id)) : jobs;

  return (
    <div style={{ paddingTop:80, minHeight:"100vh", padding:"80px 2rem 3rem", maxWidth:1100, margin:"0 auto" }}>
      <Toast {...toast} />

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.5rem", flexWrap:"wrap", gap:"1rem" }}>
        <div>
          <h1 style={{ fontFamily:"Syne, sans-serif", fontSize:"1.8rem", fontWeight:800, color:"#fff", marginBottom:4 }}>
            💼 Job & Internship Board
          </h1>
          <p style={{ color:"#64748b" }}>Discover opportunities that match your skills</p>
        </div>

        {/* Saved jobs button */}
        <button onClick={() => setView(v => v==="saved"?"all":"saved")} style={{
          padding:"10px 20px", borderRadius:10,
          border:`1px solid ${view==="saved"?"#f59e0b44":"#1e2d45"}`,
          background: view==="saved" ? "#f59e0b11" : "transparent",
          color: view==="saved" ? "#f59e0b" : "#94a3b8",
          cursor:"pointer", fontSize:"0.85rem",
          fontFamily:"DM Sans, sans-serif", fontWeight:600,
          display:"flex", alignItems:"center", gap:6,
        }}>
          🔖 Saved Jobs
          {saved.length > 0 && (
            <span style={{
              background:"#f59e0b", color:"#000",
              padding:"1px 7px", borderRadius:20,
              fontSize:"0.72rem", fontWeight:800,
            }}>{saved.length}</span>
          )}
        </button>
      </div>

      {/* Search + filters — only in all view */}
      {view === "all" && (
        <>
          <input placeholder="🔍  Search by title, company, or skill..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              padding:"12px 16px", borderRadius:"10px", border:"1px solid #1e2d45",
              background:"#0a0f1e", color:"#e2e8f0", fontSize:"0.95rem",
              fontFamily:"DM Sans, sans-serif", outline:"none",
              marginBottom:"1rem", width:"100%", maxWidth:500,
            }}
          />
          <div style={{ display:"flex", gap:"0.8rem", marginBottom:"2rem", flexWrap:"wrap" }}>
            {["All","Internship","Full-time","Part-time"].map(t => (
              <button key={t} onClick={() => setFilter(t)} style={{
                padding:"8px 18px", borderRadius:8, cursor:"pointer",
                border:`1px solid ${filter===t?"#00d4ff":"#1e2d45"}`,
                background: filter===t ? "#00d4ff22" : "transparent",
                color: filter===t ? "#00d4ff" : "#94a3b8",
                fontFamily:"DM Sans, sans-serif", fontSize:"0.9rem",
              }}>{t}</button>
            ))}
          </div>
        </>
      )}

      {/* Saved jobs empty state */}
      {view === "saved" && saved.length === 0 && (
        <div style={{ textAlign:"center", padding:"4rem", background:"#111827", border:"1px solid #1e2d45", borderRadius:16, marginBottom:"2rem" }}>
          <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🔖</div>
          <h3 style={{ fontFamily:"Syne, sans-serif", color:"#fff", marginBottom:8 }}>No saved jobs yet</h3>
          <p style={{ color:"#64748b", marginBottom:"1.5rem" }}>Click the bookmark icon on any job to save it for later!</p>
          <button onClick={() => setView("all")} style={{
            padding:"10px 24px", borderRadius:10, border:"none",
            background:"linear-gradient(135deg,#00d4ff,#7c3aed)",
            color:"#fff", cursor:"pointer", fontFamily:"DM Sans, sans-serif", fontWeight:600,
          }}>Browse Jobs</button>
        </div>
      )}

      {/* Saved view header */}
      {view === "saved" && saved.length > 0 && (
        <div style={{ marginBottom:"1.5rem", color:"#f59e0b", fontSize:"0.85rem", fontWeight:600 }}>
          🔖 {saved.length} saved job{saved.length!==1?"s":""}
          <button onClick={() => setView("all")} style={{
            marginLeft:"1rem", padding:"4px 12px", borderRadius:6,
            border:"1px solid #1e2d45", background:"transparent",
            color:"#94a3b8", cursor:"pointer", fontSize:"0.78rem",
          }}>← Back to all jobs</button>
        </div>
      )}

      {/* Job cards */}
      {loading ? (
        <div style={{ textAlign:"center", padding:"3rem" }}><Spinner /></div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:"1.2rem" }}>
          {displayJobs.map((j, i) => {
            const tc         = TYPE_COLORS[j.type] || "#94a3b8";
            const isExpanded = expanded === (j._id || i);
            const hasRounds  = j.rounds?.length > 0;
            const isApplied  = applied.includes(j._id);
            const isSaved    = saved.includes(j._id);
            const gap        = getSkillGap(j.tags||[], user?.profile?.skills||[]);
            const gapColor   = gap ? (gap.matchPct>=70?"#10b981":gap.matchPct>=40?"#f59e0b":"#ef4444") : null;

            return (
              <div key={j._id||i} style={{
                background:"#111827",
                border:`1px solid ${isSaved?"#f59e0b33":"#1e2d45"}`,
                borderRadius:16, overflow:"hidden", transition:"all .2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=isSaved?"#f59e0b55":"#00d4ff33"; e.currentTarget.style.transform="translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=isSaved?"#f59e0b33":"#1e2d45";   e.currentTarget.style.transform="translateY(0)";    }}
              >
                <div style={{ height:3, background:`linear-gradient(90deg,${tc},${tc}66)` }} />

                <div style={{ padding:"1.5rem" }}>
                  {/* Header */}
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.8rem" }}>
                    <div style={{ flex:1, minWidth:0, marginRight:"0.5rem" }}>
                      <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, color:"#fff", marginBottom:2 }}>{j.title}</div>
                      <div style={{ color:"#64748b", fontSize:"0.85rem" }}>{j.company} · {j.location}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, flexShrink:0 }}>
                      <span style={{ padding:"4px 10px", borderRadius:20, fontSize:"0.75rem", background:tc+"22", color:tc }}>{j.type}</span>
                      {/* Bookmark button */}
                      <button onClick={() => toggleSave(j._id)} title={isSaved?"Remove bookmark":"Save job"} style={{
                        width:28, height:28, borderRadius:6,
                        border:`1px solid ${isSaved?"#f59e0b44":"#1e2d45"}`,
                        background: isSaved ? "#f59e0b22" : "transparent",
                        color: isSaved ? "#f59e0b" : "#64748b",
                        cursor:"pointer", fontSize:"0.9rem",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        transition:"all .2s",
                      }}>
                        {isSaved ? "🔖" : "🏷️"}
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:"1rem" }}>
                    {(j.tags||[]).map((tag, t) => (
                      <span key={t} style={{ padding:"3px 10px", borderRadius:6, fontSize:"0.75rem", background:"#1e2d45", color:"#94a3b8" }}>{tag}</span>
                    ))}
                  </div>

                  {/* Skill Gap */}
                  {gap && (
                    <div style={{ marginBottom:"1rem", padding:"0.8rem", background:gapColor+"08", border:`1px solid ${gapColor}33`, borderRadius:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                        <span style={{ color:"#94a3b8", fontSize:"0.75rem", fontWeight:600 }}>🎯 Skill Match</span>
                        <span style={{ color:gapColor, fontSize:"0.8rem", fontWeight:700 }}>{gap.matchPct}%</span>
                      </div>
                      <div style={{ height:5, background:"#1e2d45", borderRadius:3, marginBottom:8 }}>
                        <div style={{ width:`${gap.matchPct}%`, height:"100%", background:gapColor, borderRadius:3 }} />
                      </div>
                      {gap.matched.length > 0 && (
                        <div style={{ marginBottom:4 }}>
                          <div style={{ color:"#10b981", fontSize:"0.7rem", marginBottom:4 }}>✅ You have:</div>
                          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                            {gap.matched.map((s,i) => <span key={i} style={{ padding:"2px 8px", borderRadius:6, fontSize:"0.7rem", background:"#10b98122", color:"#10b981" }}>{s}</span>)}
                          </div>
                        </div>
                      )}
                      {gap.missing.length > 0 && (
                        <div>
                          <div style={{ color:"#ef4444", fontSize:"0.7rem", marginBottom:4 }}>❌ Missing:</div>
                          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                            {gap.missing.map((s,i) => <span key={i} style={{ padding:"2px 8px", borderRadius:6, fontSize:"0.7rem", background:"#ef444422", color:"#ef4444" }}>{s}</span>)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Salary + Apply */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:hasRounds?"1rem":0 }}>
                    <span style={{ color:"#10b981", fontWeight:600, fontSize:"0.9rem" }}>{j.salary}</span>
                    <button
                      onClick={() => !isApplied && apply(j._id)}
                      disabled={applying===j._id || isApplied}
                      style={{
                        padding:"7px 16px", borderRadius:8,
                        border: isApplied ? "1px solid #10b98144" : "none",
                        background: isApplied ? "#10b98122" : applying===j._id ? "#1e2d45" : "linear-gradient(135deg,#00d4ff,#7c3aed)",
                        color: isApplied ? "#10b981" : "#fff",
                        fontSize:"0.8rem",
                        cursor: isApplied||applying===j._id ? "not-allowed" : "pointer",
                        fontFamily:"DM Sans, sans-serif", fontWeight:600,
                        display:"flex", alignItems:"center", gap:6,
                      }}>
                      {applying===j._id ? <><Spinner /> Applying...</> : isApplied ? "✅ Applied" : "Apply Now"}
                    </button>
                  </div>

                  {/* Interview Process */}
                  {hasRounds && (
                    <>
                      <button onClick={() => toggleRounds(j._id||i)} style={{
                        width:"100%", padding:"8px", borderRadius:8,
                        border:"1px solid #1e2d45", background:"transparent",
                        color:"#94a3b8", cursor:"pointer", fontSize:"0.82rem",
                        fontFamily:"DM Sans, sans-serif",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                        transition:"all .2s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor="#00d4ff44"; e.currentTarget.style.color="#00d4ff"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor="#1e2d45";   e.currentTarget.style.color="#94a3b8"; }}
                      >
                        🎯 Interview Process {isExpanded?"▲":"▼"}
                      </button>

                      {isExpanded && (
                        <div style={{ marginTop:"1rem", padding:"1rem", background:"#0d1424", border:"1px solid #1e2d4588", borderRadius:12 }}>
                          <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, color:"#fff", fontSize:"0.85rem", marginBottom:"0.8rem" }}>
                            📋 Interview Rounds — {j.company}
                          </div>
                          <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
                            {j.rounds.map((r, ri) => (
                              <div key={ri} style={{ display:"flex", gap:"0.8rem", alignItems:"flex-start" }}>
                                <div style={{
                                  flexShrink:0, width:26, height:26, borderRadius:"50%",
                                  background:tc+"22", border:`1px solid ${tc}55`,
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  fontSize:"0.72rem", fontWeight:700, color:tc,
                                }}>{r.step||ri+1}</div>
                                <div style={{ flex:1 }}>
                                  <div style={{ color:"#e2e8f0", fontSize:"0.82rem", fontWeight:600, marginBottom:2 }}>{r.name}</div>
                                  <div style={{ color:"#64748b", fontSize:"0.76rem", lineHeight:1.4 }}>{r.description}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop:"0.8rem", padding:"0.6rem 0.8rem", borderRadius:8, background:"#00d4ff0a", border:"1px solid #00d4ff22", color:"#64748b", fontSize:"0.75rem" }}>
                            💡 Prepare thoroughly for each round. Most companies shortlist based on technical performance.
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}