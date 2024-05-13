/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
const cookieParser = require("cookie-parser");

const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const middleware = [
  morgan("dev"),
  cors(),
  cookieParser(),
  helmet(),
  mongoSanitize(),
  hpp(),
  express.json({ limit: "50mb" }),
  express.urlencoded({ extended: false, limit: "50mb" }),
  limiter,
];

module.exports = middleware;
