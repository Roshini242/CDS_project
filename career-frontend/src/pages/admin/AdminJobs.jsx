import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import { Jobs } from "../../services/api";
import Toast from "../../components/Toast";
import Spinner from "../../components/Spinner";

const BLANK = { title:"", company:"", type:"Internship", location:"", description:"", tags:"", salary:"", requirements:"", rounds:[] };

const inp = {
  padding:"10px 13px", borderRadius:8, border:"1px solid #e2e8f0",
  background:"#ffffff", color:"#0f172a", fontSize:"0.875rem",
  width:"100%", fontFamily:"'DM Sans', sans-serif", outline:"none",
  boxSizing:"border-box", transition:"border-color 0.2s, box-shadow 0.2s",
};

const focusHandlers = {
  onFocus: e => { e.target.style.borderColor="#7c3aed"; e.target.style.boxShadow="0 0 0 3px #7c3aed18"; },
  onBlur:  e => { e.target.style.borderColor="#e2e8f0"; e.target.style.boxShadow="none"; },
};

const TYPE_COLOR  = { Internship:"#2563eb", "Full-time":"#7c3aed", "Part-time":"#059669" };
const TYPE_BG     = { Internship:"#eff6ff", "Full-time":"#f5f3ff", "Part-time":"#ecfdf5" };
const TYPE_BORDER = { Internship:"#bfdbfe", "Full-time":"#ddd6fe", "Part-time":"#a7f3d0" };

