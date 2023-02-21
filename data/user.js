require("dotenv").config();
const mongoCollection = require("../config/mongoCollections");
const userCollection = mongoCollection.user;
const errorHandlers = require("../errors");
const services = require("../services");
const { getRecentForums } = require("./forum");

/**
 *
 * @param {String} id
 */
const getUserById = async (id) => {
  const user = await userCollection();
  const check = [{ data: id, variable: "userId", type: "string" }];

  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
  } catch (error) {
    throw { status: 400, error };
  }

  let userFromDB = await user.findOne({ _id: id });

  if (!userFromDB) throw { status: 404, message: "User not found" };

  return userFromDB;
};

/**
 *
 * @param {String} email
 */
async function getUserByEmail(email) {
  const user = await userCollection();
  const check = [{ data: email, variable: "email", type: "string" }];
  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
  } catch (error) {
    throw { status: 400, message: error };
  }
  let userFromDB = await user.findOne({ email: email });
  if (!userFromDB)
    throw {
      status: 404,
      message: "User not found",
    };
  return userFromDB;
}

/**
 *
 * @param {String} username
 * @param {String} email
 * @param {String} password
 * @param {Int} age
 * @param {String} gender
 */
async function createUser(username, email, password, age, gender) {
  const user = await userCollection();
  const check = [
    { data: username, variable: "username", type: "string" },
    { data: password, variable: "password", type: "string" },
    { data: email, variable: "email", type: "string" },
    { data: gender, variable: "gender", type: "string" },
    { data: age, variable: "age", type: "number" },
  ];

  //Error checks
  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    errorHandlers.range.checkInputAgeRange(age);
    errorHandlers.match.checkInputGender(gender);
  } catch (error) {
    throw { status: 400, message: error };
  }

  try {
    const usernameExists = await user.findOne({ username });
    if (usernameExists) {
      throw {
        status: 400,
        message: "User with the username already exists",
      };
    }

    const emailExists = await user.findOne({ email });
    if (emailExists) {
      throw {
        status: 400,
        message: "User with this email already exists.",
      };
    }
  } catch (error) {
    throw {
      status: 400,
      message: error,
    };
  }
  const hashedPassword = await services.hash.hashData(password);

  const _id = services.uuid.generateUUID();

  let userData = {
    _id,
    username,
    password: hashedPassword,
    email,
    age,
    gender,
    quizzes: [],
    highestScore: null,
    lastLogin: new Date().toLocaleString(),
    firstLogin: new Date().toLocaleString(),
    activePeriod: 0,
    lifetimeCorrectAnswers: 0,
    totalQuestionsAnswered: 0,
  };

  const insert = await user.insertOne(userData);

  if (!insert.acknowledged)
    throw {
      status: 500,
      message: "Something went wrong trying to create user",
    };

  return { status: 200, userId: _id };
}

async function updateUserLastlogin(email) {
  const user = await userCollection();
  const check = [{ data: email, variable: "email", type: "string" }];
  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
  } catch (error) {
    throw { status: 400, message: error };
  }

  try {
    let updateUser = await user.updateOne(
      { email },
      { $set: { lastLogin: new Date().toLocaleString() } }
    );

    if (updateUser.modifiedCount === 0) {
      throw { status: 500, message: "Error performing DB action" };
    }

    return { status: 200, message: "User timestamp update complete" };
  } catch (error) {
    throw { status: 500, message: "Something went wrong" };
  }
}

async function getUserScore(userId) {
  const user = await userCollection();
  const check = [{ data: userId, type: "string", variable: "userId" }];
  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    const scores = await user.findOne({ _id: userId }, { totalScore: 1 });
  } catch (error) {}
}

/**
 * Add quiz details to user collection
 * @param {Quiz} quiz
 * @returns
 */
async function addQuizToUser(quiz) {
  const userCol = await userCollection();
  const { userId, _id, totalScore, answers, type } = quiz;
  const maxAchievableScore = answers.length;
  const check = [
    { data: userId, type: "string", variable: "userId" },
    { data: _id, type: "string", variable: "quizId" },
    { data: totalScore, type: "number", variable: "totalScore" },
    {
      data: maxAchievableScore,
      type: "number",
      variable: "maxAchievableScore",
    },
    { data: type, type: "string", variable: "type" },
  ];

  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    const addQuiz = await userCol.updateOne(
      { _id: userId },
      {
        $push: {
          quizzes: {
            quizId: _id,
            score: totalScore,
            maxAchievableScore,
            type,
          },
        },
      }
    );

    if (!addQuiz)
      throw {
        status: 500,
        message: "Something went wrong while adding",
      };

    return {
      status: 200,
      message: "Added quiz to user",
    };
  } catch (error) {
    throw {
      status: error.status,
      message: error.message,
    };
  }
}

/**
 *
 * @param {String} userId
 */
async function getUserDashboard(userId) {
  const check = [{ data: userId, type: "string", variable: "userId" }];

  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    //Find recent quiz
    const recentQuizzes = await getRecentQuizzes(userId);
    //Find recent forum posts
    const recentForums = await getRecentForums();

    return {
      recentQuizzes,
      recentForums,
    };
  } catch (error) {
    throw error;
  }
}

async function getRecentQuizzes(userId) {
  const userCol = await userCollection();
  const check = [{ data: userId, type: "string", variable: "userId" }];

  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);

    const user = await userCol.find({ _id: userId }).limit(3).toArray();

    const quizzes = user[0].quizzes.slice(-3);

    return quizzes;
  } catch (error) {
    throw error;
  }
}

/**
 *
 * @param {String} userId
 * @param {String} username
 * @param {String} password
 * @returns
 */
async function updateUser(userId, username, password) {
  const userCol = await userCollection();
  let check = [{ data: userId, variable: "userId", type: "string" }];
  if (username)
    check.push({ data: username, variable: "username", type: "string" });
  if (password)
    check.push({ data: password, variable: "password", type: "string" });

  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    const updateObject = {};
    if (username) updateObject.username = username;
    if (password)
      updateObject.password = await services.hash.hashData(password);

    const update = await userCol.updateOne(
      {
        _id: userId,
      },
      {
        $set: updateObject,
      }
    );

    if (!update) {
      throw {
        status: 500,
        message: "Something went wrong while updating",
      };
    }

    return {
      status: 200,
      message: "User updated",
    };
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  updateUserLastlogin,
  getUserScore,
  addQuizToUser,
  getUserDashboard,
  updateUser,
};
