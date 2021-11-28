const User = require("../models/user");
const { setResponse } = require("../common/responseHandler");
const {
  responseCodes,
  userConstantMsg,
} = require("../constants/commonConstants");

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const addUser = (userData) => {
  return new Promise((resolve, reject) => {
    const oUser = new User(userData);
    oUser.save((err, item) => {
      if (err) {
        return reject(
          setResponse(responseCodes.unable_to_process, err.message)
        );
      }
      item = JSON.parse(JSON.stringify(item));
      delete item.password;
      return resolve(item);
    });
  });
};

/**
 * Finds user by email
 * @param {string} email - user´s email
 */
const findUser = (condition = null, select = null) => {
  return new Promise((resolve, reject) => {
    User.findOne(condition, select, async (err, item) => {
      if (!item) {
        return reject(
          setResponse(
            responseCodes.not_found,
            userConstantMsg.auth.user_not_exist
          )
        );
      }
      if (err) {
        return reject(
          setResponse(responseCodes.unable_to_process, err.message)
        );
      }
      return resolve(item);
    });
  });
};

/**
 * Finds user by email
 * @param {string} email - user´s email
 */
 const fetchAllUsers = (condition = null, select = null) => {
  return new Promise((resolve, reject) => {
    User.find(condition, select, async (err, item) => {
      if (!item) {
        return reject(
          setResponse(
            responseCodes.not_found,
            userConstantMsg.auth.user_not_exist
          )
        );
      }
      if (err) {
        return reject(
          setResponse(responseCodes.unable_to_process, err.message)
        );
      }
      return resolve(item);
    });
  });
};

/**
 * Checks User model if user with an specific email exists
 * @param {string} email - user email
 */
const emailExists = (email = null) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email,
      },
      (err, item) => {
        if (err) {
          return reject(
            setResponse(responseCodes.unable_to_process, err.message)
          );
        }
        if (item) {
          return reject(
            setResponse(
              responseCodes.success,
              userConstantMsg.auth.email_exists
            )
          );
        }
        return resolve(false);
      }
    );
  });
};

/**
 * Checks is password matches
 * @param {string} password - password
 * @param {Object} user - user object
 * @returns {boolean}
 */
const checkPassword = (password, oUser) => {
  return new Promise((resolve, reject) => {
    oUser.comparePassword(password, (err, isMatch) => {
      if (err) {
        return reject(
          setResponse(responseCodes.unable_to_process, err.message)
        );
      }
      if (!isMatch) {
        return resolve(false);
      }
      return resolve(true);
    });
  });
};

/**
 * update user
 */
const updateUser = (data = null, id = false, sendResponse = false) => {
  return new Promise((resolve, reject) => {
    User.updateOne({ _id: id }, { $set: data })
      .exec()
      .then((response) => {
        return sendResponse ? resolve(response) : resolve(true);
      })
      .catch((error) => {
        //duplicate email handling
        if (error.name === "MongoError" && error.code === 11000) {
          error = userConstantMsg.auth.dulicate_email;
        }
        return reject(setResponse(responseCodes.unable_to_process, error));
      });
  });
};

/**
 * reset password
 */
const updatePassword = (newPassword, oUser) => {
  return new Promise((resolve, reject) => {
    oUser.password = newPassword;
    oUser.save((err) => {
      if (err) {
        return reject(setResponse(responseCodes.unable_to_process, err));
      }
      return resolve(true);
    });
  });
};

module.exports = {
  addUser,
  emailExists,
  findUser,
  checkPassword,
  updateUser,
  updatePassword,
  fetchAllUsers,
};
