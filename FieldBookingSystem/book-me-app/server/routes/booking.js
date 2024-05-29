const express = require("express");
const bookingController = require("../controllers/bookings");
const router = express.Router(); // create a router

router.get("/get_bookings", bookingController.getBooking); // GET /booking/bookings will be handled right now
router.post("/add_booking", bookingController.addBooking); //POST add booking will be handled
router.put("/approve_booking", bookingController.approveBooking); //PUT approve added booking will be handled
router.delete("/reject_booking", bookingController.rejectBooking); // DELETE reject added booking will be handled
module.exports = router; // export the router
