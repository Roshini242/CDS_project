import { useState, useEffect, useCallback } from "react";
import { Roadmap } from "../services/api";
import Toast from "../components/Toast";
import Spinner from "../components/Spinner";

const COLORS = {
  webdev:        "#2563eb",
  datascience:   "#059669",
  uiux:          "#7c3aed",
  mobile:        "#d97706",
  cybersecurity: "#dc2626",
  cloud:         "#0891b2",
  ai:            "#7c3aed",
  devops:        "#ea580c",
  blockchain:    "#ca8a04",
  gamedev:       "#db2777",
};

const DIFFICULTY_COLOR = { Beginner:"#059669", Intermediate:"#d97706", Advanced:"#dc2626" };
const DIFFICULTY_BG    = { Beginner:"#ecfdf5", Intermediate:"#fffbeb", Advanced:"#fef2f2" };
const DIFFICULTY_BORDER= { Beginner:"#a7f3d0", Intermediate:"#fde68a", Advanced:"#fecaca" };

const RESOURCE_ICONS = {
  docs:"📄", course:"🎓", tutorial:"💻", book:"📚", blog:"✍️", video:"🎬",
};

const FALLBACK = {
  webdev: {
    label:"Web Developer", icon:"🌐", description:"Build modern websites and web applications",
    steps:[
      { id:"html_css",   title:"HTML & CSS Basics",       description:"Learn structure and styling of web pages.", duration:"2 weeks", difficulty:"Beginner",     skills:["HTML5","CSS3","Flexbox","Grid"],           resources:[{title:"MDN Web Docs",    url:"https://developer.mozilla.org",              type:"docs"   },{title:"FreeCodeCamp",  url:"https://www.freecodecamp.org",               type:"course" }], projects:["Portfolio Website","Landing Page"]       },
      { id:"javascript", title:"JavaScript Fundamentals", description:"Core programming concepts, DOM, ES6+.",    duration:"3 weeks", difficulty:"Beginner",     skills:["ES6+","DOM","Async/Await","Fetch API"],    resources:[{title:"JavaScript.info", url:"https://javascript.info",                   type:"docs"   },{title:"Eloquent JS",   url:"https://eloquentjavascript.net",             type:"book"   }], projects:["To-Do App","Weather App"]                },
      { id:"react",      title:"React Framework",         description:"Component-based UI development.",          duration:"3 weeks", difficulty:"Intermediate", skills:["Components","Hooks","State","Router"],     resources:[{title:"React Docs",      url:"https://react.dev",                         type:"docs"   },{title:"Scrimba React", url:"https://scrimba.com/learn/learnreact",       type:"course" }], projects:["Movie Search App","E-Commerce Frontend"] },
      { id:"nodejs",     title:"Node.js & Express",       description:"Backend development with JavaScript.",    duration:"2 weeks", difficulty:"Intermediate", skills:["REST APIs","Middleware","JWT","bcrypt"],    resources:[{title:"Node.js Docs",    url:"https://nodejs.org/en/docs",                 type:"docs"   },{title:"Express Guide", url:"https://expressjs.com",                      type:"docs"   }], projects:["REST API","Auth System"]                 },
      { id:"mongodb",    title:"MongoDB & Databases",     description:"NoSQL database for modern apps.",         duration:"2 weeks", difficulty:"Intermediate", skills:["CRUD","Mongoose","Aggregation","Indexes"], resources:[{title:"MongoDB Uni",     url:"https://university.mongodb.com",             type:"course" },{title:"Mongoose Docs", url:"https://mongoosejs.com/docs",                type:"docs"   }], projects:["Blog App","Student System"]              },
      { id:"deployment", title:"Deployment & DevOps",     description:"Deploy apps using Vercel or Netlify.",   duration:"1 week",  difficulty:"Intermediate", skills:["Git","CI/CD","Vercel","Env Variables"],    resources:[{title:"Vercel Docs",     url:"https://vercel.com/docs",                   type:"docs"   },{title:"GitHub Actions",url:"https://docs.github.com/en/actions",         type:"docs"   }], projects:["Deploy Portfolio","Full Stack Deploy"]   },
    ],
  },
  datascience:   { label:"Data Scientist",      icon:"📊", description:"Analyze data and build ML models",              steps:[] },
  uiux:          { label:"UI/UX Designer",      icon:"🎨", description:"Design beautiful user-friendly interfaces",     steps:[] },
  mobile:        { label:"Mobile Developer",    icon:"📱", description:"Build Android and iOS mobile applications",     steps:[] },
  cybersecurity: { label:"Cybersecurity",       icon:"🔐", description:"Protect systems from cyber threats",            steps:[] },
  cloud:         { label:"Cloud Engineer",      icon:"☁️", description:"Build and manage cloud infrastructure",         steps:[] },
  ai:            { label:"AI Engineer",         icon:"🤖", description:"Build intelligent AI applications",             steps:[] },
  devops:        { label:"DevOps Engineer",     icon:"⚙️", description:"Automate and streamline software delivery",     steps:[] },
  blockchain:    { label:"Blockchain Dev",      icon:"⛓️", description:"Build decentralized applications",              steps:[] },
  gamedev:       { label:"Game Developer",      icon:"🎮", description:"Create 2D and 3D video games from scratch",     steps:[] },
};

