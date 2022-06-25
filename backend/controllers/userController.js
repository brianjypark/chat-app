const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (request, response) => {
  const { name, email, password, pic } = request.body;

  if (!name || !email || !password) {
    response.status(400);
    throw new Error("Please enter all the fields that are required.");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    response.status(400);
    throw new Error("User already exists. Please try again.");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    response.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } else {
    response.status(400);
    throw new Error("Failed to create a new user.");
  }
});

const authUser = asyncHandler(async (request, response) => {
  const { email, password } = request.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    response.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      picture: user.pciture,
      token: generateToken(user._id),
    });
  }
});

module.exports = { registerUser, authUser };
