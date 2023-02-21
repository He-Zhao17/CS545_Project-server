const mongoCollection = require("../config/mongoCollections");
const feedbackCollection = mongoCollection.feedback;
const errorHandler = require("../errors");
const services = require("../services");

const addFeedback = async (title, body, feedbackType) => {
  const feedbackCol = await feedbackCollection();
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
    errorHandler.nulls.checkIfEmptyInput(check);
    errorHandler.datatypes.checkInputDataType(check);
    const feedbackObj = {
      _id: services.uuid.generateUUID(),
      title,
      body,
      feedbackType,
    };
    const feedback = await feedbackCol.insertOne(feedbackObj);
    if (!feedback)
      throw {
        status: 500,
        message: "Something went wrong.",
      };

    return {
      status: 200,
      message: "Feedback recorded",
    };
  } catch (error) {
    throw {
      status: error.status,
      message: error.message,
    };
  }
};

module.exports = {
  addFeedback,
};
