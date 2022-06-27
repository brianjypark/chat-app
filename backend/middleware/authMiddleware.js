const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const checkAuth = asyncHandler(async (request, response, next) => {
  let token;

  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = request.headers.authorization.split(" ")[1];

      const decode = jwt.verify(token, process.env.JWT_SALT);

      request.user = await User.findById(decode.id).select("-password");

      next();
    } catch (error) {
      response.status(401);
      throw new Error("Not authorized.");
    }
  }

  if (!token) {
    response.status(401);
    throw new Error("Not authorized, no token.");
  }
});

module.exports = { checkAuth };
