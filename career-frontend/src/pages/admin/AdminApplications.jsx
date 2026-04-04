import { useState, useEffect } from "react";
import { api } from "../../services/api";
import Toast from "../../components/Toast";
import Spinner from "../../components/Spinner";

const STATUS_COLORS = {
  pending:     { bg:"#f59e0b22", color:"#f59e0b", border:"#f59e0b44" },
  reviewed:    { bg:"#00d4ff22", color:"#00d4ff", border:"#00d4ff44" },
  shortlisted: { bg:"#10b98122", color:"#10b981", border:"#10b98144" },
  rejected:    { bg:"#ef444422", color:"#ef4444", border:"#ef444444" },
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
      .catch(()  => setApps(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (jobId, userId, status) => {
    try {
      await api(`/admin/applications/${jobId}/${userId}`, { method:"PUT", body: JSON.stringify({ status }) });
      setApps(prev => prev.map(a =>
        a.jobId===jobId && a.student?._id===userId ? { ...a, status } : a
      ));
      showToast("Status updated!");
    } catch (err) { showToast(err.message, "error"); }
  };

  const filtered = filter==="all" ? apps : apps.filter(a => a.status===filter);

  return (
    <div>
      <Toast {...toast} />
      <div style={{ marginBottom:"2rem" }}>
        <h1 style={{ fontFamily:"Syne, sans-serif", fontSize:"1.8rem", fontWeight:800, color:"#fff" }}>📋 Applications</h1>
        <p style={{ color:"#64748b", marginTop:4 }}>Review and manage all job applications</p>
      </div>

      {/* Summary badges */}
      <div style={{ display:"flex", gap:"0.8rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
        {["all","pending","reviewed","shortlisted","rejected"].map(s => {
          const count = s==="all" ? apps.length : apps.filter(a=>a.status===s).length;
          const c = STATUS_COLORS[s] || { bg:"#1e2d45", color:"#94a3b8", border:"#1e2d45" };
          return (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding:"7px 16px", borderRadius:8, cursor:"pointer",
              border:`1px solid ${filter===s ? c.border : "#1e2d45"}`,
              background: filter===s ? c.bg : "transparent",
              color: filter===s ? c.color : "#94a3b8",
              fontFamily:"DM Sans, sans-serif", fontSize:"0.85rem",
              display:"flex", alignItems:"center", gap:8,
            }}>
              <span style={{ textTransform:"capitalize" }}>{s}</span>
              <span style={{ padding:"1px 7px", borderRadius:20, background: filter===s?c.color+"33":"#1e2d45", color: filter===s?c.color:"#64748b", fontSize:"0.75rem" }}>{count}</span>
            </button>
          );
        })}
      </div>

      {loading ? <div style={{ textAlign:"center", padding:"3rem" }}><Spinner /></div> : (
        <div style={{ background:"#111827", border:"1px solid #1e2d45", borderRadius:16, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#0d1424" }}>
                {["Student","Job","Company","Applied","Status","Action"].map((h,i) => (
                  <th key={i} style={{ padding:"12px 16px", textAlign:"left", color:"#64748b", fontSize:"0.78rem", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", borderBottom:"1px solid #1e2d45" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => {
                const sc = STATUS_COLORS[a.status] || STATUS_COLORS.pending;
                return (
                  <tr key={i} style={{ borderBottom:"1px solid #1e2d4533" }}
                    onMouseEnter={e => e.currentTarget.style.background="#ffffff05"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}
                  >
                    <td style={{ padding:"13px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#00d4ff,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"0.78rem", color:"#fff" }}>
                          {a.student?.name?.[0]?.toUpperCase()||"?"}
                        </div>
                        <div>
                          <div style={{ color:"#e2e8f0", fontSize:"0.88rem", fontWeight:500 }}>{a.student?.name||"—"}</div>
                          <div style={{ color:"#64748b", fontSize:"0.75rem" }}>{a.student?.email||"—"}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:"13px 16px", color:"#e2e8f0", fontSize:"0.88rem" }}>{a.jobTitle}</td>
                    <td style={{ padding:"13px 16px", color:"#64748b", fontSize:"0.85rem" }}>{a.company}</td>
                    <td style={{ padding:"13px 16px", color:"#64748b", fontSize:"0.82rem" }}>{new Date(a.appliedAt).toLocaleDateString()}</td>
                    <td style={{ padding:"13px 16px" }}>
                      <span style={{ padding:"4px 10px", borderRadius:20, fontSize:"0.75rem", background:sc.bg, color:sc.color, border:`1px solid ${sc.border}`, textTransform:"capitalize" }}>{a.status}</span>
                    </td>
                    <td style={{ padding:"13px 16px" }}>
                      <select value={a.status}
                        onChange={e => updateStatus(a.jobId, a.student?._id, e.target.value)}
                        style={{ padding:"6px 10px", borderRadius:7, border:"1px solid #1e2d45", background:"#0a0f1e", color:"#e2e8f0", fontSize:"0.8rem", cursor:"pointer", fontFamily:"DM Sans, sans-serif" }}>
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
            <div style={{ textAlign:"center", padding:"3rem", color:"#64748b" }}>No applications found.</div>
          )}
        </div>
      )}
    </div>
  );
}