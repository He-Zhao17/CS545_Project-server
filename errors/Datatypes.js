/**
 * Checks datatypes of inputs
 * @param {Array} inputArray
 */
const checkInputDataType = (inputArray) => {
  inputArray.forEach((input) => {
    if (typeof input.data !== input.type)
      throw {
        status: 400,
        message: `Please check your ${input.variable} and try again`,
      };
  });
};

/**
 * Checks if the parameter is of type Array
 * @param {Array} input
 * @param {String} key
 * @return Boolean
 */
const checkIfTypeArray = (input, key) => {
  if (!Array.isArray(input))
    throw {
      status: 400,
      message: `Incorrect type: ${key}`,
    };
};

/**
 * Checks if the id is of the correct type
 * @param {ObjectId} id
 */
const checkInputObjectId = (id) => {
  if (!ObjectId(id)) throw { status: 400, message: "Incorrect Id" };
};

module.exports = { checkInputDataType, checkIfTypeArray, checkInputObjectId };
