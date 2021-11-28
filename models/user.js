const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { users } = require("../constants/collections");
const { userStatusEnum } = require("../constants/commonConstants");

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      default: null,
    },
    last_name: {
      type: String,
      required: true,
      default: null,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      default: null,
    },
    password: {
      type: String,
      select: false,
      default: null,
    },
    profileUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: userStatusEnum,
      default: "active",
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deleted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: users.model,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const hash = (user, salt, next) => {
  bcrypt.hash(user.password, salt, (error, newHash) => {
    if (error) {
      return next(error);
    }
    user.password = newHash;
    return next();
  });
};

const genSalt = (user, SALT_FACTOR, next) => {
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err);
    }
    return hash(user, salt, next);
  });
};

UserSchema.pre("save", function (next) {
  const that = this;
  const SALT_FACTOR = 5;
  if (!that.isModified("password")) {
    return next();
  }
  return genSalt(that, SALT_FACTOR, next);
});

UserSchema.methods.comparePassword = function (passwordAttempt, cb) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) => {
    return err ? cb(err) : cb(null, isMatch);
  });
};


module.exports = mongoose.model(users.model, UserSchema, users.collection);
