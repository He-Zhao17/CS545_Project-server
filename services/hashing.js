require("dotenv").config();
const bcrypt = require("bcryptjs");
const saltRounds = parseInt(process.env.SALT_ROUNDS);

/**
 * @param {String} data
 * @returns
 */
const hashData = async (data) => {
  const hashed = await bcrypt.hash(data, saltRounds);
  return hashed;
};

/**
 * @param {String} compareValue
 * @param {String} hashValue
 * @returns
 */
const compareHash = async (compareValue, hashValue) => {
  const compare = await bcrypt.compare(compareValue, hashValue);
  return compare;
};

module.exports = {
  hashData,
  compareHash,
};
