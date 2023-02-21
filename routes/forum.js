const express = require("express");
const router = express.Router();
const data = require("../data");
const forum = data.forum;
const comm = data.comment;
const errorHandlers = require("../errors");
const services = require("../services");

router.post("/add", services.token.validateToken, async (req, res) => {
  const { forumPost } = req.body;

  try {
    errorHandlers.schema.checkSchema(forumPost, "forumSchema");
    const addData = await forum.addForum(forumPost);
    if (!addData)
      throw {
        status: 500,
        message: "Something went wrong trying to add forum",
      };
    return res.json(addData);
  } catch (error) {
    res.status(error.status).json(error);
  }
});

router.post("/comment", services.token.validateToken, async (req, res) => {
  const { userId, forumId, comment } = req.body;
  const check = [
    { data: userId, type: "string", variable: "userId" },
    { data: forumId, type: "string", variable: "forumId" },
    { data: comment, type: "string", variable: "comment" },
  ];

  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    const addCommentToDb = await comm.addComment(comment, userId);
    if (addCommentToDb.status !== 200)
      throw {
        status: addCommentToDb.status,
        message: addCommentToDb.message,
      };
    const updateForumComments = await forum.addCommentToForum(
      forumId,
      userId,
      addCommentToDb.commentId
    );

    return res.json(updateForumComments);
  } catch (error) {
    return res.status(error.status).json(error);
  }
});

router.get("/get", services.token.validateToken, async (req, res) => {
  const { forumId } = req.query;
  try {
    if (!forumId) {
      const forums = await forum.getAllForums();
      return res.json(forums);
    }

    const getForum = await forum.getForum(forumId);
    return res.json(getForum);
  } catch (error) {
    return res.status(error.status).json(error);
  }
});

module.exports = router;
