const express = require("express");
const router = express.Router();
const data = require("../data");
const services = require("../services");
const errors = require("../errors");

router.post("/add", services.token.validateToken, async (req, res) => {
  const { title, body, feedbackType } = req.body;
  const check = [
    {
      data: title,
      type: "string",
      variable: "title",
    },
    {
      data: body,
      type: "string",
      variable: "body",
    },
    {
      data: feedbackType,
      type: "string",
      variable: "feedbackType",
    },
  ];
  try {
    errors.nulls.checkIfEmptyInput(check);
    errors.datatypes.checkInputDataType(check);
    const addFeedback = await data.feedback.addFeedback(
      title,
      body,
      feedbackType
    );

    return res.json(addFeedback);
  } catch (error) {
    return res.status(error.status).json(error);
  }
});

module.exports = router;
