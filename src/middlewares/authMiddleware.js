/* eslint-disable no-underscore-dangle */ const jwt = require("jsonwebtoken");

const { ACCESS_TOKEN_SECRET } = require("../../secret");
const customError = require("../utilities/customError");

const authMiddleware = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    token = req.cookies.token;
    if (!token) {
      throw customError("Unauthorized", 401);
    }
    // checking user token validation
    // eslint-disable-next-line prefer-destructuring
    token = token.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (err) {
      throw customError("forbidden", 403);
    }

    // set user id and email in headers
    req.headers._id = decoded._id;
    req.headers.email = decoded.email;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
