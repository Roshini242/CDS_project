import { useState } from "react";
import { Auth, saveToken } from "../services/api";
import Spinner from "../components/Spinner";

const inp = {
  padding: "12px 16px", borderRadius: "10px", border: "1px solid #1e2d45",
  background: "#0a0f1e", color: "#e2e8f0", fontSize: "0.95rem",
  width: "100%", fontFamily: "DM Sans, sans-serif", outline: "none",
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
        // Login — works for both Student and Admin
        data = await Auth.login(form.email, form.password);
      } else {
        // Register — always creates a Student account
        data = await Auth.register(form.name, form.email, form.password, "student");
      }

      saveToken(data.token);
      onLogin(data.user);

      // Redirect based on role
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
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "80px 1rem 2rem",
    }}>
      <div style={{
        width: "100%", maxWidth: 420,
        background: "#111827", border: "1px solid #1e2d45",
        borderRadius: 20, padding: "2.5rem",
        animation: "fadeUp .5s ease",
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
            {isLogin ? "👋" : "🎓"}
          </div>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "#fff" }}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: 4 }}>
            {isLogin
              ? "Sign in to your account"
              : "Register as a student to get started"}
          </p>
        </div>

        {/* Admin Note on Login */}
        {isLogin && (
          <div style={{
            background: "#7c3aed11", border: "1px solid #7c3aed33",
            borderRadius: 8, padding: "10px 14px", marginBottom: "1rem",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: "1rem" }}>🔐</span>
            <span style={{ color: "#a78bfa", fontSize: "0.82rem" }}>
              Admin? Use your admin credentials to access the Admin Panel.
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: "#ff444422", border: "1px solid #ff444488",
            borderRadius: 8, padding: "10px 14px", marginBottom: "1rem",
            color: "#ff8888", fontSize: "0.85rem",
          }}>{error}</div>
        )}

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Name — Register only */}
          {!isLogin && (
            <div>
              <label style={{ color: "#94a3b8", fontSize: "0.8rem", display: "block", marginBottom: 6 }}>
                Full Name *
              </label>
              <input
                placeholder="e.g. Arjun Kumar"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={inp}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label style={{ color: "#94a3b8", fontSize: "0.8rem", display: "block", marginBottom: 6 }}>
              Email Address *
            </label>
            <input
              placeholder="you@example.com"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={inp}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ color: "#94a3b8", fontSize: "0.8rem", display: "block", marginBottom: 6 }}>
              Password *
            </label>
            <input
              placeholder={isLogin ? "Enter your password" : "Min. 6 characters"}
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={inp}
              onKeyDown={e => e.key === "Enter" && handle()}
            />
          </div>

          {/* Confirm Password — Register only */}
          {!isLogin && (
            <div>
              <label style={{ color: "#94a3b8", fontSize: "0.8rem", display: "block", marginBottom: 6 }}>
                Confirm Password *
              </label>
              <input
                placeholder="Re-enter your password"
                type="password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                style={inp}
                onKeyDown={e => e.key === "Enter" && handle()}
              />
            </div>
          )}

          {/* Student badge — Register only */}
          {!isLogin && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 14px", borderRadius: 8,
              background: "#00d4ff11", border: "1px solid #00d4ff33",
            }}>
              <span>🎓</span>
              <span style={{ color: "#00d4ff", fontSize: "0.85rem" }}>
                You will be registered as a <strong>Student</strong>
              </span>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handle}
            disabled={loading}
            style={{
              padding: "13px", borderRadius: 10, border: "none",
              background: loading
                ? "#1e2d45"
                : "linear-gradient(135deg,#00d4ff,#7c3aed)",
              color: "#fff", fontSize: "1rem", fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "DM Sans, sans-serif",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8, marginTop: 4,
            }}
          >
            {loading
              ? <><Spinner /> Please wait...</>
              : isLogin ? "Sign In" : "Create Student Account"}
          </button>
        </div>

        {/* Switch */}
        <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.9rem", marginTop: "1.5rem" }}>
          {isLogin ? "New student? " : "Already registered? "}
          <span
            onClick={() => setPage(isLogin ? "register" : "login")}
            style={{ color: "#00d4ff", cursor: "pointer", fontWeight: 500 }}
          >
            {isLogin ? "Create Account" : "Sign In"}
          </span>
        </p>

      </div>
    </div>
  );
}