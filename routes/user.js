const express = require("express");
const router = express.Router();
const data = require("../data");
const user = data.user;
const errorHandlers = require("../errors");
const services = require("../services");

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const check = [{ data: userId, type: "string", variable: "userId" }];

  try {
    errorHandlers.nulls.checkIfEmptyInput(check);
    errorHandlers.datatypes.checkInputDataType(check);
    const userDetails = await user.getUserById(userId);

    delete userDetails.password;
    return res.json(userDetails);
  } catch (error) {
    return res.status(error.status).json(error);
  }
});

router.get(
  "/:userId/dashboard",
  services.token.validateToken,
  async (req, res) => {
    const { userId } = req.params;
    const check = [{ data: userId, type: "string", variable: "userId" }];

    try {
      errorHandlers.nulls.checkIfEmptyInput(check);
      errorHandlers.datatypes.checkInputDataType(check);
      const dashboard = await user.getUserDashboard(userId);
      return res.json(dashboard);
    } catch (error) {
      return res.status(error.status).json(error);
    }
  }
);

module.exports = router;
