const errorHandler = (error, req, res, next) => {
  const message = error.message ? error.message : "internal server error";
  const status = error.status ? error.status : 500;

  if (status === 500) {
    console.log(error);
  }
  res.status(status).json({
    message,
  });
};

module.exports = errorHandler;
