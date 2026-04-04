const express = require("express");
const router = express.Router();
const { getRoadmap, updateProgress, getAllRoadmaps } = require("../controllers/roadmapController");
const { protect } = require("../middleware/auth");

router.get("/all", getAllRoadmaps);
router.get("/", protect, getRoadmap);
router.put("/progress", protect, updateProgress);

module.exports = router;