const settings = require("../config/settings.json");
/**
 * Checks if the user meets the age restriction criteria
 * @param {Int} age
 */
const checkInputAgeRange = (age) => {
  const min = settings.age.min;
  const max = settings.age.max;

  if (age < min || age > max)
    throw { status: 400, message: "Incorrect age range" };
};

module.exports = {
  checkInputAgeRange,
};
