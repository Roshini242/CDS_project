const Assessment = require("../models/Assessment");
const User = require("../models/User");

const getAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ isActive: true }).select("-questions.correctAnswer");
    res.status(200).json({ success: true, assessments });
  } catch (error) { next(error); }
};

const getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id).select("-questions.correctAnswer");
    if (!assessment) return res.status(404).json({ success: false, message: "Assessment not found." });
    res.status(200).json({ success: true, assessment });
  } catch (error) { next(error); }
};

const submitAssessment = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ success: false, message: "Assessment not found." });

    let score = 0;
    const results = assessment.questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (isCorrect) score++;
      return {
        question: q.question,
        selectedAnswer: answers[i],
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    await User.findByIdAndUpdate(req.user.id, {
  $push: {
    assessmentScores: {
      topic:      assessment.topic,
      score,
      total:      assessment.questions.length,
      percentage: Math.round((score / assessment.questions.length) * 100),
      date:       new Date(),
    },
  },
});

    res.status(200).json({
      success: true,
      score,
      total: assessment.questions.length,
      percentage: Math.round((score / assessment.questions.length) * 100),
      results,
    });
  } catch (error) { next(error); }
};

const createAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.create(req.body);
    res.status(201).json({ success: true, assessment });
  } catch (error) { next(error); }
};

const getMyScores = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("assessmentScores");
    res.status(200).json({ success: true, scores: user.assessmentScores });
  } catch (error) { next(error); }
};

const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find({ role:"student" }).select("name assessmentScores");

    const leaderboard = users
      .map(u => {
        const scores = u.assessmentScores || [];
        if (scores.length === 0) return null;
        const totalPct = scores.reduce((sum, s) => sum + (s.percentage || 0), 0);
        const avgScore = Math.round(totalPct / scores.length);
        const bestScore = Math.max(...scores.map(s => s.percentage || 0));
        return {
          _id:        u._id,
          name:       u.name,
          quizzesTaken: scores.length,
          avgScore,
          bestScore,
          totalScore: totalPct,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.avgScore - a.avgScore || b.quizzesTaken - a.quizzesTaken)
      .slice(0, 10);

    res.status(200).json({ success:true, leaderboard });
  } catch (error) { next(error); }
};

module.exports = { getAssessments, getAssessmentById, submitAssessment, createAssessment, getMyScores, getLeaderboard };