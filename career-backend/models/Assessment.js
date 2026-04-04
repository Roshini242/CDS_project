const mongoose = require("mongoose");

const AssessmentSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    questions: [
      {
        question:      { type: String, required: true },
        options:       [{ type: String }],
        correctAnswer: { type: Number, required: true },
        explanation:   { type: String, default: "" },
      },
    ],
    duration:   { type: Number, default: 10 },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", AssessmentSchema);