const express = require("express");
const router = express.Router();
const apiController = require("../app/controllers/API.controller");
const sendEmail = require("../app/middwares/sendEmail");

router.get("/users", apiController.users);
router.post("/users", apiController.addUser);
router.post("/login", apiController.login);
router.post("/logout", apiController.logout);
router.post("/feedback", apiController.addFeedback);
router.get("/question/:iduser", apiController.getQuestion);
router.post("/question", apiController.addMessage);
router.post("/users/update", apiController.updateUser);
router.get("/listfeedback", apiController.listFeedBackByRoom);
router.get("/filtercard", apiController.filterCard);

router.post("/forgot", sendEmail);
router.get("/vouchers/:idvoucher", apiController.GetVoucherByID);

module.exports = router;
