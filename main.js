require("./common/config/envConfig").config();
const express = require("express");

const app = express();
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-api-doc.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
  mongoSanitize({
    replaceWith: "_",
    onSanitize: ({ req, key }) => {
      console.log(
        `Request: ${req.originalUrl} | This request[${key}] is sanitized`
      );
    },
  })
);
console.log(`APP_ENVIRONMENT:::: ${process.env.ENVIRONMENT}`);
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.use(cors());
app.use(compression());
const port = process.env.PORT || 3070;
app.use("/api/", require("./routes"));

app.listen(port, (err) => {
  if (err) {
    console.error("Error::", err);
  }
  console.info(`running server on from port - ${port}`);
});
require("./common/config/mongoose.service").connectWithRetry();

app.use((err, req, res, next) => {
  console.log(22);
  console.error(err.stack);
  res.status(500).json({
    message: "Something broke please try again after some time",
  });
});

process
  .on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection at:", p, "reason:", reason);
    process.exit(0);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });
module.exports = app;
