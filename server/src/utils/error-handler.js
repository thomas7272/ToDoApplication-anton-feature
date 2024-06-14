const AppError = require("../errors/app-error");

const handleErrors = (err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(err.toJson());
  } else {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

module.exports = { handleErrors };
