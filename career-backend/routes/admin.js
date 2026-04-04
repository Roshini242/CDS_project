const express    = require("express");
const router     = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const {
  getStats,
  getStudents, getStudentById, deleteStudent,
  getAdminJobs,
  getAllApplications, updateAppStatus,
  getAdminAssessments, createAdminAssessment, deleteAssessment,
} = require("../controllers/adminController");

// All admin routes are protected + admin only
router.use(protect, adminOnly);

router.get("/stats",                          getStats);
router.get("/students",                       getStudents);
router.get("/students/:id",                   getStudentById);
router.delete("/students/:id",                deleteStudent);
router.get("/jobs",                           getAdminJobs);
router.get("/applications",                   getAllApplications);
router.put("/applications/:jobId/:userId",    updateAppStatus);
router.get("/assessments",                    getAdminAssessments);
router.post("/assessments",                   createAdminAssessment);
router.delete("/assessments/:id",             deleteAssessment);

module.exports = router;