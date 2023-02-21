const express = require("express");
const router = express.Router();
const data = require("../data");
const questionsData = data.questions;
const errorHandlers = require("../errors");
const services = require("../services");
/**
 * Route used to add questions
 */
router.post("/add", services.token.validateToken, async (req, res) => {
  const questions = req.body.questions;
  if (req.user.role !== "admin")
    return res.status(401).json({
      status: 401,
      message: "Access denied - Insufficient Permission",
    });
  try {
    errorHandlers.schema.checkSchema(questions, "questionSchema");
    const add = await questionsData.addQuestionToDatabase(questions);
    return res.json(add);
  } catch (error) {
    res.status(error.status).json(error);
  }
});

/**
 * Route used to get a question with a specific ID
 */
router.get("/get", services.token.validateToken, async (req, res) => {
  const { _id } = req.query;
  if (!req.user)
    return res
      .status(401)
      .json({ status: 401, message: "Missing token, please login." });
  const check = [
    {
      data: _id,
      variable: "_id",
      type: "string",
    },
  ];
  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkIfTypeArray(check);
    const ques = await questionsData.getQuestion(_id);
    return res.json(ques);
  } catch (error) {
    res.status(error.status).json(error);
  }
});

/**
 * Route used to get random questions
 */
router.get("/random", async (req, res) => {
  const { limit, difficulty } = req.query;

  try {
    const ques = await questionsData.getBunchOfQuestions(
      parseInt(limit),
      difficulty
    );
    return res.json(ques);
  } catch (error) {
    res.status(error.status).json(error);
  }
});

/**
 * Route used to update questions
 */
router.put("/update", async (req, res) => {});

module.exports = router;
