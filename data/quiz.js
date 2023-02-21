const mongoCollection = require("../config/mongoCollections");
const quizCollection = mongoCollection.quiz;
const userData = require("./user");
const errorHandlers = require("../errors");
const services = require("../services");
const uuid = services.uuid;

/**
 * Uploads the quiz data of a specific user to the database
 * @param {Array<Quiz>} quizzes Array of quiz answers
 */
const submitQuiz = async (quiz) => {
  const quizCol = await quizCollection();
  try {
    //Check for errors in schema
    errorHandlers.schema.checkSchema(quiz, "quizSchema");
  } catch (error) {
    throw {
      status: error.status,
      message: error.message,
    };
  }

  try {
    const _id = uuid.generateUUID();
    quiz._id = _id;
    const upload = await quizCol.insertOne(quiz);
    if (!upload) throw "Something went wrong inserting quiz";
    const updateUser = await userData.addQuizToUser(quiz);
    if (!updateUser) throw "Something went wrong updating user";

    return {
      status: 200,
      message: "Quiz submitted",
    };
  } catch (error) {
    throw {
      status: 500,
      message: error.message,
    };
  }
};

/**
 * Fetches quiz data based on quizId and userId
 * @param {String<uuid>} quizId Unique Id for the quiz
 * @param {String<uuid>} userId Unique Id for the user
 */
const getUserQuiz = async (quizId, userId) => {
  const quizCol = await quizCollection();
  try {
    const check = [
      { data: quizId, type: "string", variable: "quizId" },
      { data: userId, type: "string", variable: "userId" },
    ];
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    const quiz = await quizCol.findOne({ _id: quizId, userId: userId });
    if (!quiz) {
      throw {
        status: 404,
        message: "Quiz not found",
      };
    }
    return {
      status: 200,
      message: "Quiz found",
      quiz,
    };
  } catch (error) {
    throw {
      status: error.status,
      message: error.message,
    };
  }
};

module.exports = {
  submitQuiz,
  getUserQuiz,
};
