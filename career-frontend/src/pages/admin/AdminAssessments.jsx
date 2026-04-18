import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import Toast from "../../components/Toast";
import Spinner from "../../components/Spinner";

const TOPICS = ["HTML & CSS Basics","JavaScript Fundamentals","React.js","Node.js & Express","MongoDB & Databases","Python Basics","Data Structures & Algorithms","Cybersecurity Basics","Machine Learning"];

const TOPIC_ICONS  = { "HTML & CSS Basics":"🎨","JavaScript Fundamentals":"⚡","React.js":"⚛️","Node.js & Express":"🟢","MongoDB & Databases":"🍃","Python Basics":"🐍","Data Structures & Algorithms":"🧠","Cybersecurity Basics":"🔐","Machine Learning":"🤖" };
const TOPIC_COLORS = { "HTML & CSS Basics":"#ea580c","JavaScript Fundamentals":"#d97706","React.js":"#2563eb","Node.js & Express":"#65a30d","MongoDB & Databases":"#059669","Python Basics":"#059669","Data Structures & Algorithms":"#7c3aed","Cybersecurity Basics":"#dc2626","Machine Learning":"#db2777" };

const SAMPLE_QUESTIONS = {
  "HTML & CSS Basics": [
    { question:"What does HTML stand for?", options:["Hyper Text Markup Language","High Tech Modern Language","Hyper Transfer Markup Language","None of the above"], correctAnswer:0, explanation:"HTML stands for Hyper Text Markup Language — the standard for web pages." },
    { question:"Which CSS property controls text size?", options:["font-weight","text-size","font-size","text-style"], correctAnswer:2, explanation:"font-size controls the size of text in CSS." },
    { question:"Which tag creates the largest heading?", options:["<h6>","<h1>","<heading>","<head>"], correctAnswer:1, explanation:"<h1> is the largest heading tag in HTML." },
    { question:"What does CSS stand for?", options:["Computer Style Sheets","Creative Style Sheets","Cascading Style Sheets","Colorful Style Sheets"], correctAnswer:2, explanation:"CSS stands for Cascading Style Sheets." },
    { question:"Which property changes background color?", options:["color","bgcolor","background-color","bg-color"], correctAnswer:2, explanation:"background-color is the correct CSS property." },
  ],
  "JavaScript Fundamentals": [
    { question:"Which keyword declares a variable that cannot be reassigned?", options:["var","let","const","static"], correctAnswer:2, explanation:"const declares a block-scoped variable that cannot be reassigned." },
    { question:"What is the output of typeof null?", options:["null","undefined","object","string"], correctAnswer:2, explanation:"typeof null returns 'object' — a known JavaScript quirk." },
    { question:"Which method adds an element to the end of an array?", options:["push()","pop()","shift()","unshift()"], correctAnswer:0, explanation:"push() adds one or more elements to the end of an array." },
    { question:"What does === check in JavaScript?", options:["Only value","Only type","Both value and type","Neither"], correctAnswer:2, explanation:"=== is strict equality — checks both value and type." },
    { question:"Which is NOT a JavaScript data type?", options:["String","Boolean","Float","Undefined"], correctAnswer:2, explanation:"Float is not a JavaScript data type. Numbers are all type 'number'." },
  ],
  "React.js": [
    { question:"What hook is used to manage state in functional components?", options:["useEffect","useContext","useState","useRef"], correctAnswer:2, explanation:"useState is the hook used to add state to functional components." },
    { question:"What does useEffect do?", options:["Manages state","Handles side effects","Creates context","Manages refs"], correctAnswer:1, explanation:"useEffect handles side effects like API calls and DOM manipulation." },
    { question:"What is JSX?", options:["A JavaScript library","A syntax extension for JavaScript","A CSS framework","A database query language"], correctAnswer:1, explanation:"JSX is a syntax extension that allows writing HTML-like code inside JavaScript." },
    { question:"How do you pass data from parent to child in React?", options:["State","Refs","Props","Context"], correctAnswer:2, explanation:"Props are used to pass data from parent to child components." },
    { question:"Which method re-renders a React component?", options:["forceUpdate()","setState()","render()","update()"], correctAnswer:1, explanation:"Calling setState() triggers a re-render of the component." },
  ],
  "Node.js & Express": [
    { question:"What is Node.js?", options:["A browser","A JavaScript runtime built on Chrome's V8 engine","A CSS framework","A database"], correctAnswer:1, explanation:"Node.js is a JavaScript runtime environment built on Chrome's V8 engine." },
    { question:"Which method handles a GET request in Express?", options:["app.post()","app.get()","app.put()","app.request()"], correctAnswer:1, explanation:"app.get() is used to define a route handler for GET HTTP requests." },
    { question:"What is middleware in Express?", options:["A database layer","A function that has access to req and res objects","A frontend framework","A testing library"], correctAnswer:1, explanation:"Middleware functions have access to the request, response, and next function." },
    { question:"Which module creates an HTTP server in Node.js?", options:["fs","path","http","url"], correctAnswer:2, explanation:"The http module is used to create HTTP servers in Node.js." },
    { question:"What does npm stand for?", options:["Node Package Module","Node Project Manager","Node Package Manager","New Project Module"], correctAnswer:2, explanation:"npm stands for Node Package Manager." },
  ],
  "MongoDB & Databases": [
    { question:"MongoDB stores data in what format?", options:["Tables","XML","JSON-like documents","CSV"], correctAnswer:2, explanation:"MongoDB stores data in BSON (Binary JSON) format." },
    { question:"Which command finds all documents in a collection?", options:["db.collection.findAll()","db.collection.find({})","db.collection.getAll()","db.collection.select()"], correctAnswer:1, explanation:"db.collection.find({}) returns all documents in a MongoDB collection." },
    { question:"What is Mongoose?", options:["A MongoDB GUI","An ODM library for MongoDB and Node.js","A database itself","A REST API framework"], correctAnswer:1, explanation:"Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js." },
    { question:"Which MongoDB operator updates a field?", options:["$set","$update","$change","$modify"], correctAnswer:0, explanation:"$set is the MongoDB operator used to update the value of a field." },
    { question:"What is a MongoDB collection?", options:["A row in a table","A database connection","A group of documents","A schema definition"], correctAnswer:2, explanation:"A collection in MongoDB is a group of documents, similar to a table in SQL." },
  ],
  "Python Basics": [
    { question:"What is the correct way to create a function in Python?", options:["function myFunc():","def myFunc():","create myFunc():","fun myFunc():"], correctAnswer:1, explanation:"In Python, functions are defined using the 'def' keyword." },
    { question:"Which data type is mutable in Python?", options:["String","Tuple","List","Integer"], correctAnswer:2, explanation:"Lists are mutable in Python — you can add, remove, or change elements." },
    { question:"What does len() function do?", options:["Returns last element","Returns length of an object","Deletes an element","Converts to string"], correctAnswer:1, explanation:"len() returns the number of items in an object." },
    { question:"Which symbol is used for comments in Python?", options:["//","/*","#","--"], correctAnswer:2, explanation:"# is used for single-line comments in Python." },
    { question:"What is the output of print(2 ** 3)?", options:["6","8","9","5"], correctAnswer:1, explanation:"** is the exponentiation operator. 2**3 = 8." },
  ],
  "Data Structures & Algorithms": [
    { question:"What is the time complexity of binary search?", options:["O(n)","O(n²)","O(log n)","O(1)"], correctAnswer:2, explanation:"Binary search has O(log n) time complexity." },
    { question:"Which data structure uses LIFO order?", options:["Queue","Stack","Tree","Graph"], correctAnswer:1, explanation:"Stack uses Last In First Out (LIFO)." },
    { question:"What is a linked list?", options:["An array with fixed size","A linear data structure where elements are linked using pointers","A type of binary tree","A hash table"], correctAnswer:1, explanation:"A linked list is a linear data structure where each node contains data and a pointer to the next node." },
    { question:"Which sorting algorithm has the best average case time complexity?", options:["Bubble Sort","Selection Sort","Quick Sort","Insertion Sort"], correctAnswer:2, explanation:"Quick Sort has an average case time complexity of O(n log n)." },
    { question:"What is a hash table?", options:["A sorted array","A data structure that maps keys to values using a hash function","A type of linked list","A binary search tree"], correctAnswer:1, explanation:"A hash table maps keys to values using a hash function, allowing O(1) average case lookups." },
  ],
  "Cybersecurity Basics": [
    { question:"What does HTTPS stand for?", options:["Hyper Text Transfer Protocol Secure","High Transfer Protocol System","Hyper Transfer Procedure Secure","None"], correctAnswer:0, explanation:"HTTPS stands for Hyper Text Transfer Protocol Secure." },
    { question:"What is a firewall?", options:["A type of virus","A network security system that monitors traffic","A password manager","A type of encryption"], correctAnswer:1, explanation:"A firewall monitors and controls network traffic based on security rules." },
    { question:"What is phishing?", options:["A type of encryption","A network protocol","A cyberattack that tricks users into revealing sensitive information","A type of firewall"], correctAnswer:2, explanation:"Phishing tricks users into revealing passwords or credit card numbers." },
    { question:"What does SQL injection do?", options:["Speeds up queries","Inserts malicious SQL code to manipulate a database","Encrypts data","Creates backups"], correctAnswer:1, explanation:"SQL injection inserts malicious SQL statements to manipulate the database." },
    { question:"What is two-factor authentication (2FA)?", options:["Using two passwords","A security process requiring two forms of verification","Encrypting data twice","A type of firewall"], correctAnswer:1, explanation:"2FA adds an extra layer of security by requiring two forms of verification." },
  ],
  "Machine Learning": [
    { question:"What is supervised learning?", options:["Learning without labels","Learning with labeled training data","Learning through rewards","Learning from clusters"], correctAnswer:1, explanation:"Supervised learning uses labeled training data to train models." },
    { question:"Which algorithm is used for classification?", options:["Linear Regression","K-Means","Decision Tree","PCA"], correctAnswer:2, explanation:"Decision Tree is commonly used for classification tasks." },
    { question:"What is overfitting?", options:["Model performs well on all data","Model performs poorly on training data","Model memorizes training data but fails on new data","Model is too simple"], correctAnswer:2, explanation:"Overfitting occurs when a model memorizes training data and fails to generalize." },
    { question:"What does 'feature' mean in ML?", options:["A bug in the model","An input variable used for prediction","The output label","The training algorithm"], correctAnswer:1, explanation:"A feature is an individual measurable property used as input for prediction." },
    { question:"Which library is most used for ML in Python?", options:["React","Scikit-learn","Express","MongoDB"], correctAnswer:1, explanation:"Scikit-learn is the most widely used ML library in Python." },
  ],
};

