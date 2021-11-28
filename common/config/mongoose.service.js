const mongoose = require("mongoose");

let count = 0;
mongoose.set("debug", false);
const dbUrl = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DATABASE_URL}/${process.env.DB_NAME}`;

const options = {
  autoIndex: false,
  poolSize: 10,
  bufferMaxEntries: 0,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: "admin",
};
const connectWithRetry = () => {
  console.log("Connecting.... MongoDB ");
  mongoose
    .connect(dbUrl, options)
    .then(() => {
      console.log("MongoDB is connected");
    })
    .catch((err) => {
      console.log(
        "Publish MongoDB client connection unsuccessful, retry after 5 seconds. ",
        ++count
      );
      console.log(err);
      console.log("MongoDB connection with retry");
      setTimeout(connectWithRetry, 5000);
    });
};

module.exports = {
  connectWithRetry,
};
