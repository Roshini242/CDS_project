const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ─── TOKEN HELPERS ────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem("careerdev_token");
export const saveToken = (t) => localStorage.setItem("careerdev_token", t);
export const clearToken = () => localStorage.removeItem("careerdev_token");

// ─── BASE FETCH ───────────────────────────────────────────────────────────────
export const api = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const Auth = {
  register: (name, email, password, role) =>
    api("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password, role }) }),
  login: (email, password) =>
    api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  getMe: () => api("/auth/me"),
  updateProfile: (data) =>
    api("/auth/updateprofile", { method: "PUT", body: JSON.stringify(data) }),
  changePassword: (currentPassword, newPassword) =>
    api("/auth/changepassword", { method: "PUT", body: JSON.stringify({ currentPassword, newPassword }) }),
};

// ─── JOBS ─────────────────────────────────────────────────────────────────────
export const Jobs = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/jobs?${q}`);
  },
  getById: (id) => api(`/jobs/${id}`),
  apply: (id) => api(`/jobs/${id}/apply`, { method: "POST" }),
  create: (data) => api("/jobs", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => api(`/jobs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => api(`/jobs/${id}`, { method: "DELETE" }),
};

// ─── ROADMAP ──────────────────────────────────────────────────────────────────
export const Roadmap = {
  getAll: () => api("/roadmap/all"),
  getMine: () => api("/roadmap"),
  updateProgress: (stepId, completed) =>
    api("/roadmap/progress", { method: "PUT", body: JSON.stringify({ stepId, completed }) }),
};

// ─── ASSESSMENT ───────────────────────────────────────────────────────────────
export const Assessment = {
  getAll:        ()          => api("/assessments"),
  getById:       (id)        => api(`/assessments/${id}`),
  submit:        (id, answers) => api(`/assessments/${id}/submit`, { method:"POST", body:JSON.stringify({ answers }) }),
  getMyScores:   ()          => api("/assessments/my-scores"),
  getLeaderboard:()          => api("/assessments/leaderboard"),
};