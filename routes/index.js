const express = require("express");
const userRouter = require("./user");
const { validateAuth } = require("../common/authorization");
const { commonResponse } = require("../constants/commonConstants");
const app = express();

app.use((req, res, next) => {
  console.log(req.url);
  const publicRoutes = ["/", "/user/login", "/user/register"];
  if (publicRoutes.includes(req.url)) {
    next();
  } else {
    validateAuth(req, res, next);
  }
});
// Routes which should handle requests
app.use("/user", userRouter);

// Error handler for routes
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: commonResponse.endpoint_not_found,
    },
  });
});

module.exports = app;
