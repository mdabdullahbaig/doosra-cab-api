class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }

  static BadRequest(message) {
    return new HttpError(400, message || "400 Bad Request");
  }

  static Unauthorized(message) {
    return new HttpError(401, message || "401 Unauthorized");
  }

  static Forbidden(message) {
    return new HttpError(403, message || "403 Forbidden");
  }

  static NotFound(message) {
    return new HttpError(404, message || "404 Not Found");
  }

  static InternalServerError(message) {
    return new HttpError(500, message || "500 Internal Server Error");
  }
}

module.exports = HttpError;
