const Job = require("../models/Job");
const User = require("../models/User");

const getJobs = async (req, res, next) => {
  try {
    const { type, search, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }
    const skip = (page - 1) * limit;
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    res.status(200).json({ success: true, count: jobs.length, total, jobs });
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name email");
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user.id });
    res.status(201).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    res.status(200).json({ success: true, message: "Job removed successfully." });
  } catch (error) {
    next(error);
  }
};

const applyForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    const alreadyApplied = job.applicants.some((a) => a.user.toString() === req.user.id);
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: "You have already applied for this job." });
    }
    job.applicants.push({ user: req.user.id });
    await job.save();
    await User.findByIdAndUpdate(req.user.id, {
      $push: { appliedJobs: { job: job._id } },
    });
    res.status(200).json({ success: true, message: "Application submitted successfully! 🎉" });
  } catch (error) {
    next(error);
  }
};

const getApplicants = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("applicants.user", "name email profile");
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    res.status(200).json({ success: true, applicants: job.applicants });
  } catch (error) {
    next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    const applicant = job.applicants.find((a) => a.user.toString() === req.params.userId);
    if (!applicant) return res.status(404).json({ success: false, message: "Applicant not found." });
    applicant.status = status;
    await job.save();
    await User.updateOne(
      { _id: req.params.userId, "appliedJobs.job": job._id },
      { $set: { "appliedJobs.$.status": status } }
    );
    res.status(200).json({ success: true, message: "Status updated." });
  } catch (error) {
    next(error);
  }
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob, applyForJob, getApplicants, updateApplicationStatus };