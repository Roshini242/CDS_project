import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import { Jobs } from "../../services/api";
import Toast from "../../components/Toast";
import Spinner from "../../components/Spinner";

const BLANK = {
  title:"", company:"", type:"Internship", location:"",
  description:"", tags:"", salary:"", requirements:"",
  rounds:[],
};

const inp = {
  padding:"10px 14px", borderRadius:8, border:"1px solid #1e2d45",
  background:"#0a0f1e", color:"#e2e8f0", fontSize:"0.9rem",
  width:"100%", fontFamily:"DM Sans, sans-serif", outline:"none",
};

const TYPE_COLOR = { Internship:"#00d4ff", "Full-time":"#a78bfa", "Part-time":"#10b981" };

export default function AdminJobs() {
  const [jobs,     setJobs]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [editId,   setEditId]   = useState(null); // null = create, string = edit
  const [form,     setForm]     = useState(BLANK);
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState({ msg:"", type:"" });

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:"", type:"" }), 3000);
  };

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

  // ── Open modal for CREATE ─────────────────────────────────────────────────
  const openCreate = () => {
    setEditId(null);
    setForm(BLANK);
    setModal(true);
  };

  // ── Open modal for EDIT ───────────────────────────────────────────────────
  const openEdit = (j) => {
    setEditId(j._id);
    setForm({
      title:        j.title        || "",
      company:      j.company      || "",
      type:         j.type         || "Internship",
      location:     j.location     || "",
      description:  j.description  || "",
      salary:       j.salary       || "",
      tags:         (j.tags||[]).join(", "),
      requirements: (j.requirements||[]).join("\n"),
      rounds:       (j.rounds||[]).map((r,i) => ({ step:r.step||i+1, name:r.name||"", description:r.description||"" })),
    });
    setModal(true);
  };

  // ── Rounds helpers ────────────────────────────────────────────────────────
  const addRound = () => setForm(f => ({ ...f, rounds:[...f.rounds, { step:f.rounds.length+1, name:"", description:"" }] }));

  const updateRound = (idx, key, value) => setForm(f => {
    const rounds = [...f.rounds];
    rounds[idx] = { ...rounds[idx], [key]:value };
    return { ...f, rounds };
  });

  const removeRound = (idx) => setForm(f => ({
    ...f,
    rounds: f.rounds.filter((_,i)=>i!==idx).map((r,i)=>({ ...r, step:i+1 })),
  }));

  // ── Save (create or update) ───────────────────────────────────────────────
  const save = async () => {
    if (!form.title || !form.company || !form.location || !form.description)
      return showToast("Please fill all required fields.", "error");
    const invalidRound = form.rounds.find(r => !r.name.trim());
    if (invalidRound) return showToast("Please enter a name for each interview round.", "error");

    setSaving(true);
    try {
      const payload = {
        ...form,
        tags:         form.tags.split(",").map(t=>t.trim()).filter(Boolean),
        requirements: form.requirements.split("\n").filter(Boolean),
        rounds:       form.rounds,
      };

      if (editId) {
        // UPDATE existing job
        await Jobs.update(editId, payload);
        showToast("Job updated successfully! ✅");
      } else {
        // CREATE new job
        await Jobs.create(payload);
        showToast("Job posted successfully! 🎉");
      }

      setModal(false);
      setForm(BLANK);
      setEditId(null);
      load();
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

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"2rem" }}>
        <div>
          <h1 style={{ fontFamily:"Syne, sans-serif", fontSize:"1.8rem", fontWeight:800, color:"#fff" }}>💼 Manage Jobs</h1>
          <p style={{ color:"#64748b", marginTop:4 }}>Post and manage job listings</p>
        </div>
        <button onClick={openCreate} style={{
          padding:"10px 22px", borderRadius:10, border:"none",
          background:"linear-gradient(135deg,#7c3aed,#00d4ff)",
          color:"#fff", fontWeight:600, cursor:"pointer", fontFamily:"DM Sans, sans-serif",
          display:"flex", alignItems:"center", gap:8,
        }}>＋ Post New Job</button>
      </div>

      {/* Job List */}
      {loading ? <div style={{ textAlign:"center", padding:"3rem" }}><Spinner /></div> : (
        <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
          {jobs.map((j, i) => (
            <div key={j._id||i} style={{
              background:"#111827", border:"1px solid #1e2d45",
              borderRadius:14, padding:"1.2rem 1.5rem",
              display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1rem",
            }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4, flexWrap:"wrap" }}>
                  <span style={{ fontFamily:"Syne, sans-serif", fontWeight:700, color:"#fff" }}>{j.title}</span>
                  <span style={{
                    padding:"2px 10px", borderRadius:20, fontSize:"0.72rem",
                    background:(TYPE_COLOR[j.type]||"#94a3b8")+"22",
                    color: TYPE_COLOR[j.type]||"#94a3b8",
                  }}>{j.type}</span>
                  {!j.isActive && <span style={{ padding:"2px 8px", borderRadius:20, fontSize:"0.72rem", background:"#ef444422", color:"#ef4444" }}>Inactive</span>}
                  {j.rounds?.length > 0 && (
                    <span style={{ padding:"2px 8px", borderRadius:20, fontSize:"0.72rem", background:"#10b98122", color:"#10b981" }}>
                      🎯 {j.rounds.length} Rounds
                    </span>
                  )}
                </div>
                <div style={{ color:"#64748b", fontSize:"0.85rem" }}>{j.company} · {j.location} · {j.salary}</div>
              </div>

              <div style={{ display:"flex", alignItems:"center", gap:"1.5rem" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, color:"#a78bfa", fontSize:"1.2rem" }}>
                    {j.applicants?.length || 0}
                  </div>
                  <div style={{ color:"#64748b", fontSize:"0.75rem" }}>Applicants</div>
                </div>

                {/* Edit button */}
                <button onClick={() => openEdit(j)} style={{
                  padding:"7px 14px", borderRadius:8,
                  border:"1px solid #00d4ff44", background:"#00d4ff11",
                  color:"#00d4ff", cursor:"pointer", fontSize:"0.8rem",
                }}>✏️ Edit</button>

                {/* Remove button */}
                <button onClick={() => remove(j._id)} style={{
                  padding:"7px 14px", borderRadius:8, border:"1px solid #ef444444",
                  background:"#ef444411", color:"#ef4444", cursor:"pointer", fontSize:"0.8rem",
                }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal (Create / Edit) ──────────────────────────────────────────── */}
      {modal && (
        <div style={{
          position:"fixed", inset:0, background:"#00000088", zIndex:200,
          display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem",
        }} onClick={e => e.target===e.currentTarget && closeModal()}>
          <div style={{
            background:"#111827", border:"1px solid #1e2d45",
            borderRadius:20, padding:"2rem", width:"100%", maxWidth:600,
            maxHeight:"88vh", overflowY:"auto",
          }}>
            {/* Modal title */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
              <h2 style={{ fontFamily:"Syne, sans-serif", fontWeight:800, color:"#fff" }}>
                {editId ? "✏️ Edit Job" : "＋ Post New Job"}
              </h2>
              {editId && (
                <span style={{
                  padding:"3px 12px", borderRadius:20, fontSize:"0.75rem",
                  background:"#00d4ff11", border:"1px solid #00d4ff33", color:"#00d4ff",
                }}>Editing existing job</span>
              )}
            </div>

            {/* Basic fields */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
              {[
                { label:"Job Title *",  key:"title",    placeholder:"e.g. Frontend Developer Intern" },
                { label:"Company *",    key:"company",  placeholder:"e.g. TCS"                       },
                { label:"Location *",   key:"location", placeholder:"e.g. Chennai / Remote"          },
                { label:"Salary",       key:"salary",   placeholder:"e.g. ₹25,000/month"            },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ color:"#94a3b8", fontSize:"0.8rem", display:"block", marginBottom:6 }}>{f.label}</label>
                  <input value={form[f.key]} placeholder={f.placeholder}
                    onChange={e => setForm({...form,[f.key]:e.target.value})} style={inp} />
                </div>
              ))}
            </div>

            <div style={{ marginTop:"1rem" }}>
              <label style={{ color:"#94a3b8", fontSize:"0.8rem", display:"block", marginBottom:6 }}>Job Type *</label>
              <select value={form.type} onChange={e => setForm({...form,type:e.target.value})}
                style={{ ...inp, cursor:"pointer" }}>
                {["Internship","Full-time","Part-time","Contract","Freelance"].map(t=>(
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div style={{ marginTop:"1rem" }}>
              <label style={{ color:"#94a3b8", fontSize:"0.8rem", display:"block", marginBottom:6 }}>Description *</label>
              <textarea value={form.description} placeholder="Describe the role and responsibilities..."
                onChange={e => setForm({...form,description:e.target.value})}
                rows={3} style={{ ...inp, resize:"vertical" }} />
            </div>

            <div style={{ marginTop:"1rem" }}>
              <label style={{ color:"#94a3b8", fontSize:"0.8rem", display:"block", marginBottom:6 }}>Skills / Tags (comma separated)</label>
              <input value={form.tags} placeholder="React, Node.js, Python..."
                onChange={e => setForm({...form,tags:e.target.value})} style={inp} />
            </div>

            <div style={{ marginTop:"1rem" }}>
              <label style={{ color:"#94a3b8", fontSize:"0.8rem", display:"block", marginBottom:6 }}>Requirements (one per line)</label>
              <textarea value={form.requirements} placeholder={"Bachelor's degree\n1+ year experience\n..."}
                onChange={e => setForm({...form,requirements:e.target.value})}
                rows={3} style={{ ...inp, resize:"vertical" }} />
            </div>

            {/* Interview Rounds */}
            <div style={{ marginTop:"1.5rem", padding:"1rem", background:"#0d1424", border:"1px solid #1e2d45", borderRadius:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
                <div>
                  <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, color:"#fff", fontSize:"0.95rem" }}>🎯 Interview Process</div>
                  <div style={{ color:"#64748b", fontSize:"0.75rem", marginTop:2 }}>Add interview rounds (optional)</div>
                </div>
                <button onClick={addRound} style={{
                  padding:"6px 14px", borderRadius:8, border:"1px solid #7c3aed44",
                  background:"#7c3aed22", color:"#a78bfa", cursor:"pointer",
                  fontSize:"0.8rem", fontFamily:"DM Sans, sans-serif", fontWeight:600,
                }}>＋ Add Round</button>
              </div>

              {form.rounds.length === 0 ? (
                <div style={{ textAlign:"center", padding:"1.5rem", border:"1px dashed #1e2d45", borderRadius:10, color:"#64748b", fontSize:"0.82rem" }}>
                  No rounds added yet. Click <strong>＋ Add Round</strong> to add.
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:"0.8rem" }}>
                  {form.rounds.map((r, idx) => (
                    <div key={idx} style={{ background:"#111827", border:"1px solid #1e2d45", borderRadius:10, padding:"0.8rem 1rem" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.8rem", marginBottom:"0.6rem" }}>
                        <div style={{
                          flexShrink:0, width:26, height:26, borderRadius:"50%",
                          background:"#7c3aed22", border:"1px solid #7c3aed55",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:"0.75rem", fontWeight:700, color:"#a78bfa",
                        }}>{r.step}</div>
                        <input value={r.name} placeholder="Round name (e.g. Technical Interview)"
                          onChange={e => updateRound(idx,"name",e.target.value)}
                          style={{ ...inp, flex:1 }} />
                        <button onClick={() => removeRound(idx)} style={{
                          flexShrink:0, padding:"4px 10px", borderRadius:6,
                          border:"1px solid #ef444433", background:"#ef444411",
                          color:"#ef4444", cursor:"pointer", fontSize:"0.75rem",
                        }}>✕</button>
                      </div>
                      <input value={r.description} placeholder="What happens in this round?"
                        onChange={e => updateRound(idx,"description",e.target.value)}
                        style={{ ...inp, fontSize:"0.82rem", color:"#94a3b8" }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display:"flex", gap:"1rem", marginTop:"1.5rem" }}>
              <button onClick={save} disabled={saving} style={{
                flex:1, padding:"12px", borderRadius:10, border:"none",
                background: saving ? "#1e2d45" : "linear-gradient(135deg,#7c3aed,#00d4ff)",
                color:"#fff", fontWeight:600, cursor:saving?"not-allowed":"pointer",
                fontFamily:"DM Sans, sans-serif",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}>
                {saving ? <><Spinner /> Saving...</> : editId ? "Update Job ✅" : "Post Job 🚀"}
              </button>
              <button onClick={closeModal} style={{
                padding:"12px 20px", borderRadius:10, border:"1px solid #1e2d45",
                background:"transparent", color:"#94a3b8", cursor:"pointer",
                fontFamily:"DM Sans, sans-serif",
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}