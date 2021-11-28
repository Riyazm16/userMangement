const express = require("express");

const userRouter = express.Router();
const trimRequest = require("trim-request");

const {
  login,
  createUser,
  updateUserById,
  getUserById,
  addProfileImage,
  resetPassword,
  getAllUsers,
} = require("../controllers/user");
const { upload } = require("../helper/fileUploadHelper");

const {
  validateCreateUser,
  validateLogin,
  validateUserId,
  validateUserProfilePic,
  validateResetPassword,
} = require("../validators/user");

userRouter.post("/register", trimRequest.all, validateCreateUser, createUser);
userRouter.get("/:id", [trimRequest.all, validateUserId, getUserById]);
userRouter.get("/", [getAllUsers]);

userRouter.patch("/profile-pic/:id", [
  trimRequest.all,
  validateUserProfilePic,
  addProfileImage,
]);
userRouter.patch("/reset-password/:id", [
  trimRequest.all,
  validateResetPassword,
  resetPassword,
]);

userRouter.patch("/:id", [
  trimRequest.all,
  validateCreateUser,
  validateUserId,
  updateUserById,
]);
/*
 * Login route
 */
userRouter.post("/login", trimRequest.all, validateLogin, login);

module.exports = userRouter;
