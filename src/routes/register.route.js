const express = require("express");
const router = express.Router();
const registerController = require("../app/controllers/RegisterController");

router.get("/", registerController.index);
router.get("/account/reset", registerController.resetPassPage);
router.post("/account/reset/confirm", registerController.confirmResetPass);
module.exports = router;
