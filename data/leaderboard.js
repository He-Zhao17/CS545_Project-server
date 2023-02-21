const mongoCollection = require("../config/mongoCollections");
const leaderboardCollection = mongoCollection.leaderboard;
const errorHandlers = require("../errors");
const services = require("../services");

/**
 *
 * @param {String} userId
 * @param {String} username
 * @param {Int} score
 */
const addScore = async (userId, username, score) => {
  const leaderboard = await leaderboardCollection();
  const check = [
    { data: userId, type: "string", variable: "userId" },
    { data: username, type: "string", variable: "username" },
    { data: score, type: "number", variable: "score" },
  ];
  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);

    const currentScore = await leaderboard.findOne({ userId: userId });
    let updatedScore = null;
    if (currentScore) {
      if (currentScore.score < score) {
        updatedScore = score;
        const update = await leaderboard.updateOne(
          { userId: userId },
          { $set: { score: updatedScore } }
        );

        if (update.modifiedCount === 0) {
          throw {
            status: 500,
            message: "Could not update score",
          };
        }

        return {
          status: 200,
          message: "Score updated",
        };
      } else {
        return {
          status: 200,
          message: "Score not high enough to be added to leaderboard",
        };
      }
    }

    const newScore = {
      _id: services.uuid.generateUUID(),
      userId: userId,
      username: username,
      score: score,
    };

    const insertInfo = await leaderboard.insertOne(newScore);
    if (insertInfo.insertedCount === 0)
      throw {
        status: 500,
        message: "Could not add score",
      };

    return {
      status: 200,
      message: "Score added to leaderboard",
    };
  } catch (error) {
    throw {
      status: error.status,
      message: error.message,
    };
  }
};

const getLeaderboard = async () => {
  const leaderboard = await leaderboardCollection();
  try {
    const leaderboardData = await leaderboard.find({}).toArray();
    return {
      status: 200,
      data: leaderboardData,
    };
  } catch (error) {
    throw {
      status: 500,
      message: "Could not get leaderboard",
    };
  }
};
module.exports = {
  addScore,
  getLeaderboard,
};
