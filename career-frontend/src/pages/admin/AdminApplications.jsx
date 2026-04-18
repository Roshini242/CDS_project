import { useState, useEffect } from "react";
import { api } from "../../services/api";
import Toast from "../../components/Toast";
import Spinner from "../../components/Spinner";

const STATUS_STYLES = {
  pending:     { bg:"#fffbeb", color:"#d97706", border:"#fde68a" },
  reviewed:    { bg:"#eff6ff", color:"#2563eb", border:"#bfdbfe" },
  shortlisted: { bg:"#ecfdf5", color:"#059669", border:"#a7f3d0" },
  rejected:    { bg:"#fef2f2", color:"#dc2626", border:"#fecaca" },
};

const FALLBACK = [
  { jobId:"1", jobTitle:"Frontend Developer Intern", company:"TechCorp",  student:{ _id:"s1", name:"Arjun Kumar",  email:"arjun@mail.com"  }, status:"pending",     appliedAt: new Date() },
  { jobId:"2", jobTitle:"Data Analyst",              company:"DataWorks",  student:{ _id:"s2", name:"Priya Sharma", email:"priya@mail.com"  }, status:"shortlisted", appliedAt: new Date() },
  { jobId:"1", jobTitle:"Frontend Developer Intern", company:"TechCorp",  student:{ _id:"s3", name:"Rahul Singh",  email:"rahul@mail.com"  }, status:"reviewed",    appliedAt: new Date() },
  { jobId:"3", jobTitle:"UI/UX Designer",            company:"DesignHub",  student:{ _id:"s4", name:"Sneha Patel",  email:"sneha@mail.com"  }, status:"rejected",    appliedAt: new Date() },
];

export default function AdminApplications() {
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");
  const [toast,   setToast]   = useState({ msg:"", type:"" });

  const showToast = (msg, type="success") => { setToast({ msg, type }); setTimeout(()=>setToast({msg:"",type:""}),3000); };

  useEffect(() => {
    api("/admin/applications")
      .then(d => setApps(d.applications || FALLBACK))
      .catch(() => setApps(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (jobId, userId, status) => {
    try {
      await api(`/admin/applications/${jobId}/${userId}`, { method:"PUT", body: JSON.stringify({ status }) });
      setApps(prev => prev.map(a => a.jobId===jobId && a.student?._id===userId ? { ...a, status } : a));
      showToast("Status updated!");
    } catch (err) { showToast(err.message, "error"); }
  };

  const filtered = filter==="all" ? apps : apps.filter(a => a.status===filter);

  return (
    <div>
      <Toast {...toast} />
      <div style={{ marginBottom:"1.8rem" }}>
        <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:"1.75rem", fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em" }}>📋 Applications</h1>
        <p style={{ color:"#64748b", marginTop:4, fontSize:"0.9rem" }}>Review and manage all job applications</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1.4rem", flexWrap:"wrap" }}>
        {["all","pending","reviewed","shortlisted","rejected"].map(s => {
          const count = s==="all" ? apps.length : apps.filter(a=>a.status===s).length;
          const st = STATUS_STYLES[s] || { bg:"#f1f5f9", color:"#64748b", border:"#e2e8f0" };
          const isActive = filter === s;
          return (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding:"6px 14px", borderRadius:7, cursor:"pointer",
              border:`1px solid ${isActive ? st.border : "#e2e8f0"}`,
              background: isActive ? st.bg : "#ffffff",
              color: isActive ? st.color : "#64748b",
              fontFamily:"'DM Sans', sans-serif", fontSize:"0.84rem", fontWeight:isActive?600:500,
              display:"flex", alignItems:"center", gap:7, transition:"all 0.15s",
            }}>
              <span style={{ textTransform:"capitalize" }}>{s}</span>
              <span style={{ padding:"1px 7px", borderRadius:20, background:isActive?st.color+"22":"#f1f5f9", color:isActive?st.color:"#94a3b8", fontSize:"0.72rem", fontWeight:700 }}>{count}</span>
            </button>
          );
        })}
      </div>

      {loading ? <div style={{ textAlign:"center", padding:"3rem" }}><Spinner /></div> : (
        <div style={{ background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:12, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
                {["Student","Job","Company","Applied","Status","Action"].map((h,i) => (
                  <th key={i} style={{ padding:"11px 14px", textAlign:"left", color:"#64748b", fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => {
                const st = STATUS_STYLES[a.status] || STATUS_STYLES.pending;
                return (
                  <tr key={i} style={{ borderBottom:"1px solid #f1f5f9", transition:"background .12s" }}
                    onMouseEnter={e => e.currentTarget.style.background="#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}
                  >
                    <td style={{ padding:"12px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:30, height:30, borderRadius:"50%", background:"#7c3aed", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"0.75rem", color:"#fff", flexShrink:0 }}>
                          {a.student?.name?.[0]?.toUpperCase()||"?"}
                        </div>
                        <div>
                          <div style={{ color:"#0f172a", fontSize:"0.875rem", fontWeight:600 }}>{a.student?.name||"—"}</div>
                          <div style={{ color:"#94a3b8", fontSize:"0.74rem" }}>{a.student?.email||"—"}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:"12px 14px", color:"#0f172a", fontSize:"0.875rem", fontWeight:500 }}>{a.jobTitle}</td>
                    <td style={{ padding:"12px 14px", color:"#64748b", fontSize:"0.84rem" }}>{a.company}</td>
                    <td style={{ padding:"12px 14px", color:"#94a3b8", fontSize:"0.8rem" }}>{new Date(a.appliedAt).toLocaleDateString()}</td>
                    <td style={{ padding:"12px 14px" }}>
                      <span style={{ padding:"3px 10px", borderRadius:20, fontSize:"0.72rem", fontWeight:600, background:st.bg, color:st.color, border:`1px solid ${st.border}`, textTransform:"capitalize" }}>{a.status}</span>
                    </td>
                    <td style={{ padding:"12px 14px" }}>
                      <select value={a.status}
                        onChange={e => updateStatus(a.jobId, a.student?._id, e.target.value)}
                        style={{ padding:"5px 9px", borderRadius:7, border:"1px solid #e2e8f0", background:"#f8fafc", color:"#475569", fontSize:"0.78rem", cursor:"pointer", fontFamily:"'DM Sans', sans-serif", outline:"none" }}
                        onFocus={e => { e.target.style.borderColor="#7c3aed"; }}
                        onBlur={e  => { e.target.style.borderColor="#e2e8f0"; }}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0 && (
            <div style={{ textAlign:"center", padding:"3rem", color:"#94a3b8", fontSize:"0.9rem" }}>No applications found.</div>
          )}
        </div>
      )}
    </div>
  );
}