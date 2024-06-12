class AppError extends Error {
  constructor(message, code, httpStatusCode) {
    super(message);
    this.code = code;
    this.httpStatusCode = httpStatusCode;
  }

  toString() {
    return `${this.code}: ${this.message}`;
  }

  toJson() {
    const json = {};
    json.message = this.message;
    Object.entries(this).forEach(([key, value]) => {
      json[key] = value;
    });
    return json;
  }
}

module.exports = AppError;
