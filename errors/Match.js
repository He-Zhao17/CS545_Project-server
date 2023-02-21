const settings = require("../config/settings.json");

/**
 * Checks if Gender input matches the acceptable values
 * @param {String} gender
 */
const checkInputGender = (gender) => {
  const genders = settings.gender;
  if (!genders.includes(gender))
    throw { status: 400, message: "Incorrect gender" };
};

module.exports = { checkInputGender };
