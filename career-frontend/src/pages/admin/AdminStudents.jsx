import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import Toast from "../../components/Toast";
import Spinner from "../../components/Spinner";

const FALLBACK = [
  { _id:"1", name:"Arjun Kumar",  email:"arjun@mail.com",  careerPath:"webdev",      profileCompletion:80, profile:{ skills:["React","Node.js"], education:"B.E CSE" }, assessmentScores:[], appliedJobs:[] },
  { _id:"2", name:"Priya Sharma", email:"priya@mail.com",  careerPath:"datascience", profileCompletion:65, profile:{ skills:["Python","SQL"],    education:"B.Sc IT"  }, assessmentScores:[], appliedJobs:[] },
  { _id:"3", name:"Rahul Singh",  email:"rahul@mail.com",  careerPath:"uiux",        profileCompletion:40, profile:{ skills:["Figma"],           education:"B.Des"    }, assessmentScores:[], appliedJobs:[] },
  { _id:"4", name:"Sneha Patel",  email:"sneha@mail.com",  careerPath:"webdev",      profileCompletion:90, profile:{ skills:["React","CSS"],     education:"MCA"      }, assessmentScores:[{topic:"React",score:3,total:3}], appliedJobs:[{},{}] },
  { _id:"5", name:"Vikram Nair",  email:"vikram@mail.com", careerPath:"",            profileCompletion:20, profile:{ skills:[],                  education:""         }, assessmentScores:[], appliedJobs:[] },
];

