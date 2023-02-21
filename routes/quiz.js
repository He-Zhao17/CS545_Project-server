const express = require("express");
const router = express.Router();
const data = require("../data");
const quizData = data.quiz;
const errorHandlers = require("../errors");
const services = require("../services");

router.post("/submit", services.token.validateToken, async (req, res) => {
  const { quiz } = req.body;

  try {
    errorHandlers.schema.checkSchema(quiz, "quizSchema");
    const upload = await quizData.submitQuiz(quiz);
    return res.json(upload);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

router.get("/", services.token.validateToken, async (req, res) => {
  const { userId, quizId } = req.query;
  const check = [
    { data: userId, type: "string", variable: "userId" },
    { data: quizId, type: "string", variable: "quizId" },
  ];
  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    const quiz = await quizData.getUserQuiz(quizId, userId);
    return res.json(quiz);
  } catch (error) {
    res.status(error.status).json(error);
  }
});

module.exports = router;
