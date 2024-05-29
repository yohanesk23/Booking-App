const mongoose = require("mongoose"); // import mongoose
// extract the schema from that mongoose object
const Schema = mongoose.Schema;
// create a new post schema
const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String,
  isLoggedIn: Boolean,
});
// export the model
module.exports = mongoose.model("users", userSchema);
