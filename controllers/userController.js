const User = require("../models/user");
const HttpError = require("../utils/HttpError");

// Register User
const createUser = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const userMode = req.params.userMode === "driver" ? true : false;

  let existedUser;

  try {
    existedUser = await User.findOne({ email });
  } catch (error) {
    return next(HttpError.InternalServerError(error.message));
  }

  if (existedUser) {
    return next(
      new HttpError(200, "User already exist, Please login instead.")
    );
  }

  const user = new User({
    firstName,
    lastName,
    email,
    password,
    isDriver: userMode,
  });

  try {
    await user.save();
  } catch (error) {
    return next(HttpError.BadRequest(error.message));
  }

  res.status(201).json({
    message: "Account has been successfully created.",
  });
};

// Login User
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existedUser;

  try {
    existedUser = await User.findOne({ email });
  } catch (error) {
    return next(HttpError.InternalServerError(error.message));
  }

  if (!existedUser) {
    return next(HttpError.Forbidden());
  }

  const isValidPassword = existedUser.password === password ? true : false;

  if (!isValidPassword) {
    return next(HttpError.Forbidden());
  }

  res.status(200).json(existedUser);
};

// Driver Status
const driverStatus = async (req, res, next) => {
  const { email, status } = req.body;

  let existedUser;

  try {
    existedUser = await User.findOne({ email, isDriver: true });
  } catch (error) {
    return next(HttpError.InternalServerError(error.message));
  }

  if (!existedUser) {
    return next(HttpError.Unauthorized());
  }

  try {
    existedUser.status = status;
    await existedUser.save();
  } catch (error) {
    return next(HttpError.BadRequest(error.message));
  }

  res.status(200).json({ massage: "You status has been changed." });
};

// Location Status
const locationStatus = async (req, res, next) => {
  const { email, locationX, locationY } = req.body;

  let existedUser;

  try {
    existedUser = await User.findOne({ email });
  } catch (error) {
    return next(HttpError.InternalServerError(error.message));
  }

  if (!existedUser) {
    return next(HttpError.Unauthorized());
  }

  try {
    existedUser.locationX = locationX;
    existedUser.locationY = locationY;
    await existedUser.save();
  } catch (error) {
    return next(HttpError.BadRequest(error.message));
  }

  res.status(200).json({ massage: "You status has been changed." });
};

// Match Driver
const matchDriver = async (req, res, next) => {
  const { email } = req.body;
  const threshold = 10;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(HttpError.InternalServerError(error.message));
  }

  if (!existingUser) {
    return next(HttpError.Unauthorized());
  }

  const x1 = existingUser.locationX;
  const y1 = existingUser.locationY;

  let availableDrivers;

  try {
    availableDrivers = await User.find({ isDriver: true, status: true });
  } catch (error) {
    return next(HttpError.InternalServerError(error.message));
  }

  const promise = new Promise((resolve, reject) => {
    let minDistance = Number.MAX_SAFE_INTEGER;

    let foundDriver;

    for (const i of availableDrivers) {
      const dist = Math.sqrt(
        (x1 - i.locationX) * (x1 - i.locationX) +
          (y1 - i.locationY) * (y1 - i.locationY)
      );

      if (dist < minDistance) {
        minDistance = dist;
        foundDriver = i;
      }
    }

    resolve(foundDriver);

    if (minDistance > threshold) {
      reject("Threshold value reached.");
    }
  });

  let matchDri;
  try {
    matchDri = await promise;
  } catch (error) {
    return next(HttpError.BadRequest(error.message));
  }

  res.status(200).json(matchDri);
};

exports.createUser = createUser;
exports.login = login;
exports.driverStatus = driverStatus;
exports.locationStatus = locationStatus;
exports.matchDriver = matchDriver;
