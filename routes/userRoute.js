const express = require("express");
const {
  createUser,
  login,
  driverStatus,
  matchDriver,
  locationStatus,
} = require("../controllers/userController");

const router = express.Router();

// For registering the user
router.post("/register/:userMode", createUser);

// For login the user
router.post("/login", login);

// For change the status of driver
router.patch("/status", driverStatus);

// For change the location of driver
router.patch("/location", locationStatus);

// For find the match driver
router.post("/matchDriver", matchDriver);

module.exports = router;
