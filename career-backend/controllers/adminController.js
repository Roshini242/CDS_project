const User = require("../models/User");
const Job  = require("../models/Job");
const Assessment = require("../models/Assessment");

// ── Dashboard Stats ────────────────────────────────────────────────────────
// GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [totalStudents, totalJobs, totalApplications, totalAssessments, recentStudents] =
      await Promise.all([
        User.countDocuments({ role: "student" }),
        Job.countDocuments({ isActive: true }),
        Job.aggregate([{ $project: { count: { $size: "$applicants" } } }, { $group: { _id: null, total: { $sum: "$count" } } }]),
        Assessment.countDocuments({ isActive: true }),
        User.find({ role: "student" }).sort({ createdAt: -1 }).limit(5).select("name email createdAt careerPath profileCompletion"),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalJobs,
        totalApplications: totalApplications[0]?.total || 0,
        totalAssessments,
        recentStudents,
      },
    });
  } catch (error) { next(error); }
};

// ── All Students ──────────────────────────────────────────────────────────
// GET /api/admin/students
const getStudents = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = { role: "student" };
    if (search) {
      query.$or = [
        { name:  { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const skip  = (page - 1) * limit;
    const total = await User.countDocuments(query);
    const students = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select("-password");

    res.status(200).json({ success: true, total, students });
  } catch (error) { next(error); }
};

// GET /api/admin/students/:id
const getStudentById = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id)
      .select("-password")
      .populate("appliedJobs.job", "title company type");
    if (!student) return res.status(404).json({ success: false, message: "Student not found." });
    res.status(200).json({ success: true, student });
  } catch (error) { next(error); }
};

// DELETE /api/admin/students/:id
const deleteStudent = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Student removed." });
  } catch (error) { next(error); }
};

// ── All Jobs (admin view with applicant counts) ──────────────────────────
// GET /api/admin/jobs
const getAdminJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, jobs });
  } catch (error) { next(error); }
};

// ── All Applications ──────────────────────────────────────────────────────
// GET /api/admin/applications
const getAllApplications = async (req, res, next) => {
  try {
    const jobs = await Job.find({ "applicants.0": { $exists: true } })
      .populate("applicants.user", "name email profile careerPath")
      .select("title company applicants");

    const applications = [];
    jobs.forEach(job => {
      job.applicants.forEach(app => {
        applications.push({
          jobId:     job._id,
          jobTitle:  job.title,
          company:   job.company,
          student:   app.user,
          status:    app.status,
          appliedAt: app.appliedAt,
        });
      });
    });

    applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    res.status(200).json({ success: true, total: applications.length, applications });
  } catch (error) { next(error); }
};

// PUT /api/admin/applications/:jobId/:userId
const updateAppStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });

    const app = job.applicants.find(a => a.user.toString() === req.params.userId);
    if (!app) return res.status(404).json({ success: false, message: "Application not found." });

    app.status = status;
    await job.save();

    await User.updateOne(
      { _id: req.params.userId, "appliedJobs.job": job._id },
      { $set: { "appliedJobs.$.status": status } }
    );

    res.status(200).json({ success: true, message: "Status updated successfully." });
  } catch (error) { next(error); }
};

// ── Assessments ───────────────────────────────────────────────────────────
// GET /api/admin/assessments
const getAdminAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, assessments });
  } catch (error) { next(error); }
};

// POST /api/admin/assessments
const createAdminAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.create(req.body);
    res.status(201).json({ success: true, assessment });
  } catch (error) { next(error); }
};

// DELETE /api/admin/assessments/:id
const deleteAssessment = async (req, res, next) => {
  try {
    await Assessment.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ success: true, message: "Assessment removed." });
  } catch (error) { next(error); }
};

module.exports = {
  getStats,
  getStudents, getStudentById, deleteStudent,
  getAdminJobs,
  getAllApplications, updateAppStatus,
  getAdminAssessments, createAdminAssessment, deleteAssessment,
};