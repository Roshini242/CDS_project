import { useState, useEffect, useRef, useCallback } from "react";
import { Assessment, Auth } from "../services/api";
import Spinner from "../components/Spinner";

// ── Career path → relevant topics mapping ────────────────────────────────────
const PATH_TOPICS = {
  // Web Developer — needs HTML, JS, React, Node, MongoDB
  webdev: [
    "HTML & CSS Basics",
    "JavaScript Fundamentals",
    "React.js",
    "Node.js & Express",
    "MongoDB & Databases",
  ],

  // Data Scientist — needs Python, stats, ML, data handling
  datascience: [
    "Python Basics",
    "Data Structures & Algorithms",
    "MongoDB & Databases",
  ],

  // UI/UX Designer — needs HTML/CSS, basic JS, React for prototyping
  uiux: [
    "HTML & CSS Basics",
    "JavaScript Fundamentals",
    "React.js",
  ],

  // Mobile Developer — needs JS, React Native base (React), Node for APIs
  mobile: [
    "JavaScript Fundamentals",
    "React.js",
    "Node.js & Express",
  ],

  // Cybersecurity Analyst — needs security, Python scripting, DSA for logic
  cybersecurity: [
    "Cybersecurity Basics",
    "Python Basics",
    "Data Structures & Algorithms",
  ],

  // Cloud Engineer — needs backend, DB, DSA for system design
  cloud: [
    "Node.js & Express",
    "MongoDB & Databases",
    "Data Structures & Algorithms",
  ],

  // AI Engineer — needs Python, ML, DSA heavily
  ai: [
    "Python Basics",
    "Data Structures & Algorithms",
    "MongoDB & Databases",
  ],

  // DevOps Engineer — needs scripting, backend, DSA for automation
  devops: [
    "Node.js & Express",
    "Data Structures & Algorithms",
    "MongoDB & Databases",
  ],

  // Blockchain Developer — needs JS, DSA for algorithms, Node for backend
  blockchain: [
    "JavaScript Fundamentals",
    "Data Structures & Algorithms",
    "Node.js & Express",
  ],

  // Game Developer — needs JS or Python for scripting, DSA for game logic
  gamedev: [
    "JavaScript Fundamentals",
    "Python Basics",
    "Data Structures & Algorithms",
  ],
};

const PATH_LABELS = {
  webdev:"Web Developer", datascience:"Data Scientist", uiux:"UI/UX Designer",
  mobile:"Mobile Developer", cybersecurity:"Cybersecurity Analyst", cloud:"Cloud Engineer",
  ai:"AI Engineer", devops:"DevOps Engineer", blockchain:"Blockchain Developer", gamedev:"Game Developer",
};

const PATH_ICONS = {
  webdev:"🌐", datascience:"📊", uiux:"🎨", mobile:"📱",
  cybersecurity:"🔐", cloud:"☁️", ai:"🤖", devops:"⚙️",
  blockchain:"⛓️", gamedev:"🎮",
};

// ── Constants ─────────────────────────────────────────────────────────────────
const DIFFICULTY_COLOR = { Beginner:"#10b981", Intermediate:"#f59e0b", Advanced:"#ef4444" };
const DIFFICULTY_BG    = { Beginner:"#10b98122", Intermediate:"#f59e0b22", Advanced:"#ef444422" };

const TOPIC_ICONS = {
  "JavaScript":"⚡","JavaScript Fundamentals":"⚡",
  "React.js":"⚛️","React":"⚛️",
  "Python":"🐍","Python Basics":"🐍",
  "Node.js & Express":"🟢","MongoDB & Databases":"🍃",
  "HTML & CSS Basics":"🎨","Data Structures & Algorithms":"🧠",
  "Cybersecurity Basics":"🔐","Machine Learning":"🤖",
};

const TOPIC_COLORS = {
  "JavaScript":"#f59e0b","JavaScript Fundamentals":"#f59e0b",
  "React.js":"#00d4ff","React":"#00d4ff",
  "Python":"#10b981","Python Basics":"#10b981",
  "Node.js & Express":"#84cc16","MongoDB & Databases":"#10b981",
  "HTML & CSS Basics":"#f97316","Data Structures & Algorithms":"#8b5cf6",
  "Cybersecurity Basics":"#ef4444","Machine Learning":"#ec4899",
};

