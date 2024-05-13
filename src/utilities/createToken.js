/* eslint-disable import/no-extraneous-dependencies */
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = require("../../secret");

const createToken = (data, options) => {
  return jwt.sign(
    {
      ...data,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "1d", ...options }
  );
};

module.exports = createToken;
