const express = require("express");
const router = express.Router();
const adminController = require("../app/controllers/AdminController");
const checkAdmin = require("../app/middwares/checkAdmin");

router.get("/login", adminController.login);
router.post("/login", adminController.checkLogin);
router.get("/", checkAdmin, adminController.home);
router.post("/", checkAdmin, adminController.postProfile);

//USER
router.get("/user", checkAdmin, adminController.listuser);
router.get("/user/detail/:email", checkAdmin, adminController.detailuser);
router.post("/user/edit", checkAdmin, adminController.edituser);
router.post("/user/delete", checkAdmin, adminController.deleteuser);

//STAFF
router.get("/nhanvien", checkAdmin, adminController.liststaff);
router.post("/nhanvien/add", checkAdmin, adminController.addstaff);
router.post("/nhanvien/edit", checkAdmin, adminController.editstaff);
router.post("/nhanvien/delete", checkAdmin, adminController.deletestaff);

//VOUCHER
router.get("/voucher", checkAdmin, adminController.voucher);
router.post("/voucher/edit", checkAdmin, adminController.editVoucher);
router.post("/voucher/delete", checkAdmin, adminController.deleteVoucher);
router.post("/voucher/add", checkAdmin, adminController.addVoucher);

//QUESTION
router.post("/rep", checkAdmin, adminController.repQuestion);
router.post("/deleteQuestion", checkAdmin, adminController.deleteQuestion);

//BOOKING
router.get("/booking", checkAdmin, adminController.bookingPage);
router.get("/booking/info/:id", checkAdmin, adminController.inforBooking);
router.get(
  "/api/list/:bookinglistbystatus",
  checkAdmin,
  adminController.listBooking
);
router.post("/booking/update", checkAdmin, adminController.updateStatusBooking);
router.get(
  "/quanly-bill-khachhang/:id/:idroom",
  checkAdmin,
  adminController.billUserPage
);
router.post("/booking/khach-hang/buy", checkAdmin, adminController.buyService);
router.put(
  "/booking/khach-hang/buy/cancel",
  checkAdmin,
  adminController.cancelService
);
router.put("/booking/payment", checkAdmin, adminController.confirmPayment);

//services
router.get("/dichvu", checkAdmin, adminController.servicePage);
router.put("/dichvu/toggle", checkAdmin, adminController.updateToggleService);
router.get("/dichvu/infor/:stt", checkAdmin, adminController.getInforService);
router.put("/dichvu/update", checkAdmin, adminController.updateService);
router.post("/dichvu/add", checkAdmin, adminController.addService);

// manage room
router.get("/khachsan", checkAdmin, adminController.getManageRoom);
router.delete("/khachsan", checkAdmin, adminController.deleteRoom);
router.post("/khachsan", checkAdmin, adminController.getRoom);
router.put("/khachsan", checkAdmin, adminController.updatetRoom);
router.put("/khachsan/undelete", checkAdmin, adminController.unDeleteRoom);
module.exports = router;
