const checkChildKey = (key, child, schema, index) => {
  const childKeys = Object.keys(child);
  childKeys.forEach((childKey, i) => {
    if (schema[index]["children"][i]["type"] !== typeof child[childKey]) {
      if (schema[index]["children"][i]["null"]) return;
      throw {
        status: 400,
        message: `Incorrect type: ${key} => ${childKey}`,
        errDetails: `Required: ${
          schema[index]["children"][i]["type"]
        }, Recieved: ${typeof child[childKey]}`,
      };
    }
  });
};

module.exports = { checkChildKey };
