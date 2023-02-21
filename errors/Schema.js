const settings = require("../config/settings.json");
const helpers = require("./helper");
const datatypes = require("./Datatypes");

/**
 * Checks if the schema for the given data are in the required format
 * @param {Object} data The input schema that needs to be validated
 * @param {String} schemaName Reference to what schema should be used to validate the data
 */
const checkSchema = (data, schemaName) => {
  const schema = settings[schemaName];
  const keys = Object.keys(data);
  if (keys.length !== schema.length)
    throw {
      status: 400,
      message: "Incorrect schema",
      inputLength: keys.length,
      requiredlength: schema.length,
    };

  keys.forEach((key) => {
    const indexFromSchema = schema.findIndex((obj) => {
      return obj.key === key;
    });

    if (schema[indexFromSchema]?.type === "array") {
      datatypes.checkIfTypeArray(data[key], key);
    } else if (typeof data[key] !== schema[indexFromSchema]["type"]) {
      throw {
        status: 400,
        message: `Incorrect type: ${key}`,
        errDetails: `Required: ${
          schema[indexFromSchema]["type"]
        }, Recieved: ${typeof data[key]}`,
      };
    }

    if (schema[indexFromSchema]["hasChildren"]) {
      if (Array.isArray(data[key])) {
        data[key].forEach((v) => {
          helpers.checkChildKey(key, v, schema, indexFromSchema);
        });
      } else {
        helpers.checkChildKey(key, data[key], schema, indexFromSchema);
      }
    }
  });
};

module.exports = { checkSchema };
