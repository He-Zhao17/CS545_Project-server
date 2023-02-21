const uuidV4 = require("uuid").v4;

/**
 * Generates UUID
 */
const generateUUID = () => {
  const userId = uuidV4();
  return userId;
};

module.exports = {
  generateUUID,
};
