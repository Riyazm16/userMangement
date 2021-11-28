const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "My API",
    description: "Description",
  },
  host: "localhost:3000/api",
  schemes: ["http"],
  definitions: {
    user: {
      first_name: { type: "string" },
      last_name: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
      status: { type: "string", enum: ["active", "inactive"] },
      profileUrl: { type: "string" },
      deletedAt: { type: "string", format: "date-time" },
      deleted_by: { type: "string" },
      _id: { type: "string" },
      updatedAt: { type: "string", format: "date-time" },
      createdAt: { type: "string", format: "date-time" },
    },
  },
};

const outputFile = "swagger-api-doc.json";
const endpointsFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
