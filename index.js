/* eslint-disable no-console */
const app = require("./app/app");
const { PORT } = require("./secret");
const dbConnection = require("./src/database/db");

// database connection stablish and server running
dbConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`database connection successfully`);
      console.log(`server is running http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    console.log(`database connection failed`);
  });