const BLANK_Q  = { question:"", options:["","","",""], correctAnswer:0, explanation:"" };
const makeBlank = () => ({ topic:"HTML & CSS Basics", difficulty:"Beginner", duration:10, questions:[{ ...BLANK_Q }] });

const inp = {
  padding:"9px 12px", borderRadius:7, border:"1px solid #e2e8f0",
  background:"#ffffff", color:"#0f172a", fontSize:"0.875rem",
  width:"100%", fontFamily:"'DM Sans', sans-serif", outline:"none",
  boxSizing:"border-box", transition:"border-color 0.2s, box-shadow 0.2s",
};
const focusH = {
  onFocus: e => { e.target.style.borderColor="#7c3aed"; e.target.style.boxShadow="0 0 0 3px #7c3aed18"; },
  onBlur:  e => { e.target.style.borderColor="#e2e8f0"; e.target.style.boxShadow="none"; },
};

const DIFF_COLOR  = { Beginner:"#059669", Intermediate:"#d97706", Advanced:"#dc2626" };
const DIFF_BG     = { Beginner:"#ecfdf5", Intermediate:"#fffbeb", Advanced:"#fef2f2" };
const DIFF_BORDER = { Beginner:"#a7f3d0", Intermediate:"#fde68a", Advanced:"#fecaca" };

