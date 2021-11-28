const { check, param } = require("express-validator");
const mongoose = require("mongoose");
const { validateResult } = require("../common/responseHandler");
const { userConstantMsg } = require("../constants/commonConstants");

/**
 * Validates create new item request
 */
const validateCreateUser = [
  check("first_name").exists().not().isEmpty(),
  check("last_name").exists().not().isEmpty(),
  check("email")
    .exists()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage(userConstantMsg.auth.invalid_email),
  check("password")
    .optional()
    .not()
    .isEmpty()
    .isLength({
      min: 8,
    })
    .withMessage(userConstantMsg.auth.invalid_password_length),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];
const validateLogin = [
  check("email")
    .exists()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage(userConstantMsg.auth.invalid_email),
  check("password")
    .exists()
    .not()
    .isEmpty()
    .isLength({
      min: 5,
    })
    .withMessage(userConstantMsg.auth.invalid_password_length),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];
const validateUserId = [
  param("id")
    .exists()
    .not()
    .isEmpty()
    .custom((v) => {
      return mongoose.Types.ObjectId.isValid(v);
    }),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validateUserProfilePic = [
  param("id")
    .exists()
    .not()
    .isEmpty()
    .custom((v) => {
      return mongoose.Types.ObjectId.isValid(v);
    }),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validateResetPassword = [
  check("old_password").exists().not().isEmpty().isLength({
    min: 8,
  }),
  check("new_password").exists().not().isEmpty().isLength({
    min: 8,
  }),
  param("id")
    .exists()
    .not()
    .isEmpty()
    .custom((v) => {
      return mongoose.Types.ObjectId.isValid(v);
    }),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];
module.exports = {
  validateCreateUser,
  validateLogin,
  validateUserId,
  validateUserProfilePic,
  validateResetPassword,
};