export default function AdminJobs() {
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editId,  setEditId]  = useState(null);
  const [form,    setForm]    = useState(BLANK);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState({ msg:"", type:"" });

  const showToast = (msg, type="success") => { setToast({ msg, type }); setTimeout(() => setToast({ msg:"", type:"" }), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api("/admin/jobs");
      setJobs(d.jobs || []);
    } catch {
      setJobs([
        { _id:"1", title:"Frontend Developer Intern", company:"TechCorp",  type:"Internship", location:"Remote",    salary:"₹15,000/mo", applicants:[], isActive:true },
        { _id:"2", title:"Data Analyst",              company:"DataWorks",  type:"Full-time",  location:"Chennai",   salary:"₹6 LPA",    applicants:[{},{}], isActive:true },
        { _id:"3", title:"UI/UX Designer",            company:"DesignHub",  type:"Part-time",  location:"Bangalore", salary:"₹20,000/mo", applicants:[{}], isActive:false },
      ]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditId(null); setForm(BLANK); setModal(true); };

  const openEdit = (j) => {
    setEditId(j._id);
    setForm({
      title:j.title||"", company:j.company||"", type:j.type||"Internship",
      location:j.location||"", description:j.description||"", salary:j.salary||"",
      tags:(j.tags||[]).join(", "), requirements:(j.requirements||[]).join("\n"),
      rounds:(j.rounds||[]).map((r,i) => ({ step:r.step||i+1, name:r.name||"", description:r.description||"" })),
    });
    setModal(true);
  };

  const addRound    = () => setForm(f => ({ ...f, rounds:[...f.rounds, { step:f.rounds.length+1, name:"", description:"" }] }));
  const updateRound = (idx, key, value) => setForm(f => { const r=[...f.rounds]; r[idx]={...r[idx],[key]:value}; return {...f,rounds:r}; });
  const removeRound = (idx) => setForm(f => ({ ...f, rounds:f.rounds.filter((_,i)=>i!==idx).map((r,i)=>({...r,step:i+1})) }));

  const save = async () => {
    if (!form.title || !form.company || !form.location || !form.description) return showToast("Please fill all required fields.", "error");
    const invalidRound = form.rounds.find(r => !r.name.trim());
    if (invalidRound) return showToast("Please enter a name for each interview round.", "error");
    setSaving(true);
    try {
      const payload = { ...form, tags:form.tags.split(",").map(t=>t.trim()).filter(Boolean), requirements:form.requirements.split("\n").filter(Boolean), rounds:form.rounds };
      if (editId) { await Jobs.update(editId, payload); showToast("Job updated successfully! ✅"); }
      else { await Jobs.create(payload); showToast("Job posted successfully! 🎉"); }
      setModal(false); setForm(BLANK); setEditId(null); load();
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Remove this job?")) return;
    try { await Jobs.delete(id); showToast("Job removed."); load(); }
    catch (err) { showToast(err.message, "error"); }
  };

  const closeModal = () => { setModal(false); setForm(BLANK); setEditId(null); };

  return (
    <div>
      <Toast {...toast} />

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.8rem" }}>
        <div>
          <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:"1.75rem", fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em" }}>💼 Manage Jobs</h1>
          <p style={{ color:"#64748b", marginTop:4, fontSize:"0.9rem" }}>Post and manage job listings</p>
        </div>
        <button onClick={openCreate} style={{
          padding:"9px 20px", borderRadius:8, border:"none",
          background:"#7c3aed", color:"#fff", fontWeight:600,
          cursor:"pointer", fontFamily:"'DM Sans', sans-serif",
          display:"flex", alignItems:"center", gap:7, fontSize:"0.875rem",
          boxShadow:"0 2px 8px #7c3aed44", transition:"background 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background="#6d28d9"}
          onMouseLeave={e => e.currentTarget.style.background="#7c3aed"}
        >＋ Post New Job</button>
      </div>

      {loading ? <div style={{ textAlign:"center", padding:"3rem" }}><Spinner /></div> : (
        <div style={{ display:"flex", flexDirection:"column", gap:"0.8rem" }}>
          {jobs.map((j, i) => {
            const tc = TYPE_COLOR[j.type] || "#64748b";
            const tbg = TYPE_BG[j.type] || "#f1f5f9";
            const tb = TYPE_BORDER[j.type] || "#e2e8f0";
            return (
              <div key={j._id||i} style={{
                background:"#ffffff", border:"1px solid #e2e8f0",
                borderRadius:12, padding:"1.1rem 1.4rem",
                display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1rem",
                boxShadow:"0 1px 3px rgba(0,0,0,0.04)", transition:"box-shadow 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.07)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.04)"}
              >
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                    <span style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, color:"#0f172a", fontSize:"0.95rem" }}>{j.title}</span>
                    <span style={{ padding:"2px 9px", borderRadius:20, fontSize:"0.7rem", fontWeight:600, background:tbg, color:tc, border:`1px solid ${tb}` }}>{j.type}</span>
                    {!j.isActive && <span style={{ padding:"2px 8px", borderRadius:20, fontSize:"0.7rem", fontWeight:600, background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca" }}>Inactive</span>}
                    {j.rounds?.length > 0 && <span style={{ padding:"2px 8px", borderRadius:20, fontSize:"0.7rem", fontWeight:600, background:"#ecfdf5", color:"#059669", border:"1px solid #a7f3d0" }}>🎯 {j.rounds.length} Rounds</span>}
                  </div>
                  <div style={{ color:"#64748b", fontSize:"0.83rem" }}>{j.company} · {j.location} · <span style={{ color:"#059669", fontWeight:600 }}>{j.salary}</span></div>
                </div>

                <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, color:"#7c3aed", fontSize:"1.1rem" }}>{j.applicants?.length||0}</div>
                    <div style={{ color:"#94a3b8", fontSize:"0.7rem" }}>Applicants</div>
                  </div>
                  <button onClick={() => openEdit(j)} style={{
                    padding:"6px 13px", borderRadius:7,
                    border:"1px solid #ddd6fe", background:"#f5f3ff",
                    color:"#7c3aed", cursor:"pointer", fontSize:"0.78rem", fontWeight:600,
                    transition:"all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background="#ede9fe"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="#f5f3ff"; }}
                  >✏️ Edit</button>
                  <button onClick={() => remove(j._id)} style={{
                    padding:"6px 13px", borderRadius:7, border:"1px solid #fecaca",
                    background:"#fff5f5", color:"#dc2626", cursor:"pointer", fontSize:"0.78rem", fontWeight:600,
                    transition:"all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background="#fee2e2"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="#fff5f5"; }}
                  >Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}
          onClick={e => e.target===e.currentTarget && closeModal()}>
          <div style={{
            background:"#ffffff", border:"1px solid #e2e8f0",
            borderRadius:16, padding:"2rem", width:"100%", maxWidth:600,
            maxHeight:"88vh", overflowY:"auto",
            boxShadow:"0 20px 60px rgba(0,0,0,0.15)",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
              <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, color:"#0f172a", fontSize:"1.2rem" }}>
                {editId ? "✏️ Edit Job" : "＋ Post New Job"}
              </h2>
              {editId && (
                <span style={{ padding:"3px 10px", borderRadius:20, fontSize:"0.72rem", fontWeight:600, background:"#f5f3ff", border:"1px solid #ddd6fe", color:"#7c3aed" }}>Editing existing job</span>
              )}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
              {[
                { label:"Job Title *",  key:"title",    placeholder:"e.g. Frontend Developer Intern" },
                { label:"Company *",    key:"company",  placeholder:"e.g. TCS" },
                { label:"Location *",   key:"location", placeholder:"e.g. Chennai / Remote" },
                { label:"Salary",       key:"salary",   placeholder:"e.g. ₹25,000/month" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ color:"#475569", fontSize:"0.78rem", fontWeight:600, display:"block", marginBottom:5 }}>{f.label}</label>
                  <input value={form[f.key]} placeholder={f.placeholder} onChange={e => setForm({...form,[f.key]:e.target.value})} style={inp} {...focusHandlers} />
                </div>
              ))}
            </div>

            <div style={{ marginTop:"1rem" }}>
              <label style={{ color:"#475569", fontSize:"0.78rem", fontWeight:600, display:"block", marginBottom:5 }}>Job Type *</label>
              <select value={form.type} onChange={e => setForm({...form,type:e.target.value})} style={{ ...inp, cursor:"pointer" }} {...focusHandlers}>
                {["Internship","Full-time","Part-time","Contract","Freelance"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ marginTop:"1rem" }}>
              <label style={{ color:"#475569", fontSize:"0.78rem", fontWeight:600, display:"block", marginBottom:5 }}>Description *</label>
              <textarea value={form.description} placeholder="Describe the role and responsibilities..." onChange={e => setForm({...form,description:e.target.value})} rows={3} style={{ ...inp, resize:"vertical" }} {...focusHandlers} />
            </div>

            <div style={{ marginTop:"1rem" }}>
              <label style={{ color:"#475569", fontSize:"0.78rem", fontWeight:600, display:"block", marginBottom:5 }}>Skills / Tags (comma separated)</label>
              <input value={form.tags} placeholder="React, Node.js, Python..." onChange={e => setForm({...form,tags:e.target.value})} style={inp} {...focusHandlers} />
            </div>

            <div style={{ marginTop:"1rem" }}>
              <label style={{ color:"#475569", fontSize:"0.78rem", fontWeight:600, display:"block", marginBottom:5 }}>Requirements (one per line)</label>
              <textarea value={form.requirements} placeholder={"Bachelor's degree\n1+ year experience\n..."} onChange={e => setForm({...form,requirements:e.target.value})} rows={3} style={{ ...inp, resize:"vertical" }} {...focusHandlers} />
            </div>

            {/* Interview Rounds */}
            <div style={{ marginTop:"1.4rem", padding:"1rem", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.9rem" }}>
                <div>
                  <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, color:"#0f172a", fontSize:"0.9rem" }}>🎯 Interview Process</div>
                  <div style={{ color:"#94a3b8", fontSize:"0.72rem", marginTop:2 }}>Add interview rounds (optional)</div>
                </div>
                <button onClick={addRound} style={{
                  padding:"5px 13px", borderRadius:7, border:"1px solid #ddd6fe",
                  background:"#f5f3ff", color:"#7c3aed", cursor:"pointer",
                  fontSize:"0.78rem", fontWeight:600,
                }}>＋ Add Round</button>
              </div>

              {form.rounds.length === 0 ? (
                <div style={{ textAlign:"center", padding:"1.2rem", border:"1px dashed #e2e8f0", borderRadius:8, color:"#94a3b8", fontSize:"0.8rem" }}>
                  No rounds added yet. Click <strong>＋ Add Round</strong> to add.
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:"0.7rem" }}>
                  {form.rounds.map((r, idx) => (
                    <div key={idx} style={{ background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:9, padding:"0.8rem" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.7rem", marginBottom:"0.5rem" }}>
                        <div style={{
                          flexShrink:0, width:24, height:24, borderRadius:"50%",
                          background:"#f5f3ff", border:"1px solid #ddd6fe",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:"0.72rem", fontWeight:700, color:"#7c3aed",
                        }}>{r.step}</div>
                        <input value={r.name} placeholder="Round name (e.g. Technical Interview)" onChange={e => updateRound(idx,"name",e.target.value)} style={{ ...inp, flex:1 }} {...focusHandlers} />
                        <button onClick={() => removeRound(idx)} style={{ flexShrink:0, padding:"3px 9px", borderRadius:5, border:"1px solid #fecaca", background:"#fff5f5", color:"#dc2626", cursor:"pointer", fontSize:"0.72rem" }}>✕</button>
                      </div>
                      <input value={r.description} placeholder="What happens in this round?" onChange={e => updateRound(idx,"description",e.target.value)} style={{ ...inp, fontSize:"0.82rem", color:"#64748b" }} {...focusHandlers} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display:"flex", gap:"0.8rem", marginTop:"1.5rem" }}>
              <button onClick={save} disabled={saving} style={{
                flex:1, padding:"11px", borderRadius:8, border:"none",
                background:saving?"#94a3b8":"#7c3aed",
                color:"#fff", fontWeight:600, cursor:saving?"not-allowed":"pointer",
                fontFamily:"'DM Sans', sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                boxShadow:saving?"none":"0 2px 8px #7c3aed44",
              }}>
                {saving ? <><Spinner /> Saving...</> : editId ? "Update Job ✅" : "Post Job 🚀"}
              </button>
              <button onClick={closeModal} style={{ padding:"11px 18px", borderRadius:8, border:"1px solid #e2e8f0", background:"#f8fafc", color:"#64748b", cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}