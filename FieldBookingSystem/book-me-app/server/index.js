const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const bookingRoutes = require("./routes/booking");
const userRoutes = require("./routes/user");
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
  methods: "GET, PUT, POST, DELETE",
};

app.use(express.json()); // to parse incoming json
app.use(cors(corsOptions));
app.use("/bookings", bookingRoutes);
app.use("/user", userRoutes);
mongoose
  .connect(`${process.env.MONGO_DB_URL}`, {
    useNewUrlParser: true,
  })
  .then((result) => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("err", err));
