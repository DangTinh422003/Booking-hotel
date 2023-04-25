const express = require("express");
const router = express.Router();
const profileController = require("../app/controllers/Profile.controller");
const checkUser = require("../app/middwares/checkUser");
const upload = require("../app/middwares/userUpload")

router.get("/", checkUser,profileController.profile);
router.get("/history",checkUser, profileController.history);
router.get("/voucher",checkUser, profileController.voucher);
router.get("/card", checkUser,profileController.card);
router.get("/question", checkUser,profileController.question);
// router.get("/logout",profileController.logout);

router.post("/",checkUser,profileController.postProfile);
router.post("/history",checkUser,profileController.feedback);
router.post("/card",checkUser,profileController.registerCard)
router.put("/edit-user-image", checkUser, upload.single('image'), profileController.editUserImage)

module.exports = router;