export default function RoadmapPage({ user }) {
  const [roadmap,  setRoadmap]  = useState(null);
  const [allPaths, setAllPaths] = useState(FALLBACK);
  const [selected, setSelected] = useState(user?.careerPath || "webdev");
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [toast,    setToast]    = useState({ msg:"", type:"" });

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:"", type:"" }), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rm, all] = await Promise.all([Roadmap.getMine(), Roadmap.getAll()]);
      setRoadmap(rm);
      setAllPaths(all.roadmaps || FALLBACK);
      setSelected(rm.careerPath || "webdev");
    } catch { /* use fallback */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (stepId, current) => {
    try {
      await Roadmap.updateProgress(stepId, !current);
      showToast(!current ? "Step completed! 🎉" : "Marked incomplete");
      load();
    } catch (err) { showToast(err.message, "error"); }
  };

  const pathData  = allPaths[selected] || {};
  const color     = COLORS[selected] || "#2563eb";
  const steps     = roadmap?.careerPath === selected
    ? roadmap.steps
    : (pathData.steps || []).map(s => ({ ...s, completed: false }));
  const done      = steps.filter(s => s.completed).length;
  const totalWeeks = steps.reduce((acc, s) => acc + (parseInt(s.duration) || 0), 0);

  return (
    <div className="page-container" style={{ paddingTop: 100, minHeight: "100vh" }}>
      <Toast {...toast} />

      {/* Header */}
      <div style={{ marginBottom:"1.5rem" }}>
        <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:"1.75rem", fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em" }}>
          🗺️ Career Roadmap
        </h1>
        <p style={{ color:"#64748b", marginTop:4, fontSize:"0.9rem" }}>
          Follow your path step by step — with resources and projects for each topic
        </p>
      </div>

      {/* Path Tabs */}
      <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
        {Object.entries(allPaths).map(([key, val]) => (
          <button key={key} onClick={() => setSelected(key)} style={{
            padding:"7px 14px", borderRadius:8, cursor:"pointer",
            border:`1px solid ${selected===key ? COLORS[key]||color : "#e2e8f0"}`,
            background: selected===key ? (COLORS[key]||color) : "#ffffff",
            color: selected===key ? "#ffffff" : "#64748b",
            fontFamily:"'DM Sans', sans-serif", fontWeight:500, fontSize:"0.82rem",
            transition:"all 0.2s", boxShadow: selected===key ? `0 2px 8px ${COLORS[key]||color}33` : "none",
          }}>{val.icon} {val.label}</button>
        ))}
      </div>

      {/* Stats Bar */}
      {steps.length > 0 && (
        <div style={{
          background:"#ffffff", border:"1px solid #e2e8f0",
          borderRadius:12, padding:"1.2rem 1.5rem",
          display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",
          gap:"1rem", marginBottom:"1.5rem",
          boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
        }}>
          {[
            { label:"Progress",       value:`${done}/${steps.length} steps`,                                          accent:color     },
            { label:"Completion",     value:`${steps.length ? Math.round((done/steps.length)*100) : 0}%`,             accent:color     },
            { label:"Total Duration", value:`~${totalWeeks} weeks`,                                                   accent:"#d97706" },
            { label:"Status",         value: done===steps.length ? "Completed 🏆" : done===0 ? "Not Started" : "In Progress",
              accent: done===steps.length ? "#059669" : done===0 ? "#64748b" : "#d97706" },
          ].map((s,i) => (
            <div key={i}>
              <div style={{ color:"#94a3b8", fontSize:"0.72rem", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:4 }}>{s.label}</div>
              <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, color:s.accent, fontSize:"0.95rem" }}>{s.value}</div>
            </div>
          ))}
          <div style={{ gridColumn:"1/-1" }}>
            <div style={{ height:6, background:"#f1f5f9", borderRadius:3 }}>
              <div style={{
                width:`${steps.length ? (done/steps.length)*100 : 0}%`,
                height:"100%", background:color, borderRadius:3, transition:"width .5s ease",
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Steps */}
      {loading ? (
        <div style={{ textAlign:"center", padding:"3rem" }}><Spinner /></div>
      ) : steps.map((step, i) => (
        <div key={i} style={{ display:"flex", gap:"1.2rem", marginBottom:"0.8rem" }}>

          {/* Step indicator */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
            <div onClick={() => toggle(step.id, step.completed)} style={{
              width:40, height:40, borderRadius:"50%", cursor:"pointer",
              background: step.completed ? color : "#ffffff",
              border:`2px solid ${step.completed ? color : "#e2e8f0"}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              color: step.completed ? "#fff" : "#94a3b8",
              fontWeight:700, fontSize:"0.85rem", transition:"all .2s",
              boxShadow: step.completed ? `0 2px 8px ${color}44` : "0 1px 3px rgba(0,0,0,0.06)",
            }}>{step.completed ? "✓" : i+1}</div>
            {i < steps.length-1 && (
              <div style={{ width:2, flex:1, minHeight:16, marginTop:4, background: step.completed ? color+"55" : "#e2e8f0" }} />
            )}
          </div>

          {/* Step Card */}
          <div style={{
            flex:1, background:"#ffffff",
            border:`1px solid ${step.completed ? color+"33" : expanded===i ? color+"22" : "#e2e8f0"}`,
            borderRadius:12, marginBottom:4, overflow:"hidden",
            transition:"all .2s", boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
          }}>
            {step.completed && <div style={{ height:3, background:color }} />}

            {/* Card Header */}
            <div style={{ padding:"1.1rem 1.4rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:5 }}>
                    <h3 style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, color: step.completed ? color : "#0f172a", fontSize:"0.95rem" }}>
                      {step.title}
                    </h3>
                    {step.difficulty && (
                      <span style={{
                        padding:"2px 9px", borderRadius:20, fontSize:"0.7rem", fontWeight:600,
                        background: DIFFICULTY_BG[step.difficulty]||"#f1f5f9",
                        color: DIFFICULTY_COLOR[step.difficulty]||"#64748b",
                        border:`1px solid ${DIFFICULTY_BORDER[step.difficulty]||"#e2e8f0"}`,
                      }}>{step.difficulty}</span>
                    )}
                    {step.duration && (
                      <span style={{ color:"#94a3b8", fontSize:"0.76rem" }}>⏱ {step.duration}</span>
                    )}
                    {step.completed && (
                      <span style={{ padding:"2px 9px", borderRadius:20, fontSize:"0.7rem", fontWeight:600, background:"#ecfdf5", color:"#059669", border:"1px solid #a7f3d0" }}>✓ Done</span>
                    )}
                  </div>
                  <p style={{ color:"#64748b", fontSize:"0.84rem", lineHeight:1.5 }}>{step.description}</p>
                </div>

                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={() => setExpanded(expanded===i ? null : i)} style={{
                    padding:"5px 12px", borderRadius:7,
                    border:`1px solid #e2e8f0`, background:"#f8fafc",
                    color:"#64748b", cursor:"pointer", fontSize:"0.78rem",
                    fontFamily:"'DM Sans', sans-serif", transition:"all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=color+"44"; e.currentTarget.style.color=color; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.color="#64748b"; }}
                  >{expanded===i ? "Hide ↑" : "Details ↓"}</button>

                  {!step.completed && (
                    <button onClick={() => toggle(step.id, step.completed)} style={{
                      padding:"5px 12px", borderRadius:7, border:"none",
                      background:color, color:"#fff", cursor:"pointer",
                      fontSize:"0.78rem", fontFamily:"'DM Sans', sans-serif", fontWeight:600,
                      boxShadow:`0 2px 6px ${color}44`,
                    }}>Mark Done ✓</button>
                  )}
                </div>
              </div>

              {/* Skills */}
              {(step.skills||[]).length > 0 && (
                <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginTop:"0.7rem" }}>
                  {step.skills.map((sk,j) => (
                    <span key={j} style={{
                      padding:"2px 9px", borderRadius:6, fontSize:"0.72rem",
                      background:"#f1f5f9", color:"#64748b", border:"1px solid #e2e8f0",
                    }}>{sk}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Expanded Details */}
            {expanded===i && (
              <div style={{ borderTop:"1px solid #f1f5f9", padding:"1.1rem 1.4rem", background:"#fafafa" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>

                  {(step.resources||[]).length > 0 && (
                    <div>
                      <h4 style={{ color:"#475569", fontSize:"0.75rem", fontWeight:700, marginBottom:"0.7rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>
                        📚 Learning Resources
                      </h4>
                      {step.resources.map((r,j) => (
                        <a key={j} href={r.url} target="_blank" rel="noreferrer" style={{
                          display:"flex", alignItems:"center", gap:8,
                          padding:"7px 10px", borderRadius:7, marginBottom:5,
                          background:"#ffffff", border:"1px solid #e2e8f0",
                          textDecoration:"none", transition:"all .2s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor=color+"44"; e.currentTarget.style.boxShadow=`0 2px 8px ${color}11`; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.boxShadow="none"; }}
                        >
                          <span style={{ fontSize:"0.9rem" }}>{RESOURCE_ICONS[r.type]||"🔗"}</span>
                          <span style={{ color:"#334155", fontSize:"0.82rem", flex:1 }}>{r.title}</span>
                          <span style={{ color:color, fontSize:"0.72rem", fontWeight:600 }}>Open →</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {(step.projects||[]).length > 0 && (
                    <div>
                      <h4 style={{ color:"#475569", fontSize:"0.75rem", fontWeight:700, marginBottom:"0.7rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>
                        🛠️ Practice Projects
                      </h4>
                      {step.projects.map((p,j) => (
                        <div key={j} style={{
                          display:"flex", alignItems:"center", gap:8,
                          padding:"7px 10px", borderRadius:7, marginBottom:5,
                          background:"#ffffff", border:"1px solid #e2e8f0",
                        }}>
                          <span style={{ color:color, fontWeight:700 }}>▸</span>
                          <span style={{ color:"#334155", fontSize:"0.82rem" }}>{p}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Completion Banner */}
      {done === steps.length && steps.length > 0 && (
        <div style={{
          marginTop:"1.5rem", padding:"2rem", borderRadius:14, textAlign:"center",
          background:color, boxShadow:`0 8px 24px ${color}44`,
        }}>
          <div style={{ fontSize:"2.5rem", marginBottom:"0.5rem" }}>🏆</div>
          <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, color:"#fff", marginBottom:"0.4rem" }}>
            Roadmap Complete!
          </h2>
          <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"0.9rem" }}>
            Congratulations! You have completed all steps for {pathData.label}. You're ready for the job market!
          </p>
        </div>
      )}
    </div>
  );
}