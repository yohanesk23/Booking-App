const Booking = require("../models/booking");

exports.addBooking = (req, res, next) => {
  const booking = new Booking({
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    bookingStatus: req.body.bookingStatus,
  });

  // save the instance to the database
  booking
    .save()
    .then((bookingSaved) => {
      res.status(201).json({
        message: "Booking created successfully!",
        booking: bookingSaved,
        status: 201,
      });
    })
    .catch((err) => console.log("err", err));
};

exports.getBooking = (re, res, next) => {
  Booking.find().then((data) => {
    res.json({
      status: 200,
      bookings: data,
    });
  });
};

exports.approveBooking = (req, res, next) => {
  Booking.findOneAndUpdate(
    { _id: req.body._id },
    { bookingStatus: req.body.status }
  )
    .then((data) => {
      res.json({ status: 200, bookings: data });
    })
    .catch((error) => {
      res.json({
        type: 404,
        message: error,
      });
    });
};

exports.rejectBooking = (req, res, next) => {
  Booking.deleteOne({ _id: req.body._id })
    .then((data) => {
      res.json({
        data: data,
      });
    })
    .catch((error) => {
      res.json({
        type: 404,
        message: error,
      });
    });
};
