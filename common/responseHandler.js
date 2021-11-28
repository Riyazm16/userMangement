const { validationResult } = require("express-validator");
const { errorHandler } = require("./errorHandler");
/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
const setResponse = (code = null, message = null) => {
  return {
    code,
    message,
  };
};

/**
 * Builds error for validation files
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next object
 */
const validateResult = (req, res, next) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (err) {
    return errorHandler(res, setResponse(400, err.array()));
  }
};

module.exports = { setResponse, validateResult };
