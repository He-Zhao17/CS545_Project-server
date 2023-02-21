const express = require("express");
const router = express.Router();
const data = require("../data");
const comment = data.comment;
const errorHandlers = require("../errors");
const services = require("../services");

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const check = [{ data: id, variable: "id", type: "string" }];
  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    const commentFromDB = await comment.getComments(id);

    return res.json(commentFromDB);
  } catch (error) {
    res.status(error.status).json(error);
  }
});

router.post("/add", services.token.validateToken, async (req, res) => {
  const { commentText, forumId, userId, commentId, username } = req.body;
  const check = [
    { data: commentText, variable: "commentText", type: "string" },
    { data: forumId, variable: "forumId", type: "string" },
    { data: userId, variable: "userId", type: "string" },
    { data: commentId, variable: "commentId", type: "string" },
    { data: username, variable: "username", type: "string" },
  ];
  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    const addData = await comment.replyToComment(
      commentId,
      commentText,
      userId,
      forumId,
      username
    );
    if (!addData)
      throw {
        status: 500,
        message: "Something went wrong trying to add comment",
      };
    return res.json(addData);
  } catch (error) {
    res.status(error.status).json(error);
  }
});

router.get("/:id/replies", services.token.validateToken, async (req, res) => {
  const { id } = req.params;
  // Get replues from the comment id

  const check = [{ data: id, variable: "id", type: "string" }];
  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    const commentFromDB = await comment.getReplies(id);
    return res.json(commentFromDB);
  } catch (error) {
    res.status(error.status).json(error);
  }
});

module.exports = router;
