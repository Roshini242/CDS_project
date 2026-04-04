const express = require("express");
const router = express.Router();
const { getJobs, getJobById, createJob, updateJob, deleteJob, applyForJob, getApplicants, updateApplicationStatus } = require("../controllers/jobController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", protect, adminOnly, createJob);
router.put("/:id", protect, adminOnly, updateJob);
router.delete("/:id", protect, adminOnly, deleteJob);
router.post("/:id/apply", protect, applyForJob);
router.get("/:id/applicants", protect, adminOnly, getApplicants);
router.put("/:id/applicants/:userId", protect, adminOnly, updateApplicationStatus);

module.exports = router;