const FALLBACK = [
  { _id:"js1", topic:"JavaScript Fundamentals", difficulty:"Beginner", duration:10, questions:[
    { question:"What does 'typeof null' return?",               options:["null","object","undefined","string"],       correctAnswer:1, explanation:"typeof null returns 'object' — a known JavaScript quirk." },
    { question:"Which method removes the last array element?",  options:["shift()","pop()","splice()","slice()"],     correctAnswer:1, explanation:"pop() removes and returns the last element of an array." },
    { question:"What is '2' + 2 in JavaScript?",               options:["4","22","NaN","Error"],                     correctAnswer:1, explanation:"String + Number = String concatenation. '2'+2 = '22'." },
    { question:"Which keyword creates a block-scoped variable?",options:["var","let","const","function"],            correctAnswer:2, explanation:"const creates a block-scoped variable that cannot be reassigned." },
    { question:"What does === check?",                          options:["Only value","Only type","Value and type","Neither"], correctAnswer:2, explanation:"=== checks both value and type without coercion." },
  ]},
  { _id:"re1", topic:"React.js", difficulty:"Intermediate", duration:12, questions:[
    { question:"Which hook manages state in functional components?", options:["useEffect","useState","useRef","useContext"], correctAnswer:1, explanation:"useState is the hook for managing state in functional components." },
    { question:"What does useEffect do?",                       options:["Manages state","Handles side effects","Creates context","Manages refs"], correctAnswer:1, explanation:"useEffect handles side effects like API calls and DOM manipulation." },
    { question:"JSX stands for:",                              options:["JavaScript XML","Java Syntax","JS Extension","None"], correctAnswer:0, explanation:"JSX stands for JavaScript XML — a syntax extension for React." },
    { question:"How do you pass data parent to child?",         options:["State","Refs","Props","Context"],            correctAnswer:2, explanation:"Props are used to pass data from parent to child components." },
    { question:"Props in React are:",                          options:["Mutable","Immutable","Optional","Functions"], correctAnswer:1, explanation:"Props are immutable — a child cannot modify the props it receives." },
  ]},
  { _id:"py1", topic:"Python Basics", difficulty:"Beginner", duration:10, questions:[
    { question:"What does len([1,2,3]) return?",                options:["2","3","4","Error"],                        correctAnswer:1, explanation:"len() returns the number of items. [1,2,3] has 3 items." },
    { question:"Which is NOT a Python data type?",              options:["dict","tuple","array","set"],               correctAnswer:2, explanation:"array is not a built-in Python data type (list is used instead)." },
    { question:"How do you start a comment in Python?",         options:["//","/*","#","--"],                         correctAnswer:2, explanation:"# is the symbol for single-line comments in Python." },
    { question:"How do you define a function in Python?",       options:["function f():","def f():","fun f():","func f():"], correctAnswer:1, explanation:"Python functions are defined with the 'def' keyword." },
    { question:"What is the output of 2 ** 3?",                options:["6","8","9","5"],                            correctAnswer:1, explanation:"** is the exponentiation operator. 2**3 = 8." },
  ]},
];

const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);
const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

// ── Score Circle ──────────────────────────────────────────────────────────────
function ScoreCircle({ pct, color }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let n = 0;
    const t = setInterval(() => {
      n += 2;
      if (n >= pct) { setDisplay(pct); clearInterval(t); }
      else setDisplay(n);
    }, 18);
    return () => clearInterval(t);
  }, [pct]);
  const r = 54, circ = 2 * Math.PI * r;
  return (
    <svg width="140" height="140" style={{ display:"block", margin:"0 auto" }}>
      <circle cx="70" cy="70" r={r} fill="none" stroke="#1e2d45" strokeWidth="10" />
      <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={circ-(display/100)*circ}
        strokeLinecap="round"
        style={{ transition:"stroke-dashoffset 0.05s", transform:"rotate(-90deg)", transformOrigin:"70px 70px" }}
      />
      <text x="70" y="66" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800" fontFamily="Syne, sans-serif">{display}%</text>
      <text x="70" y="86" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="DM Sans, sans-serif">Score</text>
    </svg>
  );
}

