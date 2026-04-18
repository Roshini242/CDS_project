import { useState } from "react";
import { Auth } from "../services/api";
import Toast from "../components/Toast";
import Spinner from "../components/Spinner";

const inp = {
  padding:"10px 13px", borderRadius:"8px", border:"1px solid #e2e8f0",
  background:"#ffffff", color:"#0f172a", fontSize:"0.875rem",
  width:"100%", fontFamily:"'DM Sans', sans-serif", outline:"none",
  boxSizing:"border-box", transition:"border-color 0.2s, box-shadow 0.2s",
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

  const COMPLETION_ITEMS = [
    { key:"name",       label:"Full Name",   icon:"👤", weight:15 },
    { key:"bio",        label:"Bio",         icon:"📝", weight:15 },
    { key:"skills",     label:"Skills",      icon:"🛠️", weight:20 },
    { key:"education",  label:"Education",   icon:"🎓", weight:10 },
    { key:"phone",      label:"Phone",       icon:"📞", weight:5  },
    { key:"location",   label:"Location",    icon:"📍", weight:5  },
    { key:"careerPath", label:"Career Path", icon:"🎯", weight:20 },
    { key:"linkedIn",   label:"LinkedIn",    icon:"💼", weight:5  },
    { key:"github",     label:"GitHub",      icon:"🐙", weight:5  },
  ];

  const completed  = COMPLETION_ITEMS.filter(i => form[i.key]?.trim?.() || form[i.key]);
  const missing    = COMPLETION_ITEMS.filter(i => !form[i.key]?.trim?.() && !form[i.key]);
  const completion = completed.reduce((sum, i) => sum + i.weight, 0);
  const barColor   = completion >= 80 ? "#059669" : completion >= 50 ? "#d97706" : "#dc2626";
  const barBg      = completion >= 80 ? "#ecfdf5" : completion >= 50 ? "#fffbeb" : "#fef2f2";

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

  const focusStyle = (key) => ({
    ...inp,
    borderColor: form[key]?.trim?.() ? "#bfdbfe" : "#e2e8f0",
  });

  const handleFocus = e => { e.target.style.borderColor="#2563eb"; e.target.style.boxShadow="0 0 0 3px #2563eb18"; };
  const handleBlur  = (key) => (e) => { e.target.style.borderColor=form[key]?.trim?.() ?"#bfdbfe":"#e2e8f0"; e.target.style.boxShadow="none"; };

  const fields = [
    { label:"Full Name", key:"name",      placeholder:"Your full name"        },
    { label:"Phone",     key:"phone",     placeholder:"+91 XXXXX XXXXX"       },
    { label:"Education", key:"education", placeholder:"B.E Computer Science"  },
    { label:"Location",  key:"location",  placeholder:"Chennai, India"        },
    { label:"LinkedIn",  key:"linkedIn",  placeholder:"linkedin.com/in/..."   },
    { label:"GitHub",    key:"github",    placeholder:"github.com/..."        },
  ];

  return (
    <div style={{ paddingTop:80, minHeight:"100vh", background:"#f8fafc", padding:"80px 2rem 3rem", maxWidth:920, margin:"0 auto" }}>
      <Toast {...toast} />
      <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:"1.75rem", fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em", marginBottom:4 }}>👤 My Profile</h1>
      <p style={{ color:"#64748b", marginBottom:"2rem", fontSize:"0.9rem" }}>Keep your profile complete for better job matches</p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:"1.2rem", alignItems:"start" }}>

        {/* ── Left: Form ── */}
        <div style={{ background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:14, padding:"1.8rem", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
            {fields.map(f => (
              <div key={f.key}>
                <label style={{ color:"#475569", fontSize:"0.78rem", fontWeight:600, display:"block", marginBottom:5 }}>{f.label}</label>
                <input
                  value={form[f.key]} placeholder={f.placeholder}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={focusStyle(f.key)}
                  onFocus={handleFocus}
                  onBlur={handleBlur(f.key)}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop:"1rem" }}>
            <label style={{ color:"#475569", fontSize:"0.78rem", fontWeight:600, display:"block", marginBottom:5 }}>Bio</label>
            <textarea
              value={form.bio} placeholder="Tell us about yourself..."
              onChange={e => setForm({ ...form, bio: e.target.value })}
              rows={3} style={{ ...focusStyle("bio"), resize:"vertical" }}
              onFocus={handleFocus}
              onBlur={handleBlur("bio")}
            />
          </div>

          <div style={{ marginTop:"1rem" }}>
            <label style={{ color:"#475569", fontSize:"0.78rem", fontWeight:600, display:"block", marginBottom:5 }}>Skills <span style={{ color:"#94a3b8", fontWeight:400 }}>(comma separated)</span></label>
            <input
              value={form.skills} placeholder="React, Node.js, Python, Figma..."
              onChange={e => setForm({ ...form, skills: e.target.value })}
              style={focusStyle("skills")}
              onFocus={handleFocus}
              onBlur={handleBlur("skills")}
            />
          </div>

          <div style={{ marginTop:"1rem" }}>
            <label style={{ color:"#475569", fontSize:"0.78rem", fontWeight:600, display:"block", marginBottom:5 }}>Career Path</label>
            <select
              value={form.careerPath}
              onChange={e => setForm({ ...form, careerPath: e.target.value })}
              style={{ ...focusStyle("careerPath"), cursor:"pointer" }}
              onFocus={handleFocus}
              onBlur={handleBlur("careerPath")}
            >
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
            marginTop:"1.5rem", padding:"11px 24px", borderRadius:8, border:"none",
            background: loading ? "#94a3b8" : "#2563eb",
            color:"#fff", fontSize:"0.9rem", fontWeight:600,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily:"'DM Sans', sans-serif",
            display:"flex", alignItems:"center", gap:8,
            transition:"background 0.2s",
            boxShadow: loading ? "none" : "0 2px 8px #2563eb44",
          }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background="#1d4ed8"; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background="#2563eb"; }}
          >
            {loading ? <><Spinner /> Saving...</> : "Save Profile"}
          </button>
        </div>

        {/* ── Right: Completion ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>

          {/* Completion card */}
          <div style={{ background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:14, padding:"1.4rem", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, color:"#0f172a", marginBottom:"1rem", fontSize:"0.95rem" }}>
              📊 Profile Completion
            </div>

            <div style={{ textAlign:"center", marginBottom:"1rem", padding:"1rem", background:barBg, borderRadius:10 }}>
              <div style={{ fontFamily:"'Syne', sans-serif", fontSize:"2.5rem", fontWeight:800, color:barColor }}>{completion}%</div>
              <div style={{ color:barColor, fontSize:"0.78rem", fontWeight:600, marginTop:2 }}>
                {completion === 100 ? "🎉 Perfect profile!" : completion >= 80 ? "Almost there!" : completion >= 50 ? "Good progress!" : "Just getting started!"}
              </div>
            </div>

            <div style={{ height:6, background:"#f1f5f9", borderRadius:3, marginBottom:"1.2rem" }}>
              <div style={{ width:`${completion}%`, height:"100%", borderRadius:3, background:barColor, transition:"width .4s ease" }} />
            </div>

            {completed.length > 0 && (
              <div style={{ marginBottom:"0.9rem" }}>
                <div style={{ color:"#059669", fontSize:"0.72rem", fontWeight:700, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.04em" }}>✅ Completed ({completed.length})</div>
                <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                  {completed.map((item, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:7, padding:"5px 8px", borderRadius:7, background:"#ecfdf5", border:"1px solid #a7f3d0" }}>
                      <span style={{ fontSize:"0.82rem" }}>{item.icon}</span>
                      <span style={{ color:"#059669", fontSize:"0.78rem", flex:1 }}>{item.label}</span>
                      <span style={{ color:"#86efac", fontSize:"0.7rem", fontWeight:600 }}>+{item.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {missing.length > 0 && (
              <div>
                <div style={{ color:"#d97706", fontSize:"0.72rem", fontWeight:700, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.04em" }}>⚠ Missing ({missing.length})</div>
                <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                  {missing.map((item, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:7, padding:"5px 8px", borderRadius:7, background:"#fffbeb", border:"1px solid #fde68a" }}>
                      <span style={{ fontSize:"0.82rem" }}>{item.icon}</span>
                      <span style={{ color:"#d97706", fontSize:"0.78rem", flex:1 }}>{item.label}</span>
                      <span style={{ color:"#fcd34d", fontSize:"0.7rem", fontWeight:600 }}>+{item.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tips card */}
          <div style={{ background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:14, padding:"1.4rem", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, color:"#0f172a", marginBottom:"0.9rem", fontSize:"0.95rem" }}>💡 Tips</div>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
              {[
                { icon:"🎯", tip:"Select a career path to get personalized roadmap and assessments" },
                { icon:"🛠️", tip:"Add your skills to improve job match accuracy" },
                { icon:"💼", tip:"Add LinkedIn to increase visibility to recruiters" },
                { icon:"🐙", tip:"Add GitHub to showcase your projects and code" },
                { icon:"📝", tip:"Write a bio to stand out from other candidates" },
              ].map((t, i) => (
                <div key={i} style={{ display:"flex", gap:"0.6rem", alignItems:"flex-start", padding:"6px 0", borderBottom:i<4?"1px solid #f1f5f9":"none" }}>
                  <span style={{ fontSize:"0.88rem", flexShrink:0 }}>{t.icon}</span>
                  <span style={{ color:"#64748b", fontSize:"0.78rem", lineHeight:1.5 }}>{t.tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}