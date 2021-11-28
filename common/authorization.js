const User = require("../models/user");
const { errorHandler } = require("./errorHandler");
const { setResponse } = require("./responseHandler");
const { responseCodes } = require("../constants/commonConstants");
const { decrypt } = require("../helper/commonHelper");
/**
 * Extracts token from: header, body or query
 * @param {Object} req - request object
 * @returns {string} token - decrypted token
 */
const validateAuth = (req, res, next) => {
  return new Promise((resolve, reject) => {
    if (req.headers.authorization) {
      const jwtPayload = decrypt(req.headers.authorization);
      if (!jwtPayload) {
        reject(setResponse(responseCodes.unauthorized, "unauthorized"));
      }
      User.findById(jwtPayload.data._id, (err) => {
        req.user = jwtPayload.data;
        if (err) {
          reject(setResponse(responseCodes.unauthorized, "unauthorized"));
        }
        return resolve(next());
      });
    } else {
      reject(setResponse(responseCodes.unauthorized, "unauthorized"));
    }
  }).catch((err) => {
    errorHandler(res, err);
  });
};

module.exports = { validateAuth };
