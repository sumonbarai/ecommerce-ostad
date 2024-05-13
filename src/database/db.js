const mongoose = require("mongoose");
const { DATABASE_URI } = require("../../secret");
const { DATABASE_NAME } = require("../../app/constants");

const dbConnection = () =>
  // eslint-disable-next-line implicit-arrow-linebreak
  mongoose.connect(DATABASE_URI + DATABASE_NAME, {
    autoIndex: true,
  });

module.exports = dbConnection;
