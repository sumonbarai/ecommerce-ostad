const express = require("express");
const middleware = require("./middleware");
const router = require("../src/routes/api");
const notFoundRoute = require("./notFoundhandler");
const errorHandler = require("./errorHandler");

const app = express();

// basic middleware setup
app.use(middleware);

// route setup
app.use("/api/v1", router);

// 404 route setup
app.use(notFoundRoute);

// error handler
app.use(errorHandler);

module.exports = app;
