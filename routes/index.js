const auth = require("./auth");
const questions = require("./questions");
const quiz = require("./quiz");
const forum = require("./forum");
const feedback = require("./feedback");
const user = require("./user");
const comments = require("./comment");
const leaderboard = require("./leaderboard");

/**
 * @param {Express} app
 */
const constructionMethod = (app) => {
  app.use("/api/auth", auth);
  app.use("/api/questions", questions);
  app.use("/api/quiz", quiz);
  app.use("/api/forum", forum);
  app.use("/api/feedback", feedback);
  app.use("/api/user", user);
  app.use("/api/comments", comments);
  app.use("/api/leaderboard", leaderboard);
  app.use("/api/health", (req, res) => {
    return res.status(200).json({
      status: 200,
      message: "API working",
      requestMethod: req.method,
    });
  });
  app.use("*", (req, res) => {
    return res.status(404).json({
      status: 404,
      message: "Route not found",
      requestMethod: req.method,
    });
  });
};

module.exports = constructionMethod;
