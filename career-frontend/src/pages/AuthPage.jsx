import { useState } from "react";
import { Auth, saveToken } from "../services/api";
import Spinner from "../components/Spinner";

const inp = {
  padding: "11px 14px", borderRadius: "8px",
  border: "1px solid #e2e8f0", background: "#ffffff",
  color: "#0f172a", fontSize: "0.9rem",
  width: "100%", fontFamily: "'DM Sans', sans-serif",
  outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};

export default function AuthPage({ type, setPage, onLogin }) {
  const [form, setForm]       = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const isLogin = type === "login";

  const handle = async () => {
    setError("");

    // Validation
    if (!form.email || !form.password) return setError("Please fill all required fields.");
    if (!isLogin && !form.name)        return setError("Full name is required.");
    if (!isLogin && form.password !== form.confirmPassword)
      return setError("Passwords do not match.");
    if (!isLogin && form.password.length < 6)
      return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      let data;
      if (isLogin) {
        data = await Auth.login(form.email, form.password);
      } else {
        data = await Auth.register(form.name, form.email, form.password, "student");
      }
      saveToken(data.token);
      onLogin(data.user);
      if (data.user.role === "admin") {
        setPage("admin-dashboard");
      } else {
        setPage("dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: "#f8fafc",
    }}>
      {/* Left panel — branding */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "3rem",
        background: "#2563eb",
        position: "relative", overflow: "hidden",
      }}
        className="auth-panel"
      >
        {/* Subtle pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 80%, #ffffff0a 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ffffff0a 0%, transparent 50%)",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9, background: "#ffffff22",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>🚀</div>
            <span style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "1.1rem", color: "#ffffff",
            }}>CareerDev</span>
          </div>

          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "2rem", color: "#ffffff",
            lineHeight: 1.2, marginBottom: "1rem",
            letterSpacing: "-0.02em",
          }}>
            {isLogin ? "Welcome back to your career hub" : "Start your career journey today"}
          </h2>
          <p style={{ color: "#bfdbfe", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: 360 }}>
            {isLogin
              ? "Sign in to access your personalized roadmaps, job listings, and skill assessments."
              : "Join thousands of students navigating their careers with personalized guidance."}
          </p>

          {/* Feature list */}
          <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "🗺️", text: "Personalized career roadmaps" },
              { icon: "💼", text: "Matched job & internship listings" },
              { icon: "📊", text: "Skill assessments & progress tracking" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "#ffffff18", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: "1rem",
                }}>{item.icon}</div>
                <span style={{ color: "#dbeafe", fontSize: "0.875rem", fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center",
        justifyContent: "center", padding: "2rem",
        background: "#f8fafc",
      }}>
        <div style={{
          width: "100%", maxWidth: 420,
          background: "#ffffff", border: "1px solid #e2e8f0",
          borderRadius: 16, padding: "2.5rem",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          animation: "fadeUp .45s ease",
        }}>

          {/* Header */}
          <div style={{ marginBottom: "1.8rem" }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontSize: "1.5rem",
              fontWeight: 800, color: "#0f172a", letterSpacing: "-0.01em",
            }}>
              {isLogin ? "Sign In" : "Create Account"}
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: 4 }}>
              {isLogin
                ? "Enter your credentials to continue"
                : "Register as a student to get started"}
            </p>
          </div>

          {/* Admin note */}
          {isLogin && (
            <div style={{
              background: "#f5f3ff", border: "1px solid #ddd6fe",
              borderRadius: 8, padding: "10px 14px", marginBottom: "1.2rem",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>🔐</span>
              <span style={{ color: "#7c3aed", fontSize: "0.8rem", fontWeight: 500 }}>
                Admin? Use your admin credentials to access the Admin Panel.
              </span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: "#fff5f5", border: "1px solid #fecaca",
              borderRadius: 8, padding: "10px 14px", marginBottom: "1.2rem",
              color: "#dc2626", fontSize: "0.85rem", display: "flex", gap: 8,
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {!isLogin && (
              <div>
                <label style={{ color: "#475569", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: 6 }}>
                  Full Name *
                </label>
                <input
                  placeholder="e.g. Arjun Kumar"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inp}
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px #2563eb18"; }}
                  onBlur={e =>  { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            )}

            <div>
              <label style={{ color: "#475569", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: 6 }}>
                Email Address *
              </label>
              <input
                placeholder="you@example.com"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={inp}
                onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px #2563eb18"; }}
                onBlur={e =>  { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            <div>
              <label style={{ color: "#475569", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: 6 }}>
                Password *
              </label>
              <input
                placeholder={isLogin ? "Enter your password" : "Min. 6 characters"}
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={inp}
                onKeyDown={e => e.key === "Enter" && handle()}
                onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px #2563eb18"; }}
                onBlur={e =>  { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {!isLogin && (
              <div>
                <label style={{ color: "#475569", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: 6 }}>
                  Confirm Password *
                </label>
                <input
                  placeholder="Re-enter your password"
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  style={inp}
                  onKeyDown={e => e.key === "Enter" && handle()}
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px #2563eb18"; }}
                  onBlur={e =>  { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            )}

            {!isLogin && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 14px", borderRadius: 8,
                background: "#eff6ff", border: "1px solid #bfdbfe",
              }}>
                <span>🎓</span>
                <span style={{ color: "#1d4ed8", fontSize: "0.85rem", fontWeight: 500 }}>
                  You will be registered as a <strong>Student</strong>
                </span>
              </div>
            )}

            <button
              onClick={handle}
              disabled={loading}
              style={{
                padding: "12px", borderRadius: 8, border: "none",
                background: loading ? "#94a3b8" : "#2563eb",
                color: "#fff", fontSize: "0.95rem", fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8, marginTop: 4,
                transition: "background 0.2s",
                boxShadow: loading ? "none" : "0 2px 8px #2563eb44",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#1d4ed8"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#2563eb"; }}
            >
              {loading
                ? <><Spinner /> Please wait...</>
                : isLogin ? "Sign In →" : "Create Student Account →"}
            </button>
          </div>

          {/* Switch */}
          <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.875rem", marginTop: "1.5rem" }}>
            {isLogin ? "New student? " : "Already registered? "}
            <span
              onClick={() => setPage(isLogin ? "register" : "login")}
              style={{ color: "#2563eb", cursor: "pointer", fontWeight: 600 }}
            >
              {isLogin ? "Create Account" : "Sign In"}
            </span>
          </p>
        </div>
      </div>

      {/* Hide left panel on small screens */}
      <style>{`
        @media (max-width: 768px) {
          .auth-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}