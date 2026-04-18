import { useState, useEffect, useRef, useCallback } from "react";
import { Assessment, Auth } from "../services/api";
import Spinner from "../components/Spinner";

const PATH_TOPICS = {
  webdev:        ["HTML & CSS Basics","JavaScript Fundamentals","React.js","Node.js & Express","MongoDB & Databases"],
  datascience:   ["Python Basics","Data Structures & Algorithms","MongoDB & Databases"],
  uiux:          ["HTML & CSS Basics","JavaScript Fundamentals","React.js"],
  mobile:        ["JavaScript Fundamentals","React.js","Node.js & Express"],
  cybersecurity: ["Cybersecurity Basics","Python Basics","Data Structures & Algorithms"],
  cloud:         ["Node.js & Express","Data Structures & Algorithms","MongoDB & Databases"],
  ai:            ["Python Basics","Data Structures & Algorithms","MongoDB & Databases"],
  devops:        ["Node.js & Express","Data Structures & Algorithms","MongoDB & Databases"],
  blockchain:    ["JavaScript Fundamentals","Data Structures & Algorithms","Node.js & Express"],
  gamedev:       ["JavaScript Fundamentals","Python Basics","Data Structures & Algorithms"],
};

const PATH_LABELS = { webdev:"Web Developer", datascience:"Data Scientist", uiux:"UI/UX Designer", mobile:"Mobile Developer", cybersecurity:"Cybersecurity Analyst", cloud:"Cloud Engineer", ai:"AI Engineer", devops:"DevOps Engineer", blockchain:"Blockchain Developer", gamedev:"Game Developer" };
const PATH_ICONS  = { webdev:"🌐", datascience:"📊", uiux:"🎨", mobile:"📱", cybersecurity:"🔐", cloud:"☁️", ai:"🤖", devops:"⚙️", blockchain:"⛓️", gamedev:"🎮" };

const DIFFICULTY_COLOR  = { Beginner:"#059669", Intermediate:"#d97706", Advanced:"#dc2626" };
const DIFFICULTY_BG     = { Beginner:"#ecfdf5", Intermediate:"#fffbeb", Advanced:"#fef2f2" };
const DIFFICULTY_BORDER = { Beginner:"#a7f3d0", Intermediate:"#fde68a", Advanced:"#fecaca" };

const TOPIC_ICONS  = { "JavaScript":"⚡","JavaScript Fundamentals":"⚡","React.js":"⚛️","React":"⚛️","Python":"🐍","Python Basics":"🐍","Node.js & Express":"🟢","MongoDB & Databases":"🍃","HTML & CSS Basics":"🎨","Data Structures & Algorithms":"🧠","Cybersecurity Basics":"🔐","Machine Learning":"🤖" };
const TOPIC_COLORS = { "JavaScript":"#d97706","JavaScript Fundamentals":"#d97706","React.js":"#2563eb","React":"#2563eb","Python":"#059669","Python Basics":"#059669","Node.js & Express":"#65a30d","MongoDB & Databases":"#059669","HTML & CSS Basics":"#ea580c","Data Structures & Algorithms":"#7c3aed","Cybersecurity Basics":"#dc2626","Machine Learning":"#db2777" };

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
      <circle cx="70" cy="70" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
      <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={circ-(display/100)*circ}
        strokeLinecap="round"
        style={{ transition:"stroke-dashoffset 0.05s", transform:"rotate(-90deg)", transformOrigin:"70px 70px" }}
      />
      <text x="70" y="66" textAnchor="middle" fill="#0f172a" fontSize="22" fontWeight="800" fontFamily="Syne, sans-serif">{display}%</text>
      <text x="70" y="86" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="DM Sans, sans-serif">Score</text>
    </svg>
  );
}

