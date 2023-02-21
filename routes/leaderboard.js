const express = require("express");
const router = express.Router();
const data = require("../data");
const leaderboard = data.leaderboard;
const errorHandlers = require("../errors");
const services = require("../services");

router.get("/", services.token.validateToken, async (req, res) => {
  try {
    const leaderboardData = await leaderboard.getLeaderboard();
    res.json({
      status: leaderboardData.status,
      leaderboard: leaderboardData.data,
    });
  } catch (error) {
    res.status(error.status).json({
      status: error.status,
      message: error.message,
    });
  }
});

router.post("/add", services.token.validateToken, async (req, res) => {
  const { userId, username, score } = req.body;
  const check = [
    { data: userId, type: "string", variable: "userId" },
    { data: username, type: "string", variable: "username" },
    { data: score, type: "number", variable: "score" },
  ];
  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);

    const addToLeaderboard = await leaderboard.addScore(
      userId,
      username,
      score
    );

    res.json({
      status: addToLeaderboard.status,
      message: addToLeaderboard.message,
    });
  } catch (error) {
    res.status(error.status).json({
      status: error.status,
      message: error.message,
    });
  }
});

module.exports = router;
