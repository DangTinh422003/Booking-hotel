const bcrypt = require("bcrypt");
const usersModel = require("../model/users.model");
const Feedback = require("../model/Feedback");
const Voucher = require("../model/Voucher");
const QuestionModel = require("../model/UserQuestion");
const Card = require("../model/usersCard.model");

class APIController {
  // GET /api/users
  async users(req, res) {
    const users = await usersModel.find({});
    res.json({ successful: true, data: users });
  }

  // POST : /api/users
  async addUser(req, res) {
    const { email, password, userName, phoneNumber } = req.body;
    const newPassword = await bcrypt.hash(password, 10);
    const findUser = await usersModel.findOne({ email });
    if (findUser) {
      res.json({ status: false, message: "Email đã tồn tại!" });
    } else {
      await usersModel.create({
        email,
        password: newPassword,
        userName,
        phoneNumber,
      });
      res.json({
        status: true,
        user: { email, password: newPassword, userName, phoneNumber },
      });
    }
  }

  // POST /users/update
  async updateUser(req, res, next) {
    const {
      name,
      gender,
      email,
      phone,
      address,
      changePass,
      passNow,
      passNew,
      passNewPre,
    } = req.body;
    if (changePass) {
      // nếu người dùng muốn thay đổi mật khẩu
      usersModel
        .findOne({ email: email }) // tìm người dùng dựa trên email
        .then((user) => {
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
          bcrypt.compare(passNow, user.password, (err, result) => {
            // so sánh mật khẩu đã nhập với mật khẩu đã được mã hóa
            if (err) {
              return res.status(500).json({ message: "Internal server error" });
            }
            if (!result) {
              return res
                .status(400)
                .json({ message: "Current password is incorrect" });
            }
            if (passNew !== passNewPre) {
              return res
                .status(400)
                .json({ message: "New password confirmation does not match" });
            }
            bcrypt.hash(passNew, 10, (err, hash) => {
              // mã hóa mật khẩu mới
              if (err) {
                return res
                  .status(500)
                  .json({ message: "Internal server error" });
              }
              user.password = hash; // cập nhật mật khẩu mới đã được mã hóa vào đối tượng người dùng
              user.save(); // lưu đối tượng người dùng mới vào MongoDB
              return res
                .status(200)
                .json({ message: "Password updated successfully" });
            });
          });
        })
        .catch((error) => {
          return res.status(500).json({ message: "Internal server error" });
        });
    } else {
      // nếu không muốn thay đổi mật khẩu
      usersModel
        .findOneAndUpdate(
          { email: email },
          { name, gender, email, phone, address },
          { new: true } // trả về đối tượng người dùng mới được cập nhật
        )
        .then((user) => {
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
          return res
            .status(200)
            .json({ message: "Profile updated successfully", user });
        })
        .catch((error) => {
          return res.status(500).json({ message: "Internal server error" });
        });
    }
  }

  // [POST]  /api/login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const resCheckPassword = await usersModel.findOne({ email:email,active:true });
      const checkPassword = await bcrypt.compare(
        password,
        resCheckPassword.password
      );
      if (checkPassword) {
        req.session._id = resCheckPassword.email;
        res.json({
          status: true,
          user: { ...resCheckPassword },
        });
      } else res.json({ status: false });
    } catch (error) {
      res.json({ status: false });
    }
  }

  //LIST FB

  async listFeedBackByRoom(req, res) {
    let { idroom, star } = req.query;
    const limit = 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let feedback, data;
    try {
      data = await Feedback.find({ idroom: idroom })
        .skip(startIndex)
        .limit(limit)
        .exec();
    } catch (err) {
      res.json({ err: err });
      return;
    }

    if (!star) {
      feedback = data;
    }
    if (star) {
      feedback = data.filter((ele) => ele.starFb === Number(star));
    }

    const totalCount = await Feedback.countDocuments({ idroom: idroom }).exec();
    const totalPages = Math.ceil(totalCount / limit);

    const results = {
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: page,
      feedback: feedback,
    };

    for (let i = 0; i < feedback.length; i++) {
      try {
        let user = await usersModel.findOne({ email: feedback[i].emailUser });
        feedback[i] = {
          ...feedback[i]._doc,
          ava: user.image || null,
          name: user.userName || null,
        };
      } catch (err) {
        console.log(err);
      }
    }

    const pages = [];
    for (let i = 1; i <= results.totalPages; i++) {
      pages.push(i);
    }

    let htmlpagin;
    if (totalPages <= 1) {
      htmlpagin = `
      <div class="pagination">
        ${pages
          .map((p) => `<a class="active" href="?page=${p}">${p}</a>`)
          .join("")}
      </div>
    `;
    }
    if (totalPages > 1) {
      htmlpagin = `
      <div class="pagination">
        <a href="?page=1" class="first">Trang đầu</a>
        <a href="?page=${results.currentPage - 1}" class="prev">Trước</a>
        ${pages.map((p) => `<a href="?page=${p}">${p}</a>`).join("")}
        <a href="?page=${results.currentPage + 1}" class="next">Sau</a>
        <a href="?page=${results.totalPages}" class="last">Trang cuối</a>
      </div>
    `;
    }
    res.json({ code: 0, data: { ...results, htmlpagin } });
  }

  //GET: /api/vouchers/:idvoucher
  async GetVoucherByID(req, res) {
    const idvoucher = req.params.idvoucher;
    try {
      var voucher = await Voucher.findOne({ idvoucher: idvoucher });
      if (voucher) {
        res.status(200).json({ code: 0, voucher: voucher });
      } else {
        res.status(404).json({ code: 1, message: "Không tìm thấy voucher" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: 1, message: "Đã xảy ra lỗi" });
    }
  }

  logout(req, res) {
    delete req.session._id;
    res.json({ status: 0, message: "Đăng xuất thành công" });
  }

  // add new feedback
  async addFeedback(req, res) {
    const { star, emailUser, contentFb } = req.body;
    try {
      const newFeedback = await Feedback.create({
        starFb: star,
        emailUser,
        contentFb,
      });
      res.json({ status: true, data: newFeedback });
    } catch (error) {
      res.json({ status: false, data: error });
    }
  }

  async filterCard(req, res) {
    let { card } = req.query;
    
    let cardFilter, data;
    const users = await usersModel.find({ position: 0 })
    data = await Promise.all(users.map(async (user) => {
      let user_id = user._id.toString();
      let card = await Card.findOne({ userId: user_id});
      if(!card){
        card = new Card({user_id: user_id, cardType: -1})
      }
      return { ...user.toObject(), card: card, user_id: user_id};
    }))

    if (!card || card == 3) {
      cardFilter = data;
    }
    else{
      cardFilter = data.filter(e => e.card.cardType === Number(card));
    }
    const results = {
      cardFilter: cardFilter,
    };

    res.json({ code: 0, data: { ...results } });
  }

  async getQuestion(req, res) {
    try {
      const questions = await QuestionModel.find({
        iduser: req.params.iduser,
      });
      res.json({
        status: true,
        data: questions,
      });
    } catch (error) {
      res.json({ status: false, data: [] });
    }
  }

  async addMessage(req, res) {
    try {
      const { iduser, question } = req.body;
      const newQuestion = await QuestionModel.create({
        iduser,
        question,
      });
      res.json({ status: true, data: req.body });
    } catch (error) {
      res.json({ status: false, data: undefined });
    }
  }
}

module.exports = new APIController();