// ── Quiz Card ─────────────────────────────────────────────────────────────────
function QuizCard({ a, bestScore, onStart, recommended }) {
  const tc = TOPIC_COLORS[a.topic] || "#2563eb";
  return (
    <div style={{
      background:"#ffffff",
      border:`1px solid ${recommended ? tc+"33" : "#e2e8f0"}`,
      borderRadius:12, overflow:"hidden", transition:"all .2s",
      position:"relative", boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor=tc+"55"; e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 6px 20px ${tc}14`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor=recommended?tc+"33":"#e2e8f0"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.04)"; }}
    >
      {recommended && (
        <div style={{
          position:"absolute", top:10, right:10, zIndex:1,
          padding:"2px 9px", borderRadius:20, fontSize:"0.67rem", fontWeight:700,
          background:"#fffbeb", color:"#d97706", border:"1px solid #fde68a",
        }}>⭐ Recommended</div>
      )}
      <div style={{ height:3, background:tc }} />
      <div style={{ padding:"1.3rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.9rem" }}>
          <div style={{
            width:46, height:46, borderRadius:12, background:`${tc}12`,
            border:`1px solid ${tc}22`, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:"1.5rem",
          }}>{TOPIC_ICONS[a.topic]||"📝"}</div>
          <span style={{
            padding:"3px 10px", borderRadius:20, fontSize:"0.7rem", fontWeight:600,
            background: DIFFICULTY_BG[a.difficulty]||"#f1f5f9",
            color: DIFFICULTY_COLOR[a.difficulty]||"#64748b",
            border:`1px solid ${DIFFICULTY_BORDER[a.difficulty]||"#e2e8f0"}`,
          }}>{a.difficulty}</span>
        </div>
        <h3 style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, color:"#0f172a", fontSize:"0.95rem", marginBottom:5 }}>{a.topic}</h3>
        <div style={{ display:"flex", gap:"1rem", marginBottom:"0.9rem" }}>
          <span style={{ color:"#94a3b8", fontSize:"0.76rem" }}>❓ {a.questions?.length||5} questions</span>
          <span style={{ color:"#94a3b8", fontSize:"0.76rem" }}>⏱ {a.duration} min</span>
        </div>
        {bestScore && (
          <div style={{
            padding:"7px 10px", borderRadius:7, marginBottom:"0.9rem",
            background:"#f8fafc", border:"1px solid #e2e8f0",
            display:"flex", justifyContent:"space-between", alignItems:"center",
          }}>
            <span style={{ color:"#64748b", fontSize:"0.76rem" }}>Best Score</span>
            <span style={{
              fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:"0.88rem",
              color:bestScore.percentage>=80?"#059669":bestScore.percentage>=60?"#d97706":"#dc2626",
            }}>{bestScore.percentage}% ({bestScore.score}/{bestScore.total})</span>
          </div>
        )}
        <button onClick={() => onStart(a)} style={{
          width:"100%", padding:"9px", borderRadius:8, border:"none",
          background:tc, color:"#fff", fontSize:"0.875rem", cursor:"pointer",
          fontFamily:"'DM Sans', sans-serif", fontWeight:600, transition:"opacity .2s",
          boxShadow:`0 2px 8px ${tc}44`,
        }}
          onMouseEnter={e => e.currentTarget.style.opacity="0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity="1"}
        >{bestScore?"Retake Quiz 🔄":"Start Quiz →"}</button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const [assessments, setAssessments] = useState([]);
  const [myScores,    setMyScores]    = useState([]);
  const [careerPath,  setCareerPath]  = useState("");
  const [loading,     setLoading]     = useState(true);
  const [active,      setActive]      = useState(null);
  const [questions,   setQuestions]   = useState([]);
  const [current,     setCurrent]     = useState(0);
  const [answers,     setAnswers]     = useState([]);
  const [selected,    setSelected]    = useState(null);
  const [result,      setResult]      = useState(null);
  const [submitting,  setSubmitting]  = useState(false);
  const [timeLeft,    setTimeLeft]    = useState(0);
  const [view,        setView]        = useState("list");

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
  useEffect(() => { submittingRef.current = submitting; }, [submitting]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [aData, sData, uData] = await Promise.allSettled([Assessment.getAll(), Assessment.getMyScores(), Auth.getMe()]);
      setAssessments(aData.status==="fulfilled" && aData.value.assessments?.length ? aData.value.assessments : FALLBACK);
      if (sData.status==="fulfilled") setMyScores(sData.value.scores || []);
      if (uData.status==="fulfilled") setCareerPath(uData.value.user?.careerPath || "");
    } catch { setAssessments(FALLBACK); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadDataRef.current = loadData; }, [loadData]);
  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => () => clearInterval(timerRef.current), []);

  const handleSubmit = useCallback(async (finalAnswers) => {
    if (submittingRef.current) return;
    clearInterval(timerRef.current);
    setSubmitting(true); submittingRef.current = true;
    const curActive = activeRef.current, curQuestions = questionsRef.current;
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

  const startQuiz = async (a) => {
    let qs = a.questions;
    try { if (isValidObjectId(a._id)) { const d = await Assessment.getById(a._id); qs = d.assessment?.questions || a.questions; } } catch {}
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
    if (current + 1 < questions.length) { setCurrent(c => c+1); setSelected(null); }
    else handleSubmit(newAnswers);
  };

  const color      = active ? (TOPIC_COLORS[active.topic] || "#2563eb") : "#2563eb";
  const pct        = questions.length ? Math.round((current / questions.length) * 100) : 0;
  const timerPct   = active ? (timeLeft / ((active.duration || 10) * 60)) * 100 : 100;
  const timerColor = timeLeft < 30 ? "#dc2626" : timeLeft < 60 ? "#d97706" : "#059669";
  const q          = questions[current];

  const recommendedTopics = PATH_TOPICS[careerPath] || [];
  const recommended = assessments.filter(a => recommendedTopics.includes(a.topic));
  const others      = assessments.filter(a => !recommendedTopics.includes(a.topic));

  // ── HISTORY VIEW ──────────────────────────────────────────────────────────
  if (view === "history") return (
    <div style={{ paddingTop:80, minHeight:"100vh", background:"#f8fafc", padding:"80px 2rem 3rem", maxWidth:860, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"2rem" }}>
        <button onClick={() => setView("list")} style={{ padding:"7px 14px", borderRadius:7, border:"1px solid #e2e8f0", background:"#ffffff", color:"#64748b", cursor:"pointer", fontSize:"0.84rem" }}>← Back</button>
        <div>
          <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:"1.6rem", fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em" }}>📈 My Score History</h1>
          <p style={{ color:"#64748b", fontSize:"0.84rem" }}>All your past quiz attempts</p>
        </div>
      </div>
      {myScores.length === 0 ? (
        <div style={{ textAlign:"center", padding:"4rem", background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:14 }}>
          <div style={{ fontSize:"2.5rem", marginBottom:"1rem" }}>📭</div>
          <p style={{ color:"#64748b" }}>No quiz attempts yet. Take a quiz first!</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"0.7rem" }}>
          {myScores.map((s, i) => {
            const sc = TOPIC_COLORS[s.topic] || "#2563eb";
            return (
              <div key={i} style={{ background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:12, padding:"1.1rem 1.4rem", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.9rem" }}>
                  <div style={{ width:44, height:44, borderRadius:10, background:`${sc}12`, border:`1px solid ${sc}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem" }}>{TOPIC_ICONS[s.topic]||"📝"}</div>
                  <div>
                    <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, color:"#0f172a", fontSize:"0.9rem" }}>{s.topic}</div>
                    <div style={{ color:"#94a3b8", fontSize:"0.75rem" }}>{s.date ? new Date(s.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—"}</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"1.5rem" }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:"1.2rem", color:sc }}>{s.score}/{s.total}</div>
                    <div style={{ color:"#94a3b8", fontSize:"0.7rem" }}>Score</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:"1.2rem", color:s.percentage>=80?"#059669":s.percentage>=60?"#d97706":"#dc2626" }}>{s.percentage}%</div>
                    <div style={{ color:"#94a3b8", fontSize:"0.7rem" }}>Percentage</div>
                  </div>
                  <span style={{ padding:"3px 10px", borderRadius:20, fontSize:"0.72rem", fontWeight:600, background:s.percentage>=80?"#ecfdf5":s.percentage>=60?"#fffbeb":"#fef2f2", color:s.percentage>=80?"#059669":s.percentage>=60?"#d97706":"#dc2626", border:`1px solid ${s.percentage>=80?"#a7f3d0":s.percentage>=60?"#fde68a":"#fecaca"}` }}>
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
    const rc = result.percentage>=80?"#059669":result.percentage>=60?"#d97706":"#dc2626";
    const rbg = result.percentage>=80?"#ecfdf5":result.percentage>=60?"#fffbeb":"#fef2f2";
    const rborder = result.percentage>=80?"#a7f3d0":result.percentage>=60?"#fde68a":"#fecaca";
    return (
      <div style={{ paddingTop:80, minHeight:"100vh", background:"#f8fafc", padding:"80px 2rem 3rem", maxWidth:700, margin:"0 auto" }}>
        <div style={{ background:"#ffffff", border:`1px solid ${rborder}`, borderRadius:16, padding:"2.5rem 2rem", textAlign:"center", marginBottom:"1.5rem", boxShadow:"0 4px 16px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize:"2.5rem", marginBottom:"1rem" }}>{result.percentage>=80?"🏆":result.percentage>=60?"🎉":"📚"}</div>
          <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:"1.5rem", fontWeight:800, color:"#0f172a", marginBottom:"1.5rem" }}>Quiz Complete!</h2>
          <ScoreCircle pct={result.percentage} color={rc} />
          <div style={{ display:"flex", justifyContent:"center", gap:"2rem", marginTop:"1.5rem" }}>
            {[{label:"Correct",value:result.score,color:"#059669"},{label:"Wrong",value:result.total-result.score,color:"#dc2626"},{label:"Total",value:result.total,color:"#64748b"}].map((s,i)=>(
              <div key={i} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:"1.4rem", color:s.color }}>{s.value}</div>
                <div style={{ color:"#94a3b8", fontSize:"0.72rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <p style={{ color:"#64748b", marginTop:"1rem", fontSize:"0.9rem" }}>
            {result.percentage>=80?"Excellent! You're a pro! 🌟":result.percentage>=60?"Great job! Keep practicing!":"Keep studying and try again!"}
          </p>
        </div>

        <h3 style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, color:"#0f172a", marginBottom:"0.9rem", fontSize:"1rem" }}>📋 Answer Review</h3>
        {(result.results||[]).map((r, i) => (
          <div key={i} style={{ background:"#ffffff", border:`1px solid ${r.isCorrect?"#a7f3d0":"#fecaca"}`, borderRadius:12, padding:"1.1rem 1.3rem", marginBottom:"0.6rem", boxShadow:"0 1px 3px rgba(0,0,0,0.03)" }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:"0.7rem", marginBottom:"0.6rem" }}>
              <span style={{ flexShrink:0, width:22, height:22, borderRadius:"50%", background:r.isCorrect?"#ecfdf5":"#fef2f2", color:r.isCorrect?"#059669":"#dc2626", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem", fontWeight:700, border:`1px solid ${r.isCorrect?"#a7f3d0":"#fecaca"}` }}>{r.isCorrect?"✓":"✗"}</span>
              <div style={{ color:"#334155", fontSize:"0.875rem", fontWeight:500 }}>Q{i+1}. {r.question}</div>
            </div>
            {!r.isCorrect && (
              <div style={{ marginLeft:"1.8rem", marginBottom:"0.5rem" }}>
                <div style={{ fontSize:"0.8rem", color:"#dc2626", marginBottom:2 }}>❌ Your answer: <strong>{r.selectedAnswer>=0?(r.options?.[r.selectedAnswer]||"No answer"):"No answer (time ran out)"}</strong></div>
                <div style={{ fontSize:"0.8rem", color:"#059669" }}>✅ Correct: <strong>{r.options?.[r.correctAnswer]}</strong></div>
              </div>
            )}
            {r.isCorrect && <div style={{ marginLeft:"1.8rem", marginBottom:"0.5rem" }}><div style={{ fontSize:"0.8rem", color:"#059669" }}>✅ <strong>{r.options?.[r.correctAnswer]}</strong></div></div>}
            {r.explanation && <div style={{ marginLeft:"1.8rem", padding:"0.5rem 0.9rem", borderRadius:7, background:"#f8fafc", border:"1px solid #e2e8f0", color:"#64748b", fontSize:"0.78rem" }}>💡 {r.explanation}</div>}
          </div>
        ))}

        <div style={{ display:"flex", gap:"0.8rem", marginTop:"1.2rem", flexWrap:"wrap" }}>
          <button onClick={() => { setView("list"); setActive(null); }} style={{ flex:1, padding:"11px", borderRadius:8, border:"none", background:"#2563eb", color:"#fff", fontSize:"0.9rem", cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontWeight:600, boxShadow:"0 2px 8px #2563eb33" }}>🔄 Try Another Quiz</button>
          <button onClick={() => setView("history")} style={{ flex:1, padding:"11px", borderRadius:8, border:"1px solid #e2e8f0", background:"#ffffff", color:"#64748b", fontSize:"0.9rem", cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>📈 View History</button>
        </div>
      </div>
    );
  }

  // ── QUIZ VIEW ─────────────────────────────────────────────────────────────
  if (view === "quiz" && q) return (
    <div style={{ paddingTop:80, minHeight:"100vh", background:"#f8fafc", padding:"80px 2rem 3rem", maxWidth:640, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.9rem" }}>
        <div>
          <span style={{ color:color, fontWeight:700, fontSize:"0.88rem" }}>{TOPIC_ICONS[active.topic]||"📝"} {active.topic}</span>
          <span style={{ color:"#94a3b8", fontSize:"0.78rem", marginLeft:"0.8rem" }}>Question {current+1} of {questions.length}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 12px", borderRadius:20, background:timeLeft<30?"#fef2f2":"#f8fafc", border:`1px solid ${timeLeft<30?"#fecaca":"#e2e8f0"}`, color:timerColor, fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:"0.95rem" }}>
          ⏱ {fmt(timeLeft)}
        </div>
      </div>

      <div style={{ height:4, background:"#e2e8f0", borderRadius:2, marginBottom:"0.5rem" }}>
        <div style={{ width:`${timerPct}%`, height:"100%", borderRadius:2, background:timerColor, transition:"width 1s linear" }} />
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"0.7rem", marginBottom:"1.3rem" }}>
        <div style={{ flex:1, height:5, background:"#e2e8f0", borderRadius:3 }}>
          <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:3, transition:"width .4s ease" }} />
        </div>
        <span style={{ color:"#94a3b8", fontSize:"0.72rem", flexShrink:0 }}>{pct}%</span>
      </div>

      <div style={{ background:"#ffffff", border:`1px solid #e2e8f0`, borderRadius:14, padding:"1.8rem", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
        <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, background:DIFFICULTY_BG[active.difficulty]||"#f1f5f9", color:DIFFICULTY_COLOR[active.difficulty]||"#64748b", border:`1px solid ${DIFFICULTY_BORDER[active.difficulty]||"#e2e8f0"}`, fontSize:"0.72rem", fontWeight:600, marginBottom:"0.9rem" }}>{active.difficulty}</span>
        <h3 style={{ fontFamily:"'Syne', sans-serif", fontSize:"1.05rem", fontWeight:700, color:"#0f172a", marginBottom:"1.3rem", lineHeight:1.5 }}>{q.question}</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
          {(q.options||[]).map((opt, i) => {
            const isSelected = selected===i;
            return (
              <button key={i} onClick={() => { if (selected===null) setSelected(i); }} disabled={selected!==null} style={{
                padding:"12px 14px", borderRadius:10,
                border:`2px solid ${isSelected ? color : "#e2e8f0"}`,
                background:isSelected ? `${color}0d` : "#f8fafc",
                color:isSelected ? color : "#334155",
                textAlign:"left", cursor:selected!==null?"default":"pointer",
                fontFamily:"'DM Sans', sans-serif", fontSize:"0.9rem", transition:"all .15s",
                display:"flex", alignItems:"center", gap:"0.7rem",
              }}>
                <span style={{ width:26, height:26, borderRadius:"50%", flexShrink:0, background:isSelected?`${color}18`:"#e2e8f0", border:`1px solid ${isSelected?color:"#cbd5e1"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.75rem", fontWeight:700, color:isSelected?color:"#64748b" }}>{String.fromCharCode(65+i)}</span>
                {opt}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <button onClick={nextQuestion} disabled={submitting} style={{ width:"100%", marginTop:"1.3rem", padding:"12px", borderRadius:10, border:"none", background:color, color:"#fff", fontSize:"0.95rem", cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontWeight:600, opacity:submitting?0.7:1, boxShadow:`0 2px 8px ${color}44` }}>
            {submitting ? "Submitting..." : current+1===questions.length ? "Submit Quiz 🚀" : "Next Question →"}
          </button>
        )}
      </div>

      <div style={{ display:"flex", justifyContent:"center", gap:5, marginTop:"1rem", flexWrap:"wrap" }}>
        {questions.map((_,i) => (
          <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:i<answers.length?color:i===current?`${color}66`:"#e2e8f0", transition:"background .3s" }} />
        ))}
      </div>
    </div>
  );

  // ── LIST VIEW ─────────────────────────────────────────────────────────────
  return (
    <div className="page-container" style={{ paddingTop: 100, minHeight: "100vh" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.5rem", flexWrap:"wrap", gap:"1rem" }}>
        <div>
          <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:"1.75rem", fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em" }}>📊 Skill Assessment</h1>
          <p style={{ color:"#64748b", marginTop:4, fontSize:"0.9rem" }}>Test your knowledge and track your progress</p>
        </div>
        <button onClick={() => setView("history")} style={{
          padding:"9px 18px", borderRadius:8, border:"1px solid #e2e8f0",
          background:"#ffffff", color:"#64748b", cursor:"pointer", fontSize:"0.85rem",
          fontFamily:"'DM Sans', sans-serif", display:"flex", alignItems:"center", gap:6,
          boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
        }}>
          📈 My Score History
          {myScores.length>0 && <span style={{ background:"#eff6ff", color:"#2563eb", border:"1px solid #bfdbfe", padding:"1px 8px", borderRadius:20, fontSize:"0.72rem", fontWeight:700 }}>{myScores.length}</span>}
        </button>
      </div>

      {careerPath && (
        <div style={{ marginBottom:"1.2rem", padding:"0.9rem 1.3rem", borderRadius:12, background:"#f5f3ff", border:"1px solid #ddd6fe", display:"flex", alignItems:"center", gap:"0.7rem" }}>
          <span style={{ fontSize:"1.3rem" }}>{PATH_ICONS[careerPath]||"🎯"}</span>
          <div>
            <div style={{ color:"#7c3aed", fontWeight:700, fontSize:"0.88rem" }}>Showing assessments for your career path: {PATH_LABELS[careerPath] || careerPath}</div>
            <div style={{ color:"#94a3b8", fontSize:"0.76rem" }}>Recommended quizzes are highlighted. You can take any quiz below.</div>
          </div>
        </div>
      )}

      {myScores.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:"1rem", marginBottom:"1.5rem", background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:12, padding:"1.1rem 1.4rem", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
          {[
            { label:"Quizzes Taken",  value:myScores.length, color:"#2563eb" },
            { label:"Avg Score",      value:Math.round(myScores.reduce((a,s)=>a+(s.percentage||0),0)/myScores.length)+"%", color:"#059669" },
            { label:"Best Score",     value:Math.max(...myScores.map(s=>s.percentage||0))+"%", color:"#d97706" },
            { label:"Topics Covered", value:new Set(myScores.map(s=>s.topic)).size, color:"#7c3aed" },
          ].map((s,i) => (
            <div key={i}>
              <div style={{ color:"#94a3b8", fontSize:"0.72rem", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:3 }}>{s.label}</div>
              <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, color:s.color, fontSize:"1.1rem" }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign:"center", padding:"3rem" }}><Spinner /></div>
      ) : (
        <>
          {recommended.length > 0 && (
            <>
              <div style={{ display:"flex", alignItems:"center", gap:"0.8rem", marginBottom:"0.9rem" }}>
                <div style={{ flex:1, height:1, background:"#e2e8f0" }} />
                <span style={{ color:"#7c3aed", fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:"0.82rem", whiteSpace:"nowrap" }}>⭐ Recommended for {PATH_LABELS[careerPath] || "You"}</span>
                <div style={{ flex:1, height:1, background:"#e2e8f0" }} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"1rem", marginBottom:"1.5rem" }}>
                {recommended.map((a,i) => <QuizCard key={a._id||i} a={a} bestScore={myScores.find(s=>s.topic===a.topic)} onStart={startQuiz} recommended={true} />)}
              </div>
            </>
          )}
          {others.length > 0 && (
            <>
              <div style={{ display:"flex", alignItems:"center", gap:"0.8rem", marginBottom:"0.9rem" }}>
                <div style={{ flex:1, height:1, background:"#e2e8f0" }} />
                <span style={{ color:"#64748b", fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:"0.82rem", whiteSpace:"nowrap" }}>📚 All Other Assessments</span>
                <div style={{ flex:1, height:1, background:"#e2e8f0" }} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"1rem" }}>
                {others.map((a,i) => <QuizCard key={a._id||i} a={a} bestScore={myScores.find(s=>s.topic===a.topic)} onStart={startQuiz} recommended={false} />)}
              </div>
            </>
          )}
          {!careerPath && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"1rem" }}>
              {assessments.map((a,i) => <QuizCard key={a._id||i} a={a} bestScore={myScores.find(s=>s.topic===a.topic)} onStart={startQuiz} recommended={false} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}