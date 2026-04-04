const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    profile: {
      bio: { type: String, default: "" },
      skills: [{ type: String }],
      education: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedIn: { type: String, default: "" },
      github: { type: String, default: "" },
      resumeUrl: { type: String, default: "" },
    },
    careerPath: {
      type: String,
      enum:  [
    "webdev",
    "datascience",
    "uiux",
    "mobile",
    "cybersecurity",
    "cloud",
    "ai",
    "devops",
    "blockchain",
    "gamedev",
  ],
      default: "webdev",
    },
    roadmapProgress: {
      type: Map,
      of: Boolean,
      default: {},
    },
    appliedJobs: [
      {
        job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
        appliedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["pending", "reviewed", "shortlisted", "rejected"],
          default: "pending",
        },
      },
    ],
    assessmentScores: [
  {
    topic:      { type: String },
    score:      { type: Number },
    total:      { type: Number },
    percentage: { type: Number },
    date:       { type: Date, default: Date.now },
  },
],
    profileCompletion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.calculateCompletion = function () {
  let score = 0;
  if (this.name) score += 20;
  if (this.email) score += 10;
  if (this.profile.bio) score += 15;
  if (this.profile.skills.length > 0) score += 20;
  if (this.profile.education) score += 15;
  if (this.profile.resumeUrl) score += 20;
  return score;
};

module.exports = mongoose.model("User", UserSchema);