import { useState, useEffect, useCallback } from "react";
import { Jobs } from "../services/api";
import Toast from "../components/Toast";
import Spinner from "../components/Spinner";

const FALLBACK = [
  { _id:"1", title:"Frontend Developer Intern", company:"TechCorp",  type:"Internship", location:"Remote",    tags:["React","CSS"],        salary:"₹15,000/mo", rounds:[{step:1,name:"Online Aptitude Test",description:"Quantitative aptitude and logical reasoning"},{step:2,name:"Technical Interview",description:"React, HTML/CSS, JavaScript concepts"},{step:3,name:"HR Interview",description:"Culture fit and offer discussion"}]},
  { _id:"2", title:"Data Analyst",              company:"DataWorks",  type:"Full-time",  location:"Chennai",   tags:["Python","SQL"],        salary:"₹6 LPA",     rounds:[{step:1,name:"Online Test",description:"Aptitude, reasoning and basic coding"},{step:2,name:"Technical Interview",description:"Python, SQL, data analysis concepts"},{step:3,name:"HR Interview",description:"Salary negotiation and final offer"}]},
  { _id:"3", title:"UI/UX Designer",            company:"DesignHub",  type:"Part-time",  location:"Bangalore", tags:["Figma","XD"],          salary:"₹20,000/mo", rounds:[{step:1,name:"Portfolio Review",description:"Review of past design work and case studies"},{step:2,name:"Design Challenge",description:"Live design task using Figma"},{step:3,name:"HR Interview",description:"Role expectations and offer"}]},
  { _id:"4", title:"Backend Developer",         company:"CloudSoft",  type:"Full-time",  location:"Hybrid",    tags:["Node.js","MongoDB"],   salary:"₹8 LPA",     rounds:[{step:1,name:"Coding Test",description:"DSA problems and algorithm challenges"},{step:2,name:"Technical Interview",description:"Node.js, MongoDB, system design"},{step:3,name:"HR Interview",description:"Compensation and joining formalities"}]},
  { _id:"5", title:"ML Engineer Intern",        company:"AILabs",     type:"Internship", location:"Remote",    tags:["Python","TensorFlow"], salary:"₹12,000/mo", rounds:[{step:1,name:"Online Assessment",description:"Python, ML theory and aptitude"},{step:2,name:"Technical Interview",description:"ML concepts, model building discussion"},{step:3,name:"HR Interview",description:"Internship terms and final selection"}]},
  { _id:"6", title:"Mobile Developer",          company:"AppWorks",   type:"Full-time",  location:"Mumbai",    tags:["React Native"],        salary:"₹9 LPA",     rounds:[{step:1,name:"Aptitude Test",description:"Logical reasoning and quantitative aptitude"},{step:2,name:"Technical Interview",description:"React Native, mobile architecture"},{step:3,name:"HR Interview",description:"Culture fit and offer discussion"}]},
];