const pathLabel = { webdev:"Web Developer", datascience:"Data Scientist", uiux:"UI/UX Designer", mobile:"Mobile Developer", cybersecurity:"Cybersecurity Analyst", cloud:"Cloud Engineer", ai:"AI Engineer", devops:"DevOps Engineer", blockchain:"Blockchain Developer", gamedev:"Game Developer" };
const pathColor = { webdev:"#2563eb", datascience:"#059669", uiux:"#7c3aed", mobile:"#d97706", cybersecurity:"#dc2626", cloud:"#0891b2", ai:"#db2777", devops:"#65a30d", blockchain:"#7c3aed", gamedev:"#ea580c" };
const pathBg    = { webdev:"#eff6ff", datascience:"#ecfdf5", uiux:"#f5f3ff", mobile:"#fffbeb", cybersecurity:"#fef2f2", cloud:"#ecfeff", ai:"#fdf2f8", devops:"#f7fee7", blockchain:"#f5f3ff", gamedev:"#fff7ed" };

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast,    setToast]    = useState({ msg:"", type:"" });

  const showToast = (msg, type="success") => { setToast({ msg, type }); setTimeout(() => setToast({ msg:"", type:"" }), 3000); };

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

  return (
    <div>
      <Toast {...toast} />
      <div style={{ marginBottom:"1.8rem" }}>
        <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:"1.75rem", fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em" }}>🎓 Manage Students</h1>
        <p style={{ color:"#64748b", marginTop:4, fontSize:"0.9rem" }}>View and manage all registered students</p>
      </div>

      <div style={{ position:"relative", maxWidth:360, marginBottom:"1.4rem" }}>
        <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", fontSize:"0.88rem" }}>🔍</span>
        <input
          placeholder="Search by name or email..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            padding:"9px 13px 9px 34px", borderRadius:8, border:"1px solid #e2e8f0",
            background:"#ffffff", color:"#0f172a", fontSize:"0.875rem",
            fontFamily:"'DM Sans', sans-serif", outline:"none", width:"100%",
            boxSizing:"border-box", boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
          }}
          onFocus={e => { e.target.style.borderColor="#7c3aed"; e.target.style.boxShadow="0 0 0 3px #7c3aed18"; }}
          onBlur={e  => { e.target.style.borderColor="#e2e8f0"; e.target.style.boxShadow="0 1px 3px rgba(0,0,0,0.04)"; }}
        />
      </div>

      {loading ? <div style={{ textAlign:"center", padding:"3rem" }}><Spinner /></div> : (
        <div style={{ background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:12, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
                {["Student","Career Path","Skills","Profile","Applied","Action"].map((h,i) => (
                  <th key={i} style={{ padding:"11px 14px", textAlign:"left", color:"#64748b", fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s._id||i}
                  style={{ borderBottom:"1px solid #f1f5f9", transition:"background .12s" }}
                  onMouseEnter={e => e.currentTarget.style.background="#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}
                >
                  <td style={{ padding:"12px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                      <div style={{ width:34, height:34, borderRadius:"50%", background:"#7c3aed", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"0.82rem", color:"#fff", flexShrink:0 }}>
                        {s.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ color:"#0f172a", fontWeight:600, fontSize:"0.875rem" }}>{s.name}</div>
                        <div style={{ color:"#94a3b8", fontSize:"0.75rem" }}>{s.email}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding:"12px 14px" }}>
                    {s.careerPath ? (
                      <span style={{ padding:"2px 9px", borderRadius:20, fontSize:"0.72rem", fontWeight:600, background:pathBg[s.careerPath]||"#f1f5f9", color:pathColor[s.careerPath]||"#64748b", border:`1px solid ${pathColor[s.careerPath]||"#e2e8f0"}22` }}>
                        {pathLabel[s.careerPath]||s.careerPath}
                      </span>
                    ) : <span style={{ color:"#94a3b8", fontSize:"0.8rem" }}>—</span>}
                  </td>

                  <td style={{ padding:"12px 14px" }}>
                    <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                      {(s.profile?.skills||[]).slice(0,3).map((sk,j) => (
                        <span key={j} style={{ padding:"1px 7px", borderRadius:5, fontSize:"0.7rem", background:"#f1f5f9", color:"#64748b", border:"1px solid #e2e8f0" }}>{sk}</span>
                      ))}
                      {(s.profile?.skills||[]).length > 3 && <span style={{ color:"#94a3b8", fontSize:"0.7rem" }}>+{s.profile.skills.length-3}</span>}
                      {(s.profile?.skills||[]).length === 0 && <span style={{ color:"#94a3b8", fontSize:"0.76rem" }}>No skills</span>}
                    </div>
                  </td>

                  <td style={{ padding:"12px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <div style={{ width:52, height:4, background:"#e2e8f0", borderRadius:2 }}>
                        <div style={{ width:`${s.profileCompletion||0}%`, height:"100%", borderRadius:2, background:s.profileCompletion>=70?"#059669":s.profileCompletion>=40?"#d97706":"#dc2626" }} />
                      </div>
                      <span style={{ color:"#64748b", fontSize:"0.75rem" }}>{s.profileCompletion||0}%</span>
                    </div>
                  </td>

                  <td style={{ padding:"12px 14px", color:"#7c3aed", fontWeight:700, fontSize:"0.9rem" }}>
                    {s.appliedJobs?.length||0}
                  </td>

                  <td style={{ padding:"12px 14px" }}>
                    <div style={{ display:"flex", gap:5 }}>
                      <button onClick={() => setSelected(s)} style={{ padding:"4px 11px", borderRadius:6, border:"1px solid #e2e8f0", background:"#f8fafc", color:"#475569", cursor:"pointer", fontSize:"0.74rem", fontWeight:500 }}>View</button>
                      <button onClick={() => remove(s._id)} style={{ padding:"4px 11px", borderRadius:6, border:"1px solid #fecaca", background:"#fff5f5", color:"#dc2626", cursor:"pointer", fontSize:"0.74rem", fontWeight:500 }}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <div style={{ textAlign:"center", padding:"3rem", color:"#94a3b8", fontSize:"0.9rem" }}>No students found.</div>
          )}
        </div>
      )}

      {/* Student Detail Modal */}
      {selected && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}
          onClick={e => e.target===e.currentTarget && setSelected(null)}>
          <div style={{ background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:16, padding:"2rem", width:"100%", maxWidth:460, boxShadow:"0 20px 60px rgba(0,0,0,0.12)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:"1.5rem" }}>
              <div style={{ width:48, height:48, borderRadius:"50%", background:"#7c3aed", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"1.1rem", color:"#fff" }}>
                {selected.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, color:"#0f172a", fontSize:"1.05rem" }}>{selected.name}</div>
                <div style={{ color:"#64748b", fontSize:"0.84rem" }}>{selected.email}</div>
              </div>
            </div>

            {[
              { label:"Education",    value:selected.profile?.education||"—" },
              { label:"Location",     value:selected.profile?.location||"—" },
              { label:"Career Path",  value:pathLabel[selected.careerPath]||"Not selected" },
              { label:"Profile",      value:`${selected.profileCompletion||0}% complete` },
              { label:"Jobs Applied", value:`${selected.appliedJobs?.length||0} applications` },
              { label:"Quizzes Taken",value:`${selected.assessmentScores?.length||0} quizzes` },
            ].map((r,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid #f1f5f9" }}>
                <span style={{ color:"#64748b", fontSize:"0.84rem" }}>{r.label}</span>
                <span style={{ color:"#0f172a", fontSize:"0.84rem", fontWeight:600 }}>{r.value}</span>
              </div>
            ))}

            {(selected.profile?.skills||[]).length > 0 && (
              <div style={{ marginTop:"1rem" }}>
                <div style={{ color:"#64748b", fontSize:"0.78rem", fontWeight:600, marginBottom:7, textTransform:"uppercase", letterSpacing:"0.04em" }}>Skills</div>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  {selected.profile.skills.map((sk,i) => (
                    <span key={i} style={{ padding:"3px 9px", borderRadius:7, fontSize:"0.78rem", background:"#f1f5f9", color:"#475569", border:"1px solid #e2e8f0" }}>{sk}</span>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setSelected(null)} style={{ marginTop:"1.5rem", width:"100%", padding:"10px", borderRadius:8, border:"1px solid #e2e8f0", background:"#f8fafc", color:"#475569", cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontWeight:500, fontSize:"0.875rem" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}