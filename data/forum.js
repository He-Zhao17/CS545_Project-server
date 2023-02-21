const mongoCollection = require("../config/mongoCollections");
const forumColleciton = mongoCollection.forum;
const errorHandlers = require("../errors");
const services = require("../services");

/**
 * Inserts forum data into database
 * @param {Forum} forum Data that needs to be uploaded
 * @returns
 */
const addForum = async (forum) => {
  const forumCol = await forumColleciton();
  try {
    errorHandlers.schema.checkSchema(forum, "forumSchema");
    const _id = services.uuid.generateUUID();
    forum._id = _id;
    forum.postDate = new Date().toLocaleString();

    const add = await forumCol.insertOne(forum);
    if (!add)
      throw {
        status: 500,
        message: "Something went wrong while inserting forum",
      };

    return { status: 200, message: "Forum added" };
  } catch (error) {
    throw {
      status: error.status,
      message: error.message,
    };
  }
};

/**
 * Retrieves forum from database
 * @param {String} forumId Unique id of the forum
 * @returns Forum object
 */
const getForum = async (forumId) => {
  const forumCol = await forumColleciton();
  const check = [
    {
      data: forumId,
      type: "string",
      variable: "forumId",
    },
  ];
  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    const forum = await forumCol.findOne({ _id: forumId });
    if (!forum)
      throw {
        status: 404,
        message: `Forum with id ${forumId} not found`,
      };

    return {
      status: 200,
      forum,
    };
  } catch (error) {
    throw {
      status: error.status,
      message: error.message,
    };
  }
};

const getAllForums = async () => {
  const forumCol = await forumColleciton();

  try {
    const forums = await forumCol.find().toArray();
    return forums;
  } catch (error) {
    throw error;
  }
};

/**
 * Adds comment to the forum
 * @param {String} forumId ForumId
 * @param {String} userId UserId
 * @param {String} commentId CommentId
 * @returns
 */
const addCommentToForum = async (forumId, userId, commentId) => {
  const forumCol = await forumColleciton();
  const check = [
    { data: forumId, type: "string", variable: "forumId" },
    { data: userId, type: "string", variable: "userId" },
    { data: commentId, type: "string", variable: "commentId" },
  ];

  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    const addComment = await forumCol.updateOne(
      { _id: forumId },
      {
        $push: {
          comments: {
            commentedById: userId,
            commentId: commentId,
          },
        },
      }
    );

    if (!addComment)
      throw {
        status: 500,
        message: "Something went wrong when adding comments",
      };

    return {
      status: 200,
      message: "Comment added",
    };
  } catch (error) {
    throw {
      status: error.status,
      message: error.message,
    };
  }
};

const getRecentForums = async () => {
  const forumCol = await forumColleciton();
  try {
    const recentForums = await forumCol
      .find()
      .sort({ $natural: -1 })
      .limit(3)
      .toArray();

    return recentForums;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  addForum,
  getForum,
  addCommentToForum,
  getRecentForums,
  getAllForums,
};
