const { ErrorFormat } = require("../utils/Construct/ErrorFormat");
const { writeLogFile } = require("../utils/Function/LogFile");

module.exports = (err, req, res, next) => {
  // console.log(err);
  const { devError, prodError } = ErrorFormat(err);

  const server = process.env.SERVER;

  let resHTTPCode = 500;

  if (err.httpStatusCode) {
    resHTTPCode = err.httpStatusCode;
  }
  if (err.status) {
    resHTTPCode = err.status;
  }
  if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
    resHTTPCode = 401; // ดัก Error จากการ Auth Token
  }
  if (err.name === "SequelizeValidationError") {
    resHTTPCode = 400;
  }

  writeLogFile(null, err);

  return res.status(resHTTPCode).json(server === "DEV" ? devError : prodError);
};
