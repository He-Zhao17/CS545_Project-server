const express = require("express");
const router = express.Router();
const data = require("../data");
const user = data.user;
const errorHandlers = require("../errors");
const services = require("../services");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const check = [
    { data: email, variable: "email", type: "string" },
    { data: password, variable: "password", type: "string" },
  ];
  //Error checks
  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
  } catch (error) {
    return res.status(400).json(error);
  }
  //Fetch user from db
  try {
    let userFromDB = await user.getUserByEmail(email);

    //Check if password is a match
    const match = await services.hash.compareHash(
      password,
      userFromDB.password
    );

    delete userFromDB.password;

    //Bases on match, return data
    if (match) {
      await user.updateUserLastlogin(email);
      userFromDB = await user.getUserByEmail(email);

      const token = services.token.generateToken(userFromDB._id, email, {});

      userFromDB.token = token;

      return res.json(userFromDB);
    }
    return res.json({
      status: 404,
      message: "User not found",
    });
  } catch (error) {
    res.status(error.status).json(error);
  }
});

router.post("/register", async (req, res) => {
  const { username, password, email, age, gender } = req.body;
  const check = [
    { data: username, variable: "username", type: "string" },
    { data: password, variable: "password", type: "string" },
    { data: email, variable: "email", type: "string" },
    { data: gender, variable: "gender", type: "string" },
    { data: age, variable: "age", type: "number" },
  ];
  //Error checks
  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    errorHandlers.range.checkInputAgeRange(age);
    errorHandlers.match.checkInputGender(gender);
  } catch (error) {
    return res.status(400).json(error);
  }

  try {
    const userData = await user.createUser(
      username,
      email,
      password,
      age,
      gender
    );

    const token = services.token.generateToken(userData.userId, email, {});

    userData.token = token;

    return res.json(userData);
  } catch (error) {
    return res.status(error.status).json(error.message);
  }
});

router.patch("/update", services.token.validateToken, async (req, res) => {
  const { username, password, userId } = req.body;
  let check = [{ data: userId, variable: "userId", type: "string" }];
  if (username)
    check.push({ data: username, variable: "username", type: "string" });
  if (password)
    check.push({ data: password, variable: "password", type: "string" });

  try {
    errorHandlers.datatypes.checkInputDataType(check);

    const updatedUser = await user.updateUser(userId, username, password);
    if (updatedUser.status !== 200)
      throw {
        status: updatedUser.status,
        message: updatedUser.message,
      };
    return res.json(updatedUser);
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.get("/user", services.token.validateToken, async (req, res) => {
  const { _id } = req.query;
  const check = [{ data: _id, variable: "_id", type: "string" }];
  try {
    errorHandlers.datatypes.checkInputDataType(check);
    const userAcc = await user.getUserById(_id);
    return res.json(userAcc);
  } catch (error) {
    return res.status(error.status).json(error);
  }
});
module.exports = router;
