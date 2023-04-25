const Verify = require("../model/Verify");
const usersModel = require("../model/users.model");
const bcrypt = require("bcrypt");

class RegisterController {
  // [GET] path : '/'
  index(req, res) {
    res.render("pages/RegisterPage/register", {
      layout: "regist&forgotLayout",
    });
  }
  async resetPassPage(req, res) {
    try {
      const { otp, email } = req.query;
      const verify = await Verify.findOne({ email: email, otp: otp });
      // console.log(verify);
      if (verify) {
        return res.render("pages/RegisterPage/reset", {
          layout: "regist&forgotLayout", title: "Khôi phục mật khẩu"
        });
      } else {
        return res.render("pages/errorPage/errorBooking.hbs", { layout: null });
      }
    } catch (err) {
      console.error(err);
      return res.render("pages/errorPage/errorBooking.hbs", { layout: null });
    }
  }

  async confirmResetPass(req, res) {
    try {
      const { otp, email, password } = req.body;

      const newPassword = await bcrypt.hash(password, 10);

      if (!email || !newPassword) {
        return res.json({ code: 1, message: "Email or new password is missing" });
      }

      await usersModel.findOneAndUpdate({ email: email }, { password: newPassword });
      await Verify.findOneAndDelete({ otp: otp, email: email });
      res.json({ code: 0, message: "Khôi phục tài khoản thành công" });
    } catch (err) {
      console.error(err);
      res.json({ code: 1, message: "Lỗi" })
    }
  }

}

module.exports = new RegisterController();
