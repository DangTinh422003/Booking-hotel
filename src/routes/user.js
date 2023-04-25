const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/UserController");
const checkUser = require("../app/middwares/checkUser");

router.get("/sendtoken", userController.sendToken);
router.get("/booking/", checkUser, userController.Booking);
router.post("/booking", userController.confirmBooking);

module.exports = router;
