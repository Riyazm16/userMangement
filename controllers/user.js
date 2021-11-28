const { matchedData } = require("express-validator");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../common/errorHandler");
const {
  addUser,
  emailExists,
  findUser,
  updateUser,
  checkPassword,
  updatePassword,
  fetchAllUsers,
} = require("../odm/user");
const { encrypt, escapeRegex } = require("../helper/commonHelper");
const { setResponse } = require("../common/responseHandler");
const { upload } = require("../helper/fileUploadHelper");
const {
  responseCodes,
  userConstantMsg,
} = require("../constants/commonConstants");
/**
 * Create item function called by route
 */
const createUser = async (req, res) => {
  try {
    await emailExists(req.body.email);
    const newUser = await addUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    errorHandler(res, error);
  }
};

const login = async (req, res) => {
  try {
    const data = matchedData(req);
    const user = await findUser(
      {
        email: RegExp(`^${escapeRegex(data.email.trim())}$`, "i"),
        status: "active",
      },
      "password name email role status"
    );
    if (user) {
      const isPasswordMatch = await checkPassword(data.password, user);
      if (!isPasswordMatch) {
        throw setResponse(
          responseCodes.bad_request,
          userConstantMsg.auth.invalid_password
        );
      } else {
        const expiration =
          Math.floor(Date.now() / 1000) +
          60 * process.env.JWT_EXPIRATION_IN_MINUTES;
        const responseData = {
          name: user.name,
          email: user.email,
          role: user.role,
          id: user._id,
        };
        const userToken = encrypt(
          jwt.sign(
            {
              data: responseData,
              exp: expiration,
            },
            process.env.JWT_SECRET
          )
        );
        res.status(200).json({
          token: userToken,
          user: responseData,
        });
      }
    } else {
      throw setResponse(
        responseCodes.not_found,
        userConstantMsg.auth.user_not_exist
      );
    }
  } catch (error) {
    errorHandler(res, error);
  }
};

/**
 * get user by id
 */
const getUserById = async (req, res) => {
  try {
    res
      .status(responseCodes.success)
      .json(
        await findUser({ _id: req.params.id, deletedAt: null }, "-password")
      );
  } catch (error) {
    errorHandler(res, error);
  }
};

/**
 * update user
 */
const updateUserById = async (req, res) => {
  try {
    await findUser({ _id: req.params.id }, {});
    if (req.body.password) {
      delete req.body.password;
    }
    const newUsereData = await updateUser(req.body, req.params.id, true);
    if (newUsereData) {
      res
        .status(responseCodes.success)
        .json({ msg: userConstantMsg.auth.user_updated_suceess });
    }
  } catch (error) {
    errorHandler(res, error);
  }
};

/**
 * reset user
 */
const resetPassword = async (req, res) => {
  try {
    const userData = await findUser({ _id: req.params.id }, { password: 1 });
    const isPasswordMatch = await checkPassword(
      req.body.old_password,
      userData
    );
    if (!isPasswordMatch) {
      throw setResponse(
        responseCodes.bad_request,
        userConstantMsg.auth.invalid_password
      );
    }
    if (updatePassword(req.body.new_password, userData)) {
      res
        .status(responseCodes.success)
        .json({ msg: userConstantMsg.auth.user_password_update_suceess });
    }
  } catch (error) {
    errorHandler(res, error);
  }
};

const addProfileImage = async (req, res) => {
  try {
    await findUser({ _id: req.params.id }, {});
    upload.single("profile_img")(req, res, async (err) => {
      if (err) {
        return errorHandler(
          res,
          setResponse(
            responseCodes.bad_request,
            userConstantMsg.auth.profile_image_invalid
          )
        );
      }
      await updateUser(
        { profileUrl: req.file.location },
        req.params.id,
        false
      ).then((resp) => {
        if (resp) {
          res
            .status(responseCodes.success)
            .json({ msg: userConstantMsg.auth.profile_image_success });
        }
      });
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

/**
 *Fetch all users
 */
const getAllUsers = async (req, res) => {
  try {
    res
      .status(responseCodes.success)
      .json(await fetchAllUsers({ deletedAt: null, status: "active" }, {}));
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  createUser,
  login,
  updateUserById,
  getUserById,
  addProfileImage,
  resetPassword,
  getAllUsers,
};
