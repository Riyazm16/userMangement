const {
  responseCodes,
  commonResponse,
} = require("../constants/commonConstants");

/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
const errorHandler = (res = {}, err = {}) => {
  console.log("caught errorHandler  ", err);
  if (!err.code) {
    err.code = responseCodes.internal_server_error;
    err.message = commonResponse.internal_server_error_msg;
  }
  res.status(err.code).json({
    errors: {
      msg: err.message,
    },
  });
};

module.exports = { errorHandler };
