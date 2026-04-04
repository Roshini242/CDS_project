import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import Toast from "../../components/Toast";
import Spinner from "../../components/Spinner";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast,    setToast]    = useState({ msg:"", type:"" });

  const showToast = (msg, type="success") => { setToast({ msg, type }); setTimeout(()=>setToast({msg:"",type:""}),3000); };

  const FALLBACK = [
    { _id:"1", name:"Arjun Kumar",  email:"arjun@mail.com",  careerPath:"webdev",      profileCompletion:80, profile:{ skills:["React","Node.js"], education:"B.E CSE" }, assessmentScores:[], appliedJobs:[] },
    { _id:"2", name:"Priya Sharma", email:"priya@mail.com",  careerPath:"datascience", profileCompletion:65, profile:{ skills:["Python","SQL"],    education:"B.Sc IT"  }, assessmentScores:[], appliedJobs:[] },
    { _id:"3", name:"Rahul Singh",  email:"rahul@mail.com",  careerPath:"uiux",        profileCompletion:40, profile:{ skills:["Figma"],           education:"B.Des"    }, assessmentScores:[], appliedJobs:[] },
    { _id:"4", name:"Sneha Patel",  email:"sneha@mail.com",  careerPath:"webdev",      profileCompletion:90, profile:{ skills:["React","CSS"],     education:"MCA"      }, assessmentScores:[{topic:"React",score:3,total:3}], appliedJobs:[{},{}] },
    { _id:"5", name:"Vikram Nair",  email:"vikram@mail.com", careerPath:"",            profileCompletion:20, profile:{ skills:[],                  education:""         }, assessmentScores:[], appliedJobs:[] },
  ];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = search ? `?search=${search}` : "";
      const d = await api(`/admin/students${params}`);
      setStudents(d.students || []);
    } catch {
      let list = FALLBACK;
      if (search) list = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));
      setStudents(list);
    } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const remove = async (id) => {
    if (!window.confirm("Remove this student?")) return;
    try { await api(`/admin/students/${id}`, { method:"DELETE" }); showToast("Student removed."); load(); }
    catch (err) { showToast(err.message, "error"); }
  };

  const pathLabel = {
    webdev:"Web Developer", datascience:"Data Scientist", uiux:"UI/UX Designer",
    mobile:"Mobile Developer", cybersecurity:"Cybersecurity Analyst", cloud:"Cloud Engineer",
    ai:"AI Engineer", devops:"DevOps Engineer", blockchain:"Blockchain Developer", gamedev:"Game Developer",
  };
  const pathColor = {
    webdev:"#00d4ff", datascience:"#10b981", uiux:"#7c3aed",
    mobile:"#f59e0b", cybersecurity:"#ef4444", cloud:"#38bdf8",
    ai:"#ec4899", devops:"#84cc16", blockchain:"#a78bfa", gamedev:"#f97316",
  };
  const inp = { padding:"10px 14px", borderRadius:8, border:"1px solid #1e2d45", background:"#0a0f1e", color:"#e2e8f0", fontSize:"0.9rem", fontFamily:"DM Sans, sans-serif", outline:"none" };

  return (
    <div>
      <Toast {...toast} />
      <div style={{ marginBottom:"2rem" }}>
        <h1 style={{ fontFamily:"Syne, sans-serif", fontSize:"1.8rem", fontWeight:800, color:"#fff" }}>🎓 Manage Students</h1>
        <p style={{ color:"#64748b", marginTop:4 }}>View and manage all registered students</p>
      </div>

      <input placeholder="🔍  Search by name or email..." value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ ...inp, width:"100%", maxWidth:400, marginBottom:"1.5rem" }} />

      {loading ? <div style={{ textAlign:"center", padding:"3rem" }}><Spinner /></div> : (
        <div style={{ background:"#111827", border:"1px solid #1e2d45", borderRadius:16, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#0d1424" }}>
                {["Student","Career Path","Skills","Profile","Applied","Action"].map((h,i) => (
                  <th key={i} style={{ padding:"12px 16px", textAlign:"left", color:"#64748b", fontSize:"0.78rem", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", borderBottom:"1px solid #1e2d45" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s._id||i} style={{ borderBottom:"1px solid #1e2d4533", transition:"background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background="#ffffff05"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}
                >
                  <td style={{ padding:"14px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{
                        width:36, height:36, borderRadius:"50%",
                        background:"linear-gradient(135deg,#00d4ff,#7c3aed)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontWeight:700, fontSize:"0.85rem", color:"#fff", flexShrink:0,
                      }}>{s.name?.[0]?.toUpperCase()}</div>
                      <div>
                        <div style={{ color:"#e2e8f0", fontWeight:500, fontSize:"0.9rem" }}>{s.name}</div>
                        <div style={{ color:"#64748b", fontSize:"0.78rem" }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:"14px 16px" }}>
                    {s.careerPath ? (
                      <span style={{ padding:"3px 10px", borderRadius:20, fontSize:"0.75rem", background:(pathColor[s.careerPath]||"#94a3b8")+"22", color:pathColor[s.careerPath]||"#94a3b8" }}>
                        {pathLabel[s.careerPath]||s.careerPath}
                      </span>
                    ) : <span style={{ color:"#64748b", fontSize:"0.8rem" }}>—</span>}
                  </td>
                  <td style={{ padding:"14px 16px" }}>
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                      {(s.profile?.skills||[]).slice(0,3).map((sk,j) => (
                        <span key={j} style={{ padding:"2px 8px", borderRadius:6, fontSize:"0.72rem", background:"#1e2d45", color:"#94a3b8" }}>{sk}</span>
                      ))}
                      {(s.profile?.skills||[]).length > 3 && <span style={{ color:"#64748b", fontSize:"0.72rem" }}>+{s.profile.skills.length-3}</span>}
                      {(s.profile?.skills||[]).length === 0 && <span style={{ color:"#64748b", fontSize:"0.78rem" }}>No skills</span>}
                    </div>
                  </td>
                  <td style={{ padding:"14px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:60, height:5, background:"#1e2d45", borderRadius:3 }}>
                        <div style={{ width:`${s.profileCompletion||0}%`, height:"100%", background: s.profileCompletion>=70?"#10b981":s.profileCompletion>=40?"#f59e0b":"#ef4444", borderRadius:3 }} />
                      </div>
                      <span style={{ color:"#94a3b8", fontSize:"0.78rem" }}>{s.profileCompletion||0}%</span>
                    </div>
                  </td>
                  <td style={{ padding:"14px 16px", color:"#a78bfa", fontWeight:600, fontSize:"0.9rem" }}>{s.appliedJobs?.length||0}</td>
                  <td style={{ padding:"14px 16px" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={() => setSelected(s)} style={{ padding:"5px 12px", borderRadius:6, border:"1px solid #1e2d45", background:"transparent", color:"#94a3b8", cursor:"pointer", fontSize:"0.75rem" }}>View</button>
                      <button onClick={() => remove(s._id)} style={{ padding:"5px 12px", borderRadius:6, border:"1px solid #ef444444", background:"#ef444411", color:"#ef4444", cursor:"pointer", fontSize:"0.75rem" }}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <div style={{ textAlign:"center", padding:"3rem", color:"#64748b" }}>No students found.</div>
          )}
        </div>
      )}

      {/* Student Detail Modal */}
      {selected && (
        <div style={{ position:"fixed", inset:0, background:"#00000088", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}
          onClick={e => e.target===e.currentTarget && setSelected(null)}>
          <div style={{ background:"#111827", border:"1px solid #1e2d45", borderRadius:20, padding:"2rem", width:"100%", maxWidth:480 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:"1.5rem" }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#00d4ff,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"1.2rem", color:"#fff" }}>{selected.name?.[0]?.toUpperCase()}</div>
              <div>
                <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, color:"#fff", fontSize:"1.1rem" }}>{selected.name}</div>
                <div style={{ color:"#64748b", fontSize:"0.85rem" }}>{selected.email}</div>
              </div>
            </div>
            {[
              { label:"Education",    value: selected.profile?.education || "—"               },
              { label:"Location",     value: selected.profile?.location  || "—"               },
              { label:"Career Path",  value: pathLabel[selected.careerPath] || "Not selected"  },
              { label:"Profile",      value: `${selected.profileCompletion||0}% complete`      },
              { label:"Jobs Applied", value: `${selected.appliedJobs?.length||0} applications` },
              { label:"Quizzes Taken",value: `${selected.assessmentScores?.length||0} quizzes` },
            ].map((r,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #1e2d4533" }}>
                <span style={{ color:"#64748b", fontSize:"0.85rem" }}>{r.label}</span>
                <span style={{ color:"#e2e8f0", fontSize:"0.85rem", fontWeight:500 }}>{r.value}</span>
              </div>
            ))}
            {(selected.profile?.skills||[]).length > 0 && (
              <div style={{ marginTop:"1rem" }}>
                <div style={{ color:"#64748b", fontSize:"0.8rem", marginBottom:8 }}>Skills</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {selected.profile.skills.map((sk,i) => (
                    <span key={i} style={{ padding:"4px 10px", borderRadius:8, fontSize:"0.8rem", background:"#1e2d45", color:"#94a3b8" }}>{sk}</span>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setSelected(null)} style={{ marginTop:"1.5rem", width:"100%", padding:"11px", borderRadius:10, border:"1px solid #1e2d45", background:"transparent", color:"#94a3b8", cursor:"pointer", fontFamily:"DM Sans, sans-serif" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}