const mongoCollection = require("../config/mongoCollections");
const questionsCollection = mongoCollection.questions;
const errorHandlers = require("../errors");
const services = require("../services");

/**
 * @param {Array<Question>} questions
 * @returns
 */
const addQuestionToDatabase = async (questions) => {
  const questionCol = await questionsCollection();
  try {
    errorHandlers.schema.checkSchema(questions, "questionSchema");
  } catch (error) {
    return {
      status: 400,
      message: error,
    };
  }
  try {
    const _id = services.uuid.generateUUID();
    questions._id = _id;
    const insert = await questionCol.insertOne(questions);

    if (!insert.acknowledged)
      throw {
        status: 500,
        message: "Error inserting question",
      };

    return {
      status: 200,
      message: "Added questions",
    };
  } catch (error) {
    throw { status: error.status, message: error.message };
  }
};

/**
 * @param {UUID} _id
 */
const getQuestion = async (_id) => {
  const questionCol = await questionsCollection();
  const check = [
    {
      data: _id,
      variable: "_id",
      type: "string",
    },
  ];
  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);

    const question = await questionCol.findOne({ _id: _id });

    if (!question)
      throw {
        status: 404,
        message: "Question not found",
      };

    return {
      status: 200,
      question,
    };
  } catch (error) {
    throw {
      status: error.status,
      message: error.message,
    };
  }
};

/**
 *
 * @param {Int} limit
 * Determines how many questions to be fetched. Default is 10.
 * @param {String} difficulty
 * Determines the difficulty of the questions to be fetched. Default is easy
 * @returns
 */
const getBunchOfQuestions = async (limit = 10, difficulty = "easy") => {
  const questionCol = await questionsCollection();
  try {
    const questions = await questionCol
      .aggregate([{ $match: { difficulty } }, { $sample: { size: limit } }])
      .toArray();

    if (!questions || questions.length == 0)
      throw {
        status: 404,
        message: "Something went wrong while performing the query",
      };

    return {
      status: 200,
      questions,
    };
  } catch (error) {
    throw {
      status: error.status,
      message: error.message,
    };
  }
};

module.exports = {
  addQuestionToDatabase,
  getQuestion,
  getBunchOfQuestions,
};
