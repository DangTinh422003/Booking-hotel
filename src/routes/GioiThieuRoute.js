const express = require("express");
const router = express.Router();
const gioiThieuController = require("../app/controllers/GioiThieu.controller");

router.get("/", gioiThieuController.index);

module.exports = router;