// ── Quiz Card ─────────────────────────────────────────────────────────────────
function QuizCard({ a, bestScore, onStart, recommended }) {
  const tc = TOPIC_COLORS[a.topic] || "#00d4ff";
  return (
    <div style={{
      background:"#111827",
      border:`1px solid ${recommended ? tc+"55" : "#1e2d45"}`,
      borderRadius:18, overflow:"hidden", transition:"all .2s",
      position:"relative",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor=tc+"88"; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 8px 30px ${tc}18`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor=recommended?tc+"55":"#1e2d45"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
    >
      {/* Recommended badge */}
      {recommended && (
        <div style={{
          position:"absolute", top:10, right:10, zIndex:1,
          padding:"2px 10px", borderRadius:20, fontSize:"0.68rem", fontWeight:700,
          background: tc+"33", color: tc, border:`1px solid ${tc}44`,
        }}>⭐ Recommended</div>
      )}

      <div style={{ height:4, background:`linear-gradient(90deg,${tc},${tc}88)` }} />
      <div style={{ padding:"1.5rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
          <div style={{
            width:52, height:52, borderRadius:14, background:tc+"18",
            border:`1px solid ${tc}33`, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:"1.8rem",
          }}>{TOPIC_ICONS[a.topic]||"📝"}</div>
          <span style={{
            padding:"3px 12px", borderRadius:20, fontSize:"0.72rem", fontWeight:600,
            background:DIFFICULTY_BG[a.difficulty]||"#1e2d45",
            color:DIFFICULTY_COLOR[a.difficulty]||"#94a3b8",
          }}>{a.difficulty}</span>
        </div>
        <h3 style={{ fontFamily:"Syne, sans-serif", fontWeight:700, color:"#fff", fontSize:"1rem", marginBottom:6 }}>{a.topic}</h3>
        <div style={{ display:"flex", gap:"1rem", marginBottom:"1rem" }}>
          <span style={{ color:"#64748b", fontSize:"0.78rem" }}>❓ {a.questions?.length||5} questions</span>
          <span style={{ color:"#64748b", fontSize:"0.78rem" }}>⏱ {a.duration} min</span>
        </div>
        {bestScore && (
          <div style={{
            padding:"8px 12px", borderRadius:8, marginBottom:"1rem",
            background:tc+"0d", border:`1px solid ${tc}22`,
            display:"flex", justifyContent:"space-between", alignItems:"center",
          }}>
            <span style={{ color:"#64748b", fontSize:"0.78rem" }}>Best Score</span>
            <span style={{
              fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:"0.9rem",
              color:bestScore.percentage>=80?"#10b981":bestScore.percentage>=60?"#f59e0b":"#ef4444",
            }}>{bestScore.percentage}% ({bestScore.score}/{bestScore.total})</span>
          </div>
        )}
        <button onClick={() => onStart(a)} style={{
          width:"100%", padding:"10px", borderRadius:10, border:"none",
          background:`linear-gradient(135deg,${tc},${tc}aa)`,
          color:"#000", fontSize:"0.88rem", cursor:"pointer",
          fontFamily:"DM Sans, sans-serif", fontWeight:700, transition:"opacity .2s",
        }}
          onMouseEnter={e => e.currentTarget.style.opacity="0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity="1"}
        >{bestScore?"Retake Quiz 🔄":"Start Quiz →"}</button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const [assessments,  setAssessments]  = useState([]);
  const [myScores,     setMyScores]     = useState([]);
  const [careerPath,   setCareerPath]   = useState("");
  const [loading,      setLoading]      = useState(true);
  const [active,       setActive]       = useState(null);
  const [questions,    setQuestions]    = useState([]);
  const [current,      setCurrent]      = useState(0);
  const [answers,      setAnswers]      = useState([]);
  const [selected,     setSelected]     = useState(null);
  const [result,       setResult]       = useState(null);
  const [submitting,   setSubmitting]   = useState(false);
  const [timeLeft,     setTimeLeft]     = useState(0);
  const [view,         setView]         = useState("list");

  const timerRef      = useRef(null);
  const answersRef    = useRef([]);
  const questionsRef  = useRef([]);
  const resultRef     = useRef(null);
  const viewRef       = useRef("list");
  const activeRef     = useRef(null);
  const submittingRef = useRef(false);
  const loadDataRef   = useRef(null);

  useEffect(() => { answersRef.current    = answers;    }, [answers]);
  useEffect(() => { questionsRef.current  = questions;  }, [questions]);
  useEffect(() => { resultRef.current     = result;     }, [result]);
  useEffect(() => { viewRef.current       = view;       }, [view]);
  useEffect(() => { activeRef.current     = active;     }, [active]);
  useEffect(() => { submittingRef.current = submitting;  }, [submitting]);

  // ── Load data ─────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [aData, sData, uData] = await Promise.allSettled([
        Assessment.getAll(),
        Assessment.getMyScores(),
        Auth.getMe(),
      ]);
      setAssessments(
        aData.status==="fulfilled" && aData.value.assessments?.length
          ? aData.value.assessments : FALLBACK
      );
      if (sData.status==="fulfilled") setMyScores(sData.value.scores || []);
      if (uData.status==="fulfilled") setCareerPath(uData.value.user?.careerPath || "");
    } catch {
      setAssessments(FALLBACK);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDataRef.current = loadData; }, [loadData]);
  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => () => clearInterval(timerRef.current), []);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (finalAnswers) => {
    if (submittingRef.current) return;
    clearInterval(timerRef.current);
    setSubmitting(true);
    submittingRef.current = true;
    const curActive    = activeRef.current;
    const curQuestions = questionsRef.current;
    try {
      if (isValidObjectId(curActive._id)) {
        const res = await Assessment.submit(curActive._id, finalAnswers);
        setResult(res); resultRef.current = res;
      } else throw new Error("fallback");
    } catch {
      let score = 0;
      const results = curQuestions.map((q, i) => {
        const isCorrect = finalAnswers[i] === q.correctAnswer;
        if (isCorrect) score++;
        return { question:q.question, selectedAnswer:finalAnswers[i]??-1, correctAnswer:q.correctAnswer, isCorrect, explanation:q.explanation||"", options:q.options };
      });
      const r = { score, total:curQuestions.length, percentage:Math.round((score/curQuestions.length)*100), results };
      setResult(r); resultRef.current = r;
    } finally {
      setSubmitting(false); submittingRef.current = false;
      setView("result"); viewRef.current = "result";
      loadDataRef.current?.();
    }
  }, []);

  // ── Timer ─────────────────────────────────────────────────────────────────
  const startTimer = useCallback((minutes) => {
    clearInterval(timerRef.current);
    setTimeLeft(minutes * 60);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (viewRef.current==="quiz" && questionsRef.current.length>0 && !resultRef.current && !submittingRef.current)
            handleSubmit(answersRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [handleSubmit]);

  // ── Start quiz ────────────────────────────────────────────────────────────
  const startQuiz = async (a) => {
    let qs = a.questions;
    try {
      if (isValidObjectId(a._id)) { const d = await Assessment.getById(a._id); qs = d.assessment?.questions || a.questions; }
    } catch {}
    setQuestions(qs); questionsRef.current = qs;
    setActive(a); activeRef.current = a;
    setCurrent(0); setAnswers([]); answersRef.current = [];
    setSelected(null); setResult(null); resultRef.current = null;
    submittingRef.current = false;
    startTimer(a.duration || 10);
    setView("quiz"); viewRef.current = "quiz";
  };

  const nextQuestion = () => {
    const newAnswers = [...answers, selected ?? -1];
    setAnswers(newAnswers); answersRef.current = newAnswers;
    if (current + 1 < questions.length) { setCurrent(c => c + 1); setSelected(null); }
    else handleSubmit(newAnswers);
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const color      = active ? (TOPIC_COLORS[active.topic] || "#00d4ff") : "#00d4ff";
  const pct        = questions.length ? Math.round((current / questions.length) * 100) : 0;
  const timerPct   = active ? (timeLeft / ((active.duration || 10) * 60)) * 100 : 100;
  const timerColor = timeLeft < 30 ? "#ef4444" : timeLeft < 60 ? "#f59e0b" : "#10b981";
  const q          = questions[current];

  // ── Split assessments into recommended + others ───────────────────────────
  const recommendedTopics = PATH_TOPICS[careerPath] || [];
  const recommended = assessments.filter(a => recommendedTopics.includes(a.topic));
  const others      = assessments.filter(a => !recommendedTopics.includes(a.topic));

  // ── HISTORY VIEW ──────────────────────────────────────────────────────────
  if (view === "history") return (
    <div style={{ paddingTop:80, minHeight:"100vh", padding:"80px 2rem 3rem", maxWidth:860, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"2rem" }}>
        <button onClick={() => setView("list")} style={{
          padding:"8px 16px", borderRadius:8, border:"1px solid #1e2d45",
          background:"transparent", color:"#94a3b8", cursor:"pointer", fontSize:"0.85rem",
        }}>← Back</button>
        <div>
          <h1 style={{ fontFamily:"Syne, sans-serif", fontSize:"1.6rem", fontWeight:800, color:"#fff" }}>📈 My Score History</h1>
          <p style={{ color:"#64748b", fontSize:"0.85rem" }}>All your past quiz attempts</p>
        </div>
      </div>
      {myScores.length === 0 ? (
        <div style={{ textAlign:"center", padding:"4rem", background:"#111827", border:"1px solid #1e2d45", borderRadius:16 }}>
          <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>📭</div>
          <p style={{ color:"#64748b" }}>No quiz attempts yet. Take a quiz first!</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"0.8rem" }}>
          {myScores.map((s, i) => {
            const sc = TOPIC_COLORS[s.topic] || "#00d4ff";
            return (
              <div key={i} style={{
                background:"#111827", border:"1px solid #1e2d45", borderRadius:14,
                padding:"1.2rem 1.5rem", display:"flex", alignItems:"center",
                justifyContent:"space-between", flexWrap:"wrap", gap:"1rem",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:sc+"22", border:`1px solid ${sc}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem" }}>
                    {TOPIC_ICONS[s.topic]||"📝"}
                  </div>
                  <div>
                    <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, color:"#fff" }}>{s.topic}</div>
                    <div style={{ color:"#64748b", fontSize:"0.78rem" }}>
                      {s.date ? new Date(s.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—"}
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"1.5rem" }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"Syne, sans-serif", fontWeight:800, fontSize:"1.3rem", color:sc }}>{s.score}/{s.total}</div>
                    <div style={{ color:"#64748b", fontSize:"0.72rem" }}>Score</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"Syne, sans-serif", fontWeight:800, fontSize:"1.3rem", color:s.percentage>=80?"#10b981":s.percentage>=60?"#f59e0b":"#ef4444" }}>{s.percentage}%</div>
                    <div style={{ color:"#64748b", fontSize:"0.72rem" }}>Percentage</div>
                  </div>
                  <span style={{ padding:"4px 12px", borderRadius:20, fontSize:"0.75rem", fontWeight:600, background:s.percentage>=80?"#10b98122":s.percentage>=60?"#f59e0b22":"#ef444422", color:s.percentage>=80?"#10b981":s.percentage>=60?"#f59e0b":"#ef4444" }}>
                    {s.percentage>=80?"🏆 Excellent":s.percentage>=60?"✅ Good":"📚 Practice"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── RESULT VIEW ───────────────────────────────────────────────────────────
  if (view === "result" && result) {
    const rc = result.percentage>=80?"#10b981":result.percentage>=60?"#f59e0b":"#ef4444";
    return (
      <div style={{ paddingTop:80, minHeight:"100vh", padding:"80px 2rem 3rem", maxWidth:700, margin:"0 auto" }}>
        <div style={{ background:"#111827", border:`1px solid ${rc}44`, borderRadius:20, padding:"2.5rem 2rem", textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>{result.percentage>=80?"🏆":result.percentage>=60?"🎉":"📚"}</div>
          <h2 style={{ fontFamily:"Syne, sans-serif", fontSize:"1.6rem", fontWeight:800, color:"#fff", marginBottom:"1.5rem" }}>Quiz Complete!</h2>
          <ScoreCircle pct={result.percentage} color={rc} />
          <div style={{ display:"flex", justifyContent:"center", gap:"2rem", marginTop:"1.5rem" }}>
            {[{label:"Correct",value:result.score,color:"#10b981"},{label:"Wrong",value:result.total-result.score,color:"#ef4444"},{label:"Total",value:result.total,color:"#94a3b8"}].map((s,i)=>(
              <div key={i} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"Syne, sans-serif", fontWeight:800, fontSize:"1.4rem", color:s.color }}>{s.value}</div>
                <div style={{ color:"#64748b", fontSize:"0.75rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <p style={{ color:"#94a3b8", marginTop:"1rem" }}>
            {result.percentage>=80?"Excellent! You're a pro! 🌟":result.percentage>=60?"Great job! Keep practicing!":"Keep studying and try again!"}
          </p>
        </div>

        <h3 style={{ fontFamily:"Syne, sans-serif", fontWeight:700, color:"#fff", marginBottom:"1rem" }}>📋 Answer Review</h3>
        {(result.results||[]).map((r, i) => (
          <div key={i} style={{ background:"#111827", border:`1px solid ${r.isCorrect?"#10b98133":"#ef444433"}`, borderRadius:14, padding:"1.2rem 1.5rem", marginBottom:"0.8rem" }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:"0.8rem", marginBottom:"0.8rem" }}>
              <span style={{ flexShrink:0, width:24, height:24, borderRadius:"50%", background:r.isCorrect?"#10b98122":"#ef444422", color:r.isCorrect?"#10b981":"#ef4444", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.75rem", fontWeight:700 }}>{r.isCorrect?"✓":"✗"}</span>
              <div style={{ color:"#e2e8f0", fontSize:"0.9rem", fontWeight:500 }}>Q{i+1}. {r.question}</div>
            </div>
            {!r.isCorrect && (
              <div style={{ marginLeft:"2rem", marginBottom:"0.6rem" }}>
                <div style={{ fontSize:"0.82rem", color:"#ef4444", marginBottom:2 }}>❌ Your answer: <strong>{r.selectedAnswer>=0?(r.options?.[r.selectedAnswer]||"No answer"):"No answer (time ran out)"}</strong></div>
                <div style={{ fontSize:"0.82rem", color:"#10b981" }}>✅ Correct: <strong>{r.options?.[r.correctAnswer]}</strong></div>
              </div>
            )}
            {r.isCorrect && <div style={{ marginLeft:"2rem", marginBottom:"0.6rem" }}><div style={{ fontSize:"0.82rem", color:"#10b981" }}>✅ <strong>{r.options?.[r.correctAnswer]}</strong></div></div>}
            {r.explanation && <div style={{ marginLeft:"2rem", padding:"0.6rem 1rem", borderRadius:8, background:"#0d1424", border:"1px solid #1e2d45", color:"#94a3b8", fontSize:"0.8rem" }}>💡 {r.explanation}</div>}
          </div>
        ))}

        <div style={{ display:"flex", gap:"1rem", marginTop:"1.5rem", flexWrap:"wrap" }}>
          <button onClick={() => { setView("list"); setActive(null); }} style={{ flex:1, padding:"12px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#00d4ff,#7c3aed)", color:"#fff", fontSize:"0.95rem", cursor:"pointer", fontFamily:"DM Sans, sans-serif", fontWeight:600 }}>🔄 Try Another Quiz</button>
          <button onClick={() => setView("history")} style={{ flex:1, padding:"12px", borderRadius:10, border:"1px solid #1e2d45", background:"transparent", color:"#94a3b8", fontSize:"0.95rem", cursor:"pointer", fontFamily:"DM Sans, sans-serif" }}>📈 View History</button>
        </div>
      </div>
    );
  }

  // ── QUIZ VIEW ─────────────────────────────────────────────────────────────
  if (view === "quiz" && q) return (
    <div style={{ paddingTop:80, minHeight:"100vh", padding:"80px 2rem 3rem", maxWidth:640, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
        <div>
          <span style={{ color, fontWeight:700, fontSize:"0.9rem" }}>{TOPIC_ICONS[active.topic]||"📝"} {active.topic}</span>
          <span style={{ color:"#64748b", fontSize:"0.8rem", marginLeft:"0.8rem" }}>Question {current+1} of {questions.length}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:20, background:timeLeft<30?"#ef444422":"#1e2d45", border:`1px solid ${timerColor}44`, color:timerColor, fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:"1rem" }}>
          ⏱ {fmt(timeLeft)}
        </div>
      </div>
      <div style={{ height:4, background:"#1e2d45", borderRadius:2, marginBottom:"0.6rem" }}>
        <div style={{ width:`${timerPct}%`, height:"100%", borderRadius:2, background:timerColor, transition:"width 1s linear" }} />
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"0.8rem", marginBottom:"1.5rem" }}>
        <div style={{ flex:1, height:6, background:"#1e2d45", borderRadius:3 }}>
          <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${color},${color}88)`, borderRadius:3, transition:"width .4s ease" }} />
        </div>
        <span style={{ color:"#64748b", fontSize:"0.75rem", flexShrink:0 }}>{pct}%</span>
      </div>

      <div style={{ background:"#111827", border:`1px solid ${color}33`, borderRadius:18, padding:"2rem" }}>
        <div style={{ display:"inline-block", padding:"3px 12px", borderRadius:20, background:DIFFICULTY_BG[active.difficulty]||"#1e2d45", color:DIFFICULTY_COLOR[active.difficulty]||"#94a3b8", fontSize:"0.75rem", fontWeight:600, marginBottom:"1rem" }}>{active.difficulty}</div>
        <h3 style={{ fontFamily:"Syne, sans-serif", fontSize:"1.1rem", fontWeight:700, color:"#fff", marginBottom:"1.5rem", lineHeight:1.5 }}>{q.question}</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:"0.7rem" }}>
          {(q.options||[]).map((opt, i) => {
            const isSelected = selected===i;
            return (
              <button key={i} onClick={() => { if (selected===null) setSelected(i); }} disabled={selected!==null} style={{
                padding:"13px 16px", borderRadius:12, border:`2px solid ${isSelected?color:"#1e2d45"}`,
                background:isSelected?color+"18":"#0a0f1e", color:isSelected?color:"#e2e8f0",
                textAlign:"left", cursor:selected!==null?"default":"pointer",
                fontFamily:"DM Sans, sans-serif", fontSize:"0.95rem", transition:"all .2s",
                display:"flex", alignItems:"center", gap:"0.8rem",
              }}>
                <span style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, background:isSelected?color+"33":"#1e2d45", border:`1px solid ${isSelected?color:"#374151"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.78rem", fontWeight:700, color:isSelected?color:"#64748b" }}>{String.fromCharCode(65+i)}</span>
                {opt}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <button onClick={nextQuestion} disabled={submitting} style={{ width:"100%", marginTop:"1.5rem", padding:"13px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${color},${color}88)`, color:"#000", fontSize:"1rem", cursor:"pointer", fontFamily:"DM Sans, sans-serif", fontWeight:700, opacity:submitting?0.7:1 }}>
            {submitting?"Submitting...":current+1===questions.length?"Submit Quiz 🚀":"Next Question →"}
          </button>
        )}
      </div>
      <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:"1.2rem", flexWrap:"wrap" }}>
        {questions.map((_, i) => (
          <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:i<answers.length?color:i===current?color+"88":"#1e2d45", transition:"background .3s" }} />
        ))}
      </div>
    </div>
  );

  // ── LIST VIEW ─────────────────────────────────────────────────────────────
  return (
    <div style={{ paddingTop:80, minHeight:"100vh", padding:"80px 2rem 3rem", maxWidth:960, margin:"0 auto" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"2rem", flexWrap:"wrap", gap:"1rem" }}>
        <div>
          <h1 style={{ fontFamily:"Syne, sans-serif", fontSize:"1.8rem", fontWeight:800, color:"#fff", marginBottom:4 }}>📊 Skill Assessment</h1>
          <p style={{ color:"#64748b" }}>Test your knowledge and track your progress</p>
        </div>
        <button onClick={() => setView("history")} style={{
          padding:"10px 20px", borderRadius:10, border:"1px solid #1e2d45",
          background:"transparent", color:"#94a3b8", cursor:"pointer", fontSize:"0.85rem",
          fontFamily:"DM Sans, sans-serif", display:"flex", alignItems:"center", gap:6,
        }}>
          📈 My Score History
          {myScores.length>0 && <span style={{ background:"#00d4ff22", color:"#00d4ff", padding:"1px 8px", borderRadius:20, fontSize:"0.75rem", fontWeight:700 }}>{myScores.length}</span>}
        </button>
      </div>

      {/* Career path banner */}
      {careerPath && (
        <div style={{
          marginBottom:"1.5rem", padding:"1rem 1.5rem", borderRadius:14,
          background:"#7c3aed11", border:"1px solid #7c3aed33",
          display:"flex", alignItems:"center", gap:"0.8rem",
        }}>
          <span style={{ fontSize:"1.5rem" }}>{PATH_ICONS[careerPath]||"🎯"}</span>
          <div>
            <div style={{ color:"#a78bfa", fontWeight:700, fontSize:"0.9rem" }}>
              Showing assessments for your career path: {PATH_LABELS[careerPath] || careerPath}
            </div>
            <div style={{ color:"#64748b", fontSize:"0.78rem" }}>
              Recommended quizzes are highlighted. You can take any quiz below.
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      {myScores.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:"1rem", marginBottom:"2rem", background:"#111827", border:"1px solid #1e2d45", borderRadius:16, padding:"1.2rem 1.5rem" }}>
          {[
            { label:"Quizzes Taken",  value:myScores.length, color:"#00d4ff" },
            { label:"Avg Score",      value:Math.round(myScores.reduce((a,s)=>a+(s.percentage||0),0)/myScores.length)+"%", color:"#10b981" },
            { label:"Best Score",     value:Math.max(...myScores.map(s=>s.percentage||0))+"%", color:"#f59e0b" },
            { label:"Topics Covered", value:new Set(myScores.map(s=>s.topic)).size, color:"#8b5cf6" },
          ].map((s,i) => (
            <div key={i}>
              <div style={{ color:"#64748b", fontSize:"0.75rem", marginBottom:3 }}>{s.label}</div>
              <div style={{ fontFamily:"Syne, sans-serif", fontWeight:800, color:s.color, fontSize:"1.1rem" }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign:"center", padding:"3rem" }}><Spinner /></div>
      ) : (
        <>
          {/* Recommended section */}
          {recommended.length > 0 && (
            <>
              <div style={{ display:"flex", alignItems:"center", gap:"0.8rem", marginBottom:"1rem" }}>
                <div style={{ flex:1, height:1, background:"#1e2d45" }} />
                <span style={{ color:"#a78bfa", fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:"0.85rem", whiteSpace:"nowrap" }}>
                  ⭐ Recommended for {PATH_LABELS[careerPath] || "You"}
                </span>
                <div style={{ flex:1, height:1, background:"#1e2d45" }} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"1.2rem", marginBottom:"2rem" }}>
                {recommended.map((a, i) => (
                  <QuizCard key={a._id||i} a={a} bestScore={myScores.find(s=>s.topic===a.topic)} onStart={startQuiz} recommended={true} />
                ))}
              </div>
            </>
          )}

          {/* Other assessments */}
          {others.length > 0 && (
            <>
              <div style={{ display:"flex", alignItems:"center", gap:"0.8rem", marginBottom:"1rem" }}>
                <div style={{ flex:1, height:1, background:"#1e2d45" }} />
                <span style={{ color:"#64748b", fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:"0.85rem", whiteSpace:"nowrap" }}>
                  📚 All Other Assessments
                </span>
                <div style={{ flex:1, height:1, background:"#1e2d45" }} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"1.2rem" }}>
                {others.map((a, i) => (
                  <QuizCard key={a._id||i} a={a} bestScore={myScores.find(s=>s.topic===a.topic)} onStart={startQuiz} recommended={false} />
                ))}
              </div>
            </>
          )}

          {/* No career path selected */}
          {!careerPath && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"1.2rem" }}>
              {assessments.map((a, i) => (
                <QuizCard key={a._id||i} a={a} bestScore={myScores.find(s=>s.topic===a.topic)} onStart={startQuiz} recommended={false} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}