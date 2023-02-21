const dbConnection = require("./mongoConnection");
/**
 *
 * @param {String} collection
 */
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

module.exports = {
  user: getCollectionFn("user"),
  questions: getCollectionFn("questions"),
  quiz: getCollectionFn("quiz"),
  forum: getCollectionFn("forum"),
  comment: getCollectionFn("comment"),
  feedback: getCollectionFn("feedback"),
  leaderboard: getCollectionFn("leaderboard"),
};
