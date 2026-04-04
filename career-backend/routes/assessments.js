const express = require("express");
const router = express.Router();
const {
  getAssessments, getAssessmentById, submitAssessment,
  createAssessment, getMyScores, getLeaderboard
} = require("../controllers/assessmentController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/",            protect, getAssessments);
router.get("/my-scores",   protect, getMyScores);
router.get("/leaderboard", protect, getLeaderboard);  // ← must be BEFORE /:id
router.get("/:id",         protect, getAssessmentById);
router.post("/:id/submit", protect, submitAssessment);
router.post("/",           protect, adminOnly, createAssessment);

module.exports = router;