const express = require("express");
const router = express.Router();
const homeController = require("../app/controllers/HomeController");

router.get("/danh-sach-tours", homeController.danhsachtours);
router.get("/danh-sach-phong", homeController.danhsachphong);
router.get("/xem-phong/:slug", homeController.detail);
router.get("/", homeController.index);

module.exports = router;
