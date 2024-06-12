const AppError = require("./app-error");

class AccessTokenExpiredError extends AppError {
  constructor() {
    super(
      "This token is expired. Please request a new one.",
      "ACCESS_TOKEN_ERR_01",
      401
    );
  }
}

module.exports = AccessTokenExpiredError;
