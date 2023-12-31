const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

db.on("error", () => {
  console.log("mongodb error!");
});
db.once("open", () => {
  console.log("mongodb connected!");
});

module.exports = db;