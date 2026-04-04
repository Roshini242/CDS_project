import { useState } from "react";
import { Auth } from "../services/api";
import Toast from "../components/Toast";
import Spinner from "../components/Spinner";

const inp = {
  padding:"12px 16px", borderRadius:"10px", border:"1px solid #1e2d45",
  background:"#0a0f1e", color:"#e2e8f0", fontSize:"0.95rem",
  width:"100%", fontFamily:"DM Sans, sans-serif", outline:"none",
};

export default function ProfilePage({ user, onUpdate }) {
  const [form, setForm] = useState({
    name:      user?.name                        || "",
    bio:       user?.profile?.bio                || "",
    skills:    user?.profile?.skills?.join(", ") || "",
    education: user?.profile?.education          || "",
    phone:     user?.profile?.phone              || "",
    location:  user?.profile?.location           || "",
    linkedIn:  user?.profile?.linkedIn           || "",
    github:    user?.profile?.github             || "",
    careerPath:user?.careerPath                  || "",
  });
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState({ msg:"", type:"" });

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:"", type:"" }), 3000);
  };

  // ── Completion calculation ─────────────────────────────────────────────────
  const COMPLETION_ITEMS = [
    { key:"name",       label:"Full Name",    icon:"👤", weight:15 },
    { key:"bio",        label:"Bio",          icon:"📝", weight:15 },
    { key:"skills",     label:"Skills",       icon:"🛠️", weight:20 },
    { key:"education",  label:"Education",    icon:"🎓", weight:10 },
    { key:"phone",      label:"Phone",        icon:"📞", weight:5  },
    { key:"location",   label:"Location",     icon:"📍", weight:5  },
    { key:"careerPath", label:"Career Path",  icon:"🎯", weight:20 },
    { key:"linkedIn",   label:"LinkedIn",     icon:"💼", weight:5  },
    { key:"github",     label:"GitHub",       icon:"🐙", weight:5  },
  ];

  const completed = COMPLETION_ITEMS.filter(i => form[i.key]?.trim?.() || form[i.key]);
  const missing   = COMPLETION_ITEMS.filter(i => !form[i.key]?.trim?.() && !form[i.key]);
  const completion = completed.reduce((sum, i) => sum + i.weight, 0);
  const barColor   = completion >= 80 ? "#10b981" : completion >= 50 ? "#f59e0b" : "#ef4444";

  // ── Save ──────────────────────────────────────────────────────────────────
  const save = async () => {
    setLoading(true);
    try {
      const data = await Auth.updateProfile({
        name: form.name,
        careerPath: form.careerPath,
        profile: {
          bio:       form.bio,
          skills:    form.skills.split(",").map(s => s.trim()).filter(Boolean),
          education: form.education,
          phone:     form.phone,
          location:  form.location,
          linkedIn:  form.linkedIn,
          github:    form.github,
        },
      });
      onUpdate(data.user);
      showToast("Profile saved! ✅");
    } catch (err) { showToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  const fields = [
    { label:"Full Name", key:"name",      placeholder:"Your full name"       },
    { label:"Phone",     key:"phone",     placeholder:"+91 XXXXX XXXXX"      },
    { label:"Education", key:"education", placeholder:"B.E Computer Science" },
    { label:"Location",  key:"location",  placeholder:"Chennai, India"       },
    { label:"LinkedIn",  key:"linkedIn",  placeholder:"linkedin.com/in/..."  },
    { label:"GitHub",    key:"github",    placeholder:"github.com/..."       },
  ];

  return (
    <div style={{ paddingTop:80, minHeight:"100vh", padding:"80px 2rem 3rem", maxWidth:900, margin:"0 auto" }}>
      <Toast {...toast} />
      <h1 style={{ fontFamily:"Syne, sans-serif", fontSize:"1.8rem", fontWeight:800, color:"#fff", marginBottom:4 }}>👤 My Profile</h1>
      <p style={{ color:"#64748b", marginBottom:"2rem" }}>Keep your profile complete for better job matches</p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:"1.5rem", alignItems:"start" }}>

        {/* ── Left: Form ───────────────────────────────────────────────────── */}
        <div style={{ background:"#111827", border:"1px solid #1e2d45", borderRadius:16, padding:"2rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
            {fields.map(f => (
              <div key={f.key}>
                <label style={{ color:"#94a3b8", fontSize:"0.8rem", display:"block", marginBottom:6 }}>{f.label}</label>
                <input value={form[f.key]} placeholder={f.placeholder}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{
                    ...inp,
                    borderColor: form[f.key]?.trim() ? "#00d4ff22" : "#1e2d45",
                  }} />
              </div>
            ))}
          </div>

          <div style={{ marginTop:"1rem" }}>
            <label style={{ color:"#94a3b8", fontSize:"0.8rem", display:"block", marginBottom:6 }}>Bio</label>
            <textarea value={form.bio} placeholder="Tell us about yourself..."
              onChange={e => setForm({ ...form, bio: e.target.value })}
              rows={3} style={{ ...inp, resize:"vertical", borderColor: form.bio?.trim() ? "#00d4ff22" : "#1e2d45" }} />
          </div>

          <div style={{ marginTop:"1rem" }}>
            <label style={{ color:"#94a3b8", fontSize:"0.8rem", display:"block", marginBottom:6 }}>Skills (comma separated)</label>
            <input value={form.skills} placeholder="React, Node.js, Python, Figma..."
              onChange={e => setForm({ ...form, skills: e.target.value })}
              style={{ ...inp, borderColor: form.skills?.trim() ? "#00d4ff22" : "#1e2d45" }} />
          </div>

          <div style={{ marginTop:"1rem" }}>
            <label style={{ color:"#94a3b8", fontSize:"0.8rem", display:"block", marginBottom:6 }}>Career Path</label>
            <select value={form.careerPath}
              onChange={e => setForm({ ...form, careerPath: e.target.value })}
              style={{ ...inp, cursor:"pointer", borderColor: form.careerPath ? "#00d4ff22" : "#1e2d45" }}>
              <option value="">Select a career path</option>
              <option value="webdev">🌐 Web Developer</option>
              <option value="datascience">📊 Data Scientist</option>
              <option value="uiux">🎨 UI/UX Designer</option>
              <option value="mobile">📱 Mobile App Developer</option>
              <option value="cybersecurity">🔐 Cybersecurity Analyst</option>
              <option value="cloud">☁️ Cloud Engineer</option>
              <option value="ai">🤖 AI Engineer</option>
              <option value="devops">⚙️ DevOps Engineer</option>
              <option value="blockchain">⛓️ Blockchain Developer</option>
              <option value="gamedev">🎮 Game Developer</option>
            </select>
          </div>

          <button onClick={save} disabled={loading} style={{
            marginTop:"1.5rem", padding:"13px 28px", borderRadius:10, border:"none",
            background: loading ? "#1e2d45" : "linear-gradient(135deg,#00d4ff,#7c3aed)",
            color:"#fff", fontSize:"0.95rem", fontWeight:600,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily:"DM Sans, sans-serif",
            display:"flex", alignItems:"center", gap:8,
          }}>
            {loading ? <><Spinner /> Saving...</> : "Save Profile"}
          </button>
        </div>

        {/* ── Right: Completion Tips ────────────────────────────────────────── */}
        <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>

          {/* Completion card */}
          <div style={{
            background:"#111827", border:"1px solid #1e2d45",
            borderRadius:16, padding:"1.5rem",
          }}>
            <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, color:"#fff", marginBottom:"1rem" }}>
              📊 Profile Completion
            </div>

            {/* Big % */}
            <div style={{ textAlign:"center", marginBottom:"1rem" }}>
              <div style={{
                fontFamily:"Syne, sans-serif", fontSize:"3rem", fontWeight:800,
                color: barColor,
              }}>{completion}%</div>
              <div style={{ color:"#64748b", fontSize:"0.8rem" }}>
                {completion === 100 ? "🎉 Perfect profile!" : completion >= 80 ? "Almost there!" : completion >= 50 ? "Good progress!" : "Just getting started!"}
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height:8, background:"#1e2d45", borderRadius:4, marginBottom:"1.2rem" }}>
              <div style={{
                width:`${completion}%`, height:"100%", borderRadius:4,
                background:`linear-gradient(90deg,${barColor},${barColor}88)`,
                transition:"width .4s ease",
              }} />
            </div>

            {/* Completed items */}
            {completed.length > 0 && (
              <div style={{ marginBottom:"1rem" }}>
                <div style={{ color:"#10b981", fontSize:"0.75rem", fontWeight:600, marginBottom:6 }}>
                  ✅ COMPLETED ({completed.length})
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  {completed.map((item, i) => (
                    <div key={i} style={{
                      display:"flex", alignItems:"center", gap:8,
                      padding:"5px 8px", borderRadius:8,
                      background:"#10b98108", border:"1px solid #10b98122",
                    }}>
                      <span style={{ fontSize:"0.85rem" }}>{item.icon}</span>
                      <span style={{ color:"#10b981", fontSize:"0.8rem", flex:1 }}>{item.label}</span>
                      <span style={{ color:"#10b98188", fontSize:"0.72rem" }}>+{item.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing items */}
            {missing.length > 0 && (
              <div>
                <div style={{ color:"#f59e0b", fontSize:"0.75rem", fontWeight:600, marginBottom:6 }}>
                  ⚠ MISSING ({missing.length})
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  {missing.map((item, i) => (
                    <div key={i} style={{
                      display:"flex", alignItems:"center", gap:8,
                      padding:"5px 8px", borderRadius:8,
                      background:"#f59e0b08", border:"1px solid #f59e0b22",
                    }}>
                      <span style={{ fontSize:"0.85rem" }}>{item.icon}</span>
                      <span style={{ color:"#f59e0b", fontSize:"0.8rem", flex:1 }}>{item.label}</span>
                      <span style={{ color:"#f59e0b88", fontSize:"0.72rem" }}>+{item.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tips card */}
          <div style={{
            background:"#111827", border:"1px solid #7c3aed33",
            borderRadius:16, padding:"1.5rem",
          }}>
            <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, color:"#fff", marginBottom:"1rem" }}>
              💡 Tips
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.7rem" }}>
              {[
                { icon:"🎯", tip:"Select a career path to get personalized roadmap and assessments" },
                { icon:"🛠️", tip:"Add your skills to improve job match accuracy" },
                { icon:"💼", tip:"Add LinkedIn to increase visibility to recruiters" },
                { icon:"🐙", tip:"Add GitHub to showcase your projects and code" },
                { icon:"📝", tip:"Write a bio to stand out from other candidates" },
              ].map((t, i) => (
                <div key={i} style={{ display:"flex", gap:"0.6rem", alignItems:"flex-start" }}>
                  <span style={{ fontSize:"0.9rem", flexShrink:0 }}>{t.icon}</span>
                  <span style={{ color:"#64748b", fontSize:"0.78rem", lineHeight:1.4 }}>{t.tip}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}