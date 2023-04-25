const express = require("express");
const router = express.Router();
const veMayBayController = require("../app/controllers/VeMayBay");

router.get("/", veMayBayController.index);

module.exports = router;
