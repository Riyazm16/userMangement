const path = require("path");

exports.config = () => {
  const environment = process.env.env || process.env.ENVIRONMENT;
  const envPath = "./environments/.env-dev";
  require("dotenv").config({ path: path.resolve(process.cwd(), envPath) });
  console.log("BUILD_ENV_PATH::::::", envPath);
  return environment;
};
