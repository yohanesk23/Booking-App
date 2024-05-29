const mongoose = require("mongoose"); // import mongoose
// extract the schema from that mongoose object
const Schema = mongoose.Schema;
// create a new post schema
const bookingSchema = new Schema({
  title: String,
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  bookingStatus: String,
});
// export the model
module.exports = mongoose.model("bookings", bookingSchema);
