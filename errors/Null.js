/**
 * Checks if the input values are empty or null
 * @param {Array} inputArray
 */
const checkIfEmptyInput = (inputArray) => {
  inputArray.forEach((input) => {
    if (input.data === "" || !input.data)
      throw {
        status: 400,
        message: `Please check your ${input.variable} and try again`,
      };
  });
};

module.exports = {
  checkIfEmptyInput,
};
