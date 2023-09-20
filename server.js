const colors = require("colors");
require("dotenv").config();
const DBConnect = require("./utils/dbConnect");

const app = require("./app");

// database connection
DBConnect();

// server
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App is running on port ${port}`.yellow.bold);
});

