const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

dotenv.config();
connectDB();

const app = express();

// ─── CORS FIX ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin: "*",                  // Allow all origins in development
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: false,
}));

// Handle preflight requests
app.options("*", cors());

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use("/api/auth",        require("./routes/auth"));
app.use("/api/jobs",        require("./routes/jobs"));
app.use("/api/assessments", require("./routes/assessments"));
app.use("/api/roadmap",     require("./routes/roadmap"));
app.use("/api/admin",       require("./routes/admin"));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Career Dev API is running!",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`
  });
});

// Error handler
app.use(errorHandler);

// ─── START ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health\n`);
});