const TYPE_COLORS  = { Internship:"#2563eb", "Full-time":"#7c3aed", "Part-time":"#059669" };
const TYPE_BG      = { Internship:"#eff6ff", "Full-time":"#f5f3ff", "Part-time":"#ecfdf5" };
const TYPE_BORDER  = { Internship:"#bfdbfe", "Full-time":"#ddd6fe", "Part-time":"#a7f3d0" };

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
  const [view,     setView]     = useState("all");

  const storageIdentity = encodeURIComponent(user?.email || user?.name || "guest");
  const appliedStorageKey = `careerdev_applied_${storageIdentity}`;
  const savedStorageKey   = `careerdev_saved_${storageIdentity}`;

  const readStorage = (key) => {
    try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
  };

  const [applied, setApplied] = useState(() => readStorage(appliedStorageKey));
  const [saved, setSaved] = useState(() => readStorage(savedStorageKey));

  useEffect(() => {
    setApplied(readStorage(appliedStorageKey));
    setSaved(readStorage(savedStorageKey));
  }, [appliedStorageKey, savedStorageKey]);

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

  const apply = async (jobId) => {
    setApplying(jobId);
    try {
      await Jobs.apply(jobId);
      setApplied(prev => { const u = [...prev, jobId]; localStorage.setItem(appliedStorageKey, JSON.stringify(u)); return u; });
      showToast("Application submitted! 🎉");
    } catch (err) {
      if (err.message?.toLowerCase().includes("already")) {
        setApplied(prev => { const u = [...prev, jobId]; localStorage.setItem(appliedStorageKey, JSON.stringify(u)); return u; });
        showToast("Already applied!", "error");
      } else showToast(err.message, "error");
    } finally { setApplying(null); }
  };

  const toggleSave = (jobId) => {
    setSaved(prev => {
      const isSaved = prev.includes(jobId);
      const updated = isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId];
      localStorage.setItem(savedStorageKey, JSON.stringify(updated));
      showToast(isSaved ? "Removed from saved jobs" : "Job saved! 🔖", isSaved ? "error" : "success");
      return updated;
    });
  };

  const toggleRounds = (id) => setExpanded(prev => prev === id ? null : id);
  const displayJobs = view === "saved" ? jobs.filter(j => saved.includes(j._id)) : jobs;

  return (
    <div className="page-container" style={{ paddingTop: 100, minHeight: "100vh" }}>
      <Toast {...toast} />

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.5rem", flexWrap:"wrap", gap:"1rem" }}>
        <div>
          <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:"1.75rem", fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em" }}>
            💼 Job & Internship Board
          </h1>
          <p style={{ color:"#64748b", marginTop:4, fontSize:"0.9rem" }}>Discover opportunities that match your skills</p>
        </div>
        <button onClick={() => setView(v => v==="saved"?"all":"saved")} style={{
          padding:"9px 18px", borderRadius:8,
          border:`1px solid ${view==="saved" ? "#d97706" : "#e2e8f0"}`,
          background: view==="saved" ? "#fffbeb" : "#ffffff",
          color: view==="saved" ? "#d97706" : "#64748b",
          cursor:"pointer", fontSize:"0.85rem",
          fontFamily:"'DM Sans', sans-serif", fontWeight:600,
          display:"flex", alignItems:"center", gap:6,
          boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
        }}>
          🔖 Saved Jobs
          {saved.length > 0 && (
            <span style={{ background:"#d97706", color:"#fff", padding:"1px 7px", borderRadius:20, fontSize:"0.7rem", fontWeight:700 }}>
              {saved.length}
            </span>
          )}
        </button>
      </div>

      {/* Search + Filters */}
      {view === "all" && (
        <>
          <div style={{ position:"relative", maxWidth:480, marginBottom:"1rem" }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", fontSize:"0.9rem" }}>🔍</span>
            <input
              placeholder="Search by title, company, or skill..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                padding:"10px 14px 10px 36px", borderRadius:8,
                border:"1px solid #e2e8f0", background:"#ffffff",
                color:"#0f172a", fontSize:"0.9rem",
                fontFamily:"'DM Sans', sans-serif", outline:"none",
                width:"100%", boxSizing:"border-box",
                boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
                transition:"border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor="#2563eb"}
              onBlur={e => e.target.style.borderColor="#e2e8f0"}
            />
          </div>
          <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
            {["All","Internship","Full-time","Part-time"].map(t => (
              <button key={t} onClick={() => setFilter(t)} style={{
                padding:"7px 16px", borderRadius:7, cursor:"pointer",
                border:`1px solid ${filter===t ? "#2563eb" : "#e2e8f0"}`,
                background: filter===t ? "#eff6ff" : "#ffffff",
                color: filter===t ? "#2563eb" : "#64748b",
                fontFamily:"'DM Sans', sans-serif", fontSize:"0.85rem", fontWeight:500,
                transition:"all 0.2s",
              }}>{t}</button>
            ))}
          </div>
        </>
      )}

      {/* Saved empty state */}
      {view === "saved" && saved.length === 0 && (
        <div style={{ textAlign:"center", padding:"4rem", background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:14, marginBottom:"1.5rem", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize:"2.5rem", marginBottom:"1rem" }}>🔖</div>
          <h3 style={{ fontFamily:"'Syne', sans-serif", color:"#0f172a", marginBottom:8 }}>No saved jobs yet</h3>
          <p style={{ color:"#64748b", marginBottom:"1.5rem", fontSize:"0.9rem" }}>Click the bookmark icon on any job to save it for later!</p>
          <button onClick={() => setView("all")} style={{
            padding:"9px 22px", borderRadius:8, border:"none",
            background:"#2563eb", color:"#fff", cursor:"pointer",
            fontFamily:"'DM Sans', sans-serif", fontWeight:600,
            boxShadow:"0 2px 8px #2563eb33",
          }}>Browse Jobs</button>
        </div>
      )}

      {view === "saved" && saved.length > 0 && (
        <div style={{ marginBottom:"1rem", display:"flex", alignItems:"center", gap:"0.8rem" }}>
          <span style={{ color:"#d97706", fontSize:"0.85rem", fontWeight:600 }}>🔖 {saved.length} saved job{saved.length!==1?"s":""}</span>
          <button onClick={() => setView("all")} style={{
            padding:"4px 12px", borderRadius:6, border:"1px solid #e2e8f0",
            background:"#ffffff", color:"#64748b", cursor:"pointer", fontSize:"0.78rem",
          }}>← Back to all jobs</button>
        </div>
      )}

      {/* Job Cards */}
      {loading ? (
        <div style={{ textAlign:"center", padding:"3rem" }}><Spinner /></div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:"1rem" }}>
          {displayJobs.map((j, i) => {
            const tc        = TYPE_COLORS[j.type] || "#2563eb";
            const tbg       = TYPE_BG[j.type]     || "#eff6ff";
            const tborder   = TYPE_BORDER[j.type]  || "#bfdbfe";
            const isExpanded = expanded === (j._id || i);
            const hasRounds  = j.rounds?.length > 0;
            const applicationInfo = user?.appliedJobs?.find(a => a.job?.toString() === j._id);
            const isApplied  = Boolean(applicationInfo || applied.includes(j._id));
            const applicationStatus = applicationInfo?.status || (isApplied ? "applied" : null);
            const statusLabel = applicationStatus ? `${applicationStatus.charAt(0).toUpperCase()}${applicationStatus.slice(1)}` : null;
            const isSaved    = saved.includes(j._id);
            const gap        = getSkillGap(j.tags||[], user?.profile?.skills||[]);
            const gapColor   = gap ? (gap.matchPct>=70?"#059669":gap.matchPct>=40?"#d97706":"#dc2626") : null;
            const gapBg      = gap ? (gap.matchPct>=70?"#ecfdf5":gap.matchPct>=40?"#fffbeb":"#fef2f2") : null;

            return (
              <div key={j._id||i} style={{
                background:"#ffffff",
                border:`1px solid ${isSaved ? "#fde68a" : "#e2e8f0"}`,
                borderRadius:12, overflow:"hidden", transition:"all .2s",
                boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=isSaved?"#fcd34d":"#bfdbfe"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(37,99,235,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=isSaved?"#fde68a":"#e2e8f0"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.04)"; }}
              >
                {/* Color stripe */}
                <div style={{ height:3, background:tc }} />

                <div style={{ padding:"1.3rem" }}>
                  {/* Header */}
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.8rem" }}>
                    <div style={{ flex:1, minWidth:0, marginRight:"0.5rem" }}>
                      <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, color:"#0f172a", marginBottom:2, fontSize:"0.95rem" }}>{j.title}</div>
                      <div style={{ color:"#64748b", fontSize:"0.82rem" }}>{j.company} · {j.location}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5, flexShrink:0 }}>
                      <span style={{ padding:"3px 10px", borderRadius:20, fontSize:"0.72rem", fontWeight:600, background:tbg, color:tc, border:`1px solid ${tborder}` }}>{j.type}</span>
                      <button onClick={() => toggleSave(j._id)} style={{
                        width:28, height:28, borderRadius:6,
                        border:`1px solid ${isSaved?"#fde68a":"#e2e8f0"}`,
                        background: isSaved ? "#fffbeb" : "#f8fafc",
                        color: isSaved ? "#d97706" : "#94a3b8",
                        cursor:"pointer", fontSize:"0.85rem",
                        display:"flex", alignItems:"center", justifyContent:"center",
                      }}>{isSaved ? "🔖" : "🏷️"}</button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:"0.9rem" }}>
                    {(j.tags||[]).map((tag,t) => (
                      <span key={t} style={{ padding:"2px 9px", borderRadius:6, fontSize:"0.72rem", background:"#f1f5f9", color:"#64748b", border:"1px solid #e2e8f0" }}>{tag}</span>
                    ))}
                  </div>

                  {/* Skill Gap */}
                  {gap && (
                    <div style={{ marginBottom:"0.9rem", padding:"0.75rem", background:gapBg, border:`1px solid ${gapColor}33`, borderRadius:8 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                        <span style={{ color:"#64748b", fontSize:"0.72rem", fontWeight:600 }}>🎯 Skill Match</span>
                        <span style={{ color:gapColor, fontSize:"0.78rem", fontWeight:700 }}>{gap.matchPct}%</span>
                      </div>
                      <div style={{ height:4, background:"#e2e8f0", borderRadius:2, marginBottom:7 }}>
                        <div style={{ width:`${gap.matchPct}%`, height:"100%", background:gapColor, borderRadius:2 }} />
                      </div>
                      {gap.matched.length > 0 && (
                        <div style={{ marginBottom:4 }}>
                          <div style={{ color:"#059669", fontSize:"0.68rem", marginBottom:3 }}>✅ You have:</div>
                          <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                            {gap.matched.map((s,i)=><span key={i} style={{ padding:"1px 7px", borderRadius:4, fontSize:"0.68rem", background:"#dcfce7", color:"#059669", border:"1px solid #a7f3d0" }}>{s}</span>)}
                          </div>
                        </div>
                      )}
                      {gap.missing.length > 0 && (
                        <div>
                          <div style={{ color:"#dc2626", fontSize:"0.68rem", marginBottom:3 }}>❌ Missing:</div>
                          <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                            {gap.missing.map((s,i)=><span key={i} style={{ padding:"1px 7px", borderRadius:4, fontSize:"0.68rem", background:"#fee2e2", color:"#dc2626", border:"1px solid #fecaca" }}>{s}</span>)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Salary + Apply */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:hasRounds?"0.9rem":0, flexWrap:"wrap", gap:"0.75rem" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                      <span style={{ color:"#059669", fontWeight:700, fontSize:"0.9rem" }}>{j.salary}</span>
                      {statusLabel && (
                        <span style={{
                          padding:"6px 12px", borderRadius:999,
                          background: applicationStatus === "shortlisted" ? "#ecfdf5" : applicationStatus === "rejected" ? "#fee2e2" : applicationStatus === "reviewed" ? "#eff6ff" : "#f8fafc",
                          color: applicationStatus === "shortlisted" ? "#059669" : applicationStatus === "rejected" ? "#b91c1c" : applicationStatus === "reviewed" ? "#2563eb" : "#475569",
                          border: applicationStatus === "pending" ? "1px solid #e2e8f0" : "1px solid transparent",
                          fontSize:"0.78rem", fontWeight:700,
                          textTransform:"capitalize"
                        }}>{statusLabel}</span>
                      )}
                    </div>
                    <button
                      onClick={() => !isApplied && apply(j._id)}
                      disabled={applying===j._id || isApplied}
                      style={{
                        padding:"7px 14px", borderRadius:7,
                        border: isApplied ? "1px solid #a7f3d0" : "none",
                        background: isApplied ? "#ecfdf5" : applying===j._id ? "#e2e8f0" : "#2563eb",
                        color: isApplied ? "#059669" : applying===j._id ? "#94a3b8" : "#fff",
                        fontSize:"0.8rem", cursor:isApplied||applying===j._id?"not-allowed":"pointer",
                        fontFamily:"'DM Sans', sans-serif", fontWeight:600,
                        display:"flex", alignItems:"center", gap:5,
                        boxShadow: isApplied||applying===j._id ? "none" : "0 2px 6px #2563eb33",
                      }}>
                      {applying===j._id ? <><Spinner /> Applying...</> : isApplied ? "✅ Applied" : "Apply Now"}
                    </button>
                  </div>

                  {/* Interview Process */}
                  {hasRounds && (
                    <>
                      <button onClick={() => toggleRounds(j._id||i)} style={{
                        width:"100%", padding:"7px", borderRadius:7,
                        border:"1px solid #e2e8f0", background:"#f8fafc",
                        color:"#64748b", cursor:"pointer", fontSize:"0.8rem",
                        fontFamily:"'DM Sans', sans-serif",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:5,
                        transition:"all .2s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor="#bfdbfe"; e.currentTarget.style.color="#2563eb"; e.currentTarget.style.background="#eff6ff"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.color="#64748b"; e.currentTarget.style.background="#f8fafc"; }}
                      >
                        🎯 Interview Process {isExpanded?"▲":"▼"}
                      </button>

                      {isExpanded && (
                        <div style={{ marginTop:"0.9rem", padding:"1rem", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10 }}>
                          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, color:"#0f172a", fontSize:"0.85rem", marginBottom:"0.7rem" }}>
                            📋 Interview Rounds — {j.company}
                          </div>
                          <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                            {j.rounds.map((r, ri) => (
                              <div key={ri} style={{ display:"flex", gap:"0.7rem", alignItems:"flex-start" }}>
                                <div style={{
                                  flexShrink:0, width:24, height:24, borderRadius:"50%",
                                  background:tbg, border:`1px solid ${tborder}`,
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  fontSize:"0.7rem", fontWeight:700, color:tc,
                                }}>{r.step||ri+1}</div>
                                <div style={{ flex:1 }}>
                                  <div style={{ color:"#0f172a", fontSize:"0.8rem", fontWeight:600, marginBottom:1 }}>{r.name}</div>
                                  <div style={{ color:"#64748b", fontSize:"0.74rem", lineHeight:1.4 }}>{r.description}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop:"0.7rem", padding:"0.6rem 0.8rem", borderRadius:7, background:"#eff6ff", border:"1px solid #bfdbfe", color:"#475569", fontSize:"0.72rem" }}>
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