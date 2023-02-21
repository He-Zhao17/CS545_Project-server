const mongoCollection = require("../config/mongoCollections");
const commentCollection = mongoCollection.comment;
const errorHandlers = require("../errors");
const services = require("../services");

/**
 * Add comment to database
 * @param {String} body Body of the comment
 * @param {String} userId User who is writing the comment
 * @returns
 */
const addComment = async (body, userId) => {
  const commentCol = await commentCollection();
  const check = [
    { data: body, type: "string", variable: "body" },
    { data: userId, type: "string", variable: "userId" },
  ];

  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    const _id = services.uuid.generateUUID();
    const comment = {
      _id,
      body,
      userId,
      timestamp: new Date().toLocaleString(),
      votes: 0,
      replies: [],
    };
    const add = await commentCol.insertOne(comment);
    if (!add)
      throw {
        status: 500,
        message: "Something went wrong adding comment",
      };

    return {
      status: 200,
      message: "Comment added",
      commentId: _id,
    };
  } catch (error) {
    throw {
      status: error.status,
      message: error.message,
    };
  }
};

const getComments = async (commentId) => {
  const commentCol = await commentCollection();
  const check = [
    {
      data: commentId,
      type: "string",
      variable: "commentId",
    },
  ];
  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    const comment = await commentCol.findOne({ _id: commentId });

    return comment;
  } catch (error) {
    throw error;
  }
};

const replyToComment = async (
  commentId,
  commentText,
  userId,
  forumId,
  username
) => {
  const commentCol = await commentCollection();
  const check = [
    {
      data: commentId,
      type: "string",
      variable: "commentId",
    },
    {
      data: commentText,
      type: "string",
      variable: "commentText",
    },
    {
      data: userId,
      type: "string",
      variable: "userId",
    },
    {
      data: forumId,
      type: "string",
      variable: "forumId",
    },
    {
      data: username,
      type: "string",
      variable: "username",
    },
  ];
  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    const add = await commentCol.updateOne(
      { _id: commentId },
      {
        $push: {
          replies: {
            _id: services.uuid.generateUUID(),
            body: commentText,
            userId,
            timestamp: new Date().toLocaleString(),
            forumId,
            username,
          },
        },
      }
    );

    return {
      status: 200,
      message: "Comment added",
      add,
    };
  } catch (error) {
    throw error;
  }
};

const getReplies = async (commentId) => {
  const commentCol = await commentCollection();
  const check = [
    {
      data: commentId,
      type: "string",
      variable: "commentId",
    },
  ];
  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    const comment = await commentCol.findOne({ _id: commentId });
    return comment.replies;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addComment,
  getComments,
  replyToComment,
  getReplies,
};
