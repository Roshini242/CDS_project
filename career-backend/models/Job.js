const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title:       { type: String, required: [true, "Job title is required"], trim: true },
    company:     { type: String, required: [true, "Company name is required"] },
    type: {
      type: String,
      enum: ["Internship", "Full-time", "Part-time", "Contract", "Freelance"],
      required: true,
    },
    location:    { type: String, required: true },
    description: { type: String, required: [true, "Job description is required"] },
    requirements: [{ type: String }],
    tags:        [{ type: String }],
    salary:      { type: String, default: "Not disclosed" },
    deadline:    { type: Date },
    rounds: [
      {
        step:        { type: Number },
        name:        { type: String },
        description: { type: String },
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicants: [
      {
        user:      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        appliedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["pending", "reviewed", "shortlisted", "rejected"],
          default: "pending",
        },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);