const FALLBACK = [
  { _id:"js1", topic:"JavaScript Fundamentals", difficulty:"Beginner",     duration:10, isActive:true, questions:[{},{},{},{},{}] },
  { _id:"re1", topic:"React.js",                difficulty:"Intermediate", duration:12, isActive:true, questions:[{},{},{},{},{}] },
  { _id:"py1", topic:"Python Basics",           difficulty:"Beginner",     duration:10, isActive:true, questions:[{},{},{},{},{}] },
];

export default function AdminAssessments() {
  const [list,    setList]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(makeBlank());
  const [saving,  setSaving]  = useState(false);
  const [preview, setPreview] = useState(false);
  const [toast,   setToast]   = useState({ msg:"", type:"" });

  const showToast = (msg, type="success") => { setToast({ msg, type }); setTimeout(()=>setToast({msg:"",type:""}),3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try { const d = await api("/admin/assessments"); setList(d.assessments?.length ? d.assessments : FALLBACK); }
    catch { setList(FALLBACK); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const autoFill = () => {
    const samples = SAMPLE_QUESTIONS[form.topic];
    if (!samples) return showToast("No sample questions for this topic.", "error");
    setForm(f => ({ ...f, questions:samples.map(q=>({...q})) }));
    showToast(`✅ ${samples.length} sample questions loaded for ${form.topic}!`);
  };

  const addQuestion    = () => setForm(f => ({ ...f, questions:[...f.questions,{...BLANK_Q}] }));
  const removeQuestion = (i) => setForm(f => ({ ...f, questions:f.questions.filter((_,j)=>j!==i) }));
  const updateQ        = (i,field,value) => setForm(f => { const qs=[...f.questions]; qs[i]={...qs[i],[field]:value}; return {...f,questions:qs}; });
  const updateOpt      = (qi,oi,value) => setForm(f => { const qs=[...f.questions]; const opts=[...qs[qi].options]; opts[oi]=value; qs[qi]={...qs[qi],options:opts}; return {...f,questions:qs}; });

  const save = async () => {
    const invalid = form.questions.some(q => !q.question || q.options.some(o=>!o));
    if (invalid) return showToast("Please fill all questions and options.", "error");
    setSaving(true);
    try {
      await api("/admin/assessments", { method:"POST", body:JSON.stringify(form) });
      showToast("Assessment created! 🎉");
      setModal(false); setForm(makeBlank()); setPreview(false); load();
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Remove this assessment?")) return;
    try { await api(`/admin/assessments/${id}`, { method:"DELETE" }); showToast("Removed."); load(); }
    catch (err) { showToast(err.message, "error"); }
  };

  const tc = TOPIC_COLORS[form.topic] || "#7c3aed";
  const filledCount = form.questions.filter(q => q.question.trim() && q.options.every(o=>o.trim())).length;

  return (
    <div>
      <Toast {...toast} />

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.8rem" }}>
        <div>
          <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:"1.75rem", fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em" }}>📝 Manage Assessments</h1>
          <p style={{ color:"#64748b", marginTop:4, fontSize:"0.9rem" }}>Create and manage skill quizzes</p>
        </div>
        <button onClick={() => { setForm(makeBlank()); setPreview(false); setModal(true); }} style={{
          padding:"9px 20px", borderRadius:8, border:"none",
          background:"#7c3aed", color:"#fff", fontWeight:600,
          cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontSize:"0.875rem",
          boxShadow:"0 2px 8px #7c3aed44", transition:"background 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background="#6d28d9"}
          onMouseLeave={e => e.currentTarget.style.background="#7c3aed"}
        >＋ New Assessment</button>
      </div>

      {loading ? <div style={{ textAlign:"center", padding:"3rem" }}><Spinner /></div> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:"1rem" }}>
          {list.map((a, i) => {
            const atc = TOPIC_COLORS[a.topic] || "#7c3aed";
            return (
              <div key={a._id||i} style={{ background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:12, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.04)", transition:"box-shadow 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.08)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.04)"}
              >
                <div style={{ height:3, background:atc }} />
                <div style={{ padding:"1.3rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ width:42, height:42, borderRadius:10, background:`${atc}12`, border:`1px solid ${atc}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem" }}>
                      {TOPIC_ICONS[a.topic]||"📝"}
                    </div>
                    <span style={{ padding:"2px 8px", borderRadius:6, fontSize:"0.7rem", fontWeight:600, background:a.isActive?"#ecfdf5":"#fef2f2", color:a.isActive?"#059669":"#dc2626", border:`1px solid ${a.isActive?"#a7f3d0":"#fecaca"}` }}>
                      {a.isActive?"Active":"Inactive"}
                    </span>
                  </div>
                  <h3 style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, color:"#0f172a", marginTop:"0.8rem", fontSize:"0.9rem" }}>{a.topic}</h3>
                  <div style={{ display:"flex", gap:6, marginTop:5, flexWrap:"wrap" }}>
                    <span style={{ padding:"2px 8px", borderRadius:20, fontSize:"0.7rem", fontWeight:600, background:DIFF_BG[a.difficulty]||"#f1f5f9", color:DIFF_COLOR[a.difficulty]||"#64748b", border:`1px solid ${DIFF_BORDER[a.difficulty]||"#e2e8f0"}` }}>{a.difficulty}</span>
                    <span style={{ color:"#94a3b8", fontSize:"0.76rem" }}>❓ {a.questions?.length||0}</span>
                    <span style={{ color:"#94a3b8", fontSize:"0.76rem" }}>⏱ {a.duration}m</span>
                  </div>
                  <button onClick={() => remove(a._id)} style={{ marginTop:"1rem", width:"100%", padding:"7px", borderRadius:7, border:"1px solid #fecaca", background:"#fff5f5", color:"#dc2626", cursor:"pointer", fontSize:"0.8rem", fontWeight:500 }}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}
          onClick={e => e.target===e.currentTarget && setModal(false)}>
          <div style={{ background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:16, padding:"2rem", width:"100%", maxWidth:640, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
              <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, color:"#0f172a", fontSize:"1.15rem" }}>＋ Create Assessment</h2>
              <div style={{ display:"flex", background:"#f1f5f9", borderRadius:8, padding:3, gap:3 }}>
                {["Edit","Preview"].map(t => (
                  <button key={t} onClick={() => setPreview(t==="Preview")} style={{
                    padding:"4px 13px", borderRadius:6, border:"none", cursor:"pointer",
                    background:(preview?(t==="Preview"):(t==="Edit"))?"#7c3aed":"transparent",
                    color:(preview?(t==="Preview"):(t==="Edit"))?"#fff":"#64748b",
                    fontSize:"0.8rem", fontFamily:"'DM Sans', sans-serif", fontWeight:600,
                    transition:"all 0.15s",
                  }}>{t}</button>
                ))}
              </div>
            </div>

            {!preview ? (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.9rem", marginBottom:"1rem" }}>
                  <div>
                    <label style={{ color:"#475569", fontSize:"0.76rem", fontWeight:600, display:"block", marginBottom:5 }}>Topic</label>
                    <input list="topics" value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} placeholder="Type a new topic or choose one" style={{ ...inp }} {...focusH} />
                    <datalist id="topics">
                      {TOPICS.map(t => <option key={t} value={t} />)}
                    </datalist>
                    <div style={{ marginTop:6, color:'#94a3b8', fontSize:'0.72rem' }}>Auto-fill works for predefined topics, but you can enter any custom topic here.</div>
                  </div>
                  <div>
                    <label style={{ color:"#475569", fontSize:"0.76rem", fontWeight:600, display:"block", marginBottom:5 }}>Difficulty</label>
                    <select value={form.difficulty} onChange={e=>setForm({...form,difficulty:e.target.value})} style={{ ...inp, cursor:"pointer" }} {...focusH}>
                      {["Beginner","Intermediate","Advanced"].map(d=><option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ color:"#475569", fontSize:"0.76rem", fontWeight:600, display:"block", marginBottom:5 }}>Duration (min)</label>
                    <input type="number" value={form.duration} min={1} max={60} onChange={e=>setForm({...form,duration:Number(e.target.value)})} style={inp} {...focusH} />
                  </div>
                </div>

                {/* Auto-fill */}
                <div style={{ marginBottom:"1rem", padding:"0.8rem 1rem", background:`${tc}08`, border:`1px solid ${tc}22`, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1rem" }}>
                  <div>
                    <div style={{ color:"#0f172a", fontSize:"0.82rem", fontWeight:600 }}>
                      {TOPIC_ICONS[form.topic]||"📝"} Auto-fill sample questions for <span style={{ color:tc }}>{form.topic}</span>
                    </div>
                    <div style={{ color:"#94a3b8", fontSize:"0.72rem" }}>Loads 5 pre-built questions. You can edit them after.</div>
                  </div>
                  <button onClick={autoFill} style={{ flexShrink:0, padding:"5px 13px", borderRadius:7, border:`1px solid ${tc}33`, background:`${tc}12`, color:tc, cursor:"pointer", fontSize:"0.78rem", fontFamily:"'DM Sans', sans-serif", fontWeight:600 }}>⚡ Auto-fill</button>
                </div>

                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.7rem" }}>
                  <span style={{ color:"#475569", fontSize:"0.8rem", fontWeight:600 }}>Questions</span>
                  <span style={{ padding:"2px 10px", borderRadius:20, fontSize:"0.72rem", fontWeight:700, background:filledCount===form.questions.length?"#ecfdf5":"#fffbeb", color:filledCount===form.questions.length?"#059669":"#d97706", border:`1px solid ${filledCount===form.questions.length?"#a7f3d0":"#fde68a"}` }}>
                    {filledCount}/{form.questions.length} filled
                  </span>
                </div>

                {form.questions.map((q, qi) => (
                  <div key={qi} style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"1.1rem", marginBottom:"0.8rem" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.7rem" }}>
                      <span style={{ color:"#7c3aed", fontWeight:700, fontSize:"0.82rem" }}>
                        Q{qi+1} {q.question.trim()&&q.options.every(o=>o.trim())&&<span style={{ color:"#059669" }}>✓</span>}
                      </span>
                      {form.questions.length > 1 && (
                        <button onClick={() => removeQuestion(qi)} style={{ background:"none", border:"none", color:"#dc2626", cursor:"pointer", fontSize:"0.78rem", fontWeight:500 }}>✕ Remove</button>
                      )}
                    </div>
                    <input value={q.question} placeholder="Enter your question here..." onChange={e => updateQ(qi,"question",e.target.value)} style={{ ...inp, marginBottom:"0.7rem" }} {...focusH} />
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5 }}>
                        <input type="radio" name={`correct_${qi}`} checked={q.correctAnswer===oi} onChange={() => updateQ(qi,"correctAnswer",oi)} style={{ accentColor:"#059669", cursor:"pointer", flexShrink:0 }} />
                        <input value={opt} placeholder={`Option ${String.fromCharCode(65+oi)}`} onChange={e => updateOpt(qi,oi,e.target.value)}
                          style={{ ...inp, flex:1, borderColor:q.correctAnswer===oi?"#a7f3d0":"#e2e8f0", background:q.correctAnswer===oi?"#ecfdf5":"#ffffff" }} {...focusH} />
                        {q.correctAnswer===oi && <span style={{ color:"#059669", fontSize:"0.72rem", flexShrink:0, fontWeight:600 }}>✓ Correct</span>}
                      </div>
                    ))}
                    <div style={{ marginTop:"0.5rem" }}>
                      <label style={{ color:"#94a3b8", fontSize:"0.72rem", display:"block", marginBottom:3 }}>💡 Explanation (shown after quiz)</label>
                      <input value={q.explanation||""} placeholder="Why is this the correct answer?" onChange={e => updateQ(qi,"explanation",e.target.value)} style={{ ...inp, fontSize:"0.82rem", borderColor:"#ddd6fe", background:"#f5f3ff" }} {...focusH} />
                    </div>
                  </div>
                ))}

                <button onClick={addQuestion} style={{ width:"100%", padding:"9px", borderRadius:8, border:"1px dashed #e2e8f0", background:"transparent", color:"#94a3b8", cursor:"pointer", marginBottom:"1.4rem", fontSize:"0.875rem", fontFamily:"'DM Sans', sans-serif" }}>＋ Add Question</button>
              </>
            ) : (
              <div style={{ marginBottom:"1.4rem" }}>
                <div style={{ background:"#f8fafc", border:`1px solid ${tc}22`, borderRadius:12, padding:"1.1rem 1.3rem", marginBottom:"1rem", display:"flex", alignItems:"center", gap:"1rem" }}>
                  <div style={{ width:46, height:46, borderRadius:12, background:`${tc}12`, border:`1px solid ${tc}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem" }}>{TOPIC_ICONS[form.topic]||"📝"}</div>
                  <div>
                    <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, color:"#0f172a", fontSize:"1rem" }}>{form.topic}</div>
                    <div style={{ display:"flex", gap:8, marginTop:3 }}>
                      <span style={{ padding:"2px 8px", borderRadius:20, fontSize:"0.7rem", fontWeight:600, background:DIFF_BG[form.difficulty]||"#f1f5f9", color:DIFF_COLOR[form.difficulty]||"#64748b", border:`1px solid ${DIFF_BORDER[form.difficulty]||"#e2e8f0"}` }}>{form.difficulty}</span>
                      <span style={{ color:"#94a3b8", fontSize:"0.76rem" }}>❓ {form.questions.length} questions</span>
                      <span style={{ color:"#94a3b8", fontSize:"0.76rem" }}>⏱ {form.duration} min</span>
                    </div>
                  </div>
                </div>

                {form.questions.map((q, qi) => (
                  <div key={qi} style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"1.1rem", marginBottom:"0.7rem" }}>
                    <div style={{ color:"#0f172a", fontWeight:600, marginBottom:"0.7rem", fontSize:"0.875rem" }}>
                      Q{qi+1}. {q.question || <span style={{ color:"#dc2626", fontStyle:"italic" }}>⚠ Question not filled</span>}
                    </div>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={{ padding:"7px 10px", borderRadius:7, marginBottom:5, background:q.correctAnswer===oi?"#ecfdf5":"#ffffff", border:`1px solid ${q.correctAnswer===oi?"#a7f3d0":"#e2e8f0"}`, display:"flex", alignItems:"center", gap:7 }}>
                        <span style={{ width:20, height:20, borderRadius:"50%", flexShrink:0, background:q.correctAnswer===oi?"#dcfce7":"#f1f5f9", border:`1px solid ${q.correctAnswer===oi?"#a7f3d0":"#e2e8f0"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.68rem", fontWeight:700, color:q.correctAnswer===oi?"#059669":"#94a3b8" }}>{String.fromCharCode(65+oi)}</span>
                        <span style={{ color:q.correctAnswer===oi?"#059669":"#64748b", fontSize:"0.84rem" }}>{opt || <span style={{ color:"#dc262688", fontStyle:"italic" }}>empty</span>}</span>
                        {q.correctAnswer===oi && <span style={{ marginLeft:"auto", color:"#059669", fontSize:"0.72rem", fontWeight:600 }}>✓ Correct</span>}
                      </div>
                    ))}
                    {q.explanation && <div style={{ marginTop:"0.5rem", padding:"0.5rem 0.8rem", borderRadius:7, background:"#f5f3ff", border:"1px solid #ddd6fe", color:"#64748b", fontSize:"0.76rem" }}>💡 {q.explanation}</div>}
                  </div>
                ))}

                <div style={{ padding:"0.75rem 1rem", borderRadius:9, background:filledCount===form.questions.length?"#ecfdf5":"#fffbeb", border:`1px solid ${filledCount===form.questions.length?"#a7f3d0":"#fde68a"}`, color:filledCount===form.questions.length?"#059669":"#d97706", fontSize:"0.8rem", fontWeight:500 }}>
                  {filledCount===form.questions.length ? `✅ All ${form.questions.length} questions are complete! Ready to save.` : `⚠ ${form.questions.length-filledCount} question(s) still need to be filled.`}
                </div>
              </div>
            )}

            <div style={{ display:"flex", gap:"0.8rem" }}>
              <button onClick={save} disabled={saving} style={{ flex:1, padding:"11px", borderRadius:8, border:"none", background:saving?"#94a3b8":"#7c3aed", color:"#fff", fontWeight:600, cursor:saving?"not-allowed":"pointer", fontFamily:"'DM Sans', sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:7, boxShadow:saving?"none":"0 2px 8px #7c3aed44" }}>
                {saving ? <><Spinner /> Saving...</> : "Create Assessment"}
              </button>
              <button onClick={() => { setModal(false); setForm(makeBlank()); setPreview(false); }} style={{ padding:"11px 18px", borderRadius:8, border:"1px solid #e2e8f0", background:"#f8fafc", color:"#64748b", cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}