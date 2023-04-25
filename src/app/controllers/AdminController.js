const usersModel = require("../model/users.model");
const Room = require("../model/Room");
const User = require("../model/users.model");
const bcrypt = require("bcrypt");
const Booking = require("../model/Booking");
const Service = require("../model/Service");
const Feedback = require("../model/Feedback");
const Question = require("../model/UserQuestion");
const Voucher = require("../model/Voucher");
const Card = require("../model/usersCard.model");
const { response } = require("express");
const moment = require("moment");
const cloudinary = require("../middwares/cloudinary");
const { config } = require("dotenv");

class AdminController {
  // ADMIN
  async postProfile(req, res) {
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
    console.log(
      name,
      gender,
      email,
      phone,
      address,
      changePass,
      passNow,
      passNew,
      passNewPre
    );
    try {
      if (changePass) {
        const user = await User.findOne({ email: email });
        if (!user) {
          return res.status(422).json({
            errors: {
              message: "Không tìm thấy người dùng, hãy thử đăng nhập lại",
            },
          });
        }
        const match = await bcrypt.compare(passNow, user.password);
        if (!match) {
          return res
            .status(422)
            .json({ errors: { message: "Current password is incorrect" } });
        }
        if (passNew !== passNewPre) {
          return res.status(422).json({
            errors: { message: "New password confirmation does not match" },
          });
        }
        const hash = await bcrypt.hash(passNew, 10);
        user.password = hash;
        user.name = name;
        user.gender = gender;
        user.phone = phone;
        user.address = address;
        await user.save();
        return res
          .status(200)
          .json({ message: "Cập nhật thông tin thành công" });
      } else {
        const user = await User.findOneAndUpdate(
          { email: email },
          { userName: name, gender, phoneNumber: phone, address },
          { new: true }
        );
        if (!user) {
          return res.status(422).json({
            errors: {
              message: "Không tìm thấy người dùng, hãy thử đăng nhập lại",
            },
          });
        }
        return res
          .status(200)
          .json({ message: "Cập nhật thông tin thành công" });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ errors: { message: "Internal server error" } });
    }
  }

  //  CHECK LOGIN
  async login(req, res) {
    res.render("pages/adminPage/login", { layout: null });
  }

  async checkLogin(req, res) {
    try {
      const { email, password } = req.body;
      const resCheckPassword = await usersModel.findOne({ email, position: 2 });
      const checkPassword = await bcrypt.compare(
        password,
        resCheckPassword.password
      );
      if (checkPassword) {
        req.session._id = resCheckPassword.email;
        res.redirect("/admin");
      } else res.json({ status: false });
    } catch (error) {
      res.redirect("/admin/login");
    }
  }

  // Quản lý thống kê, tin nhắn, voucher
  async home(req, res) {
    const email = req.session._id;
    const user = await User.findOne({ email });
    let bookings = await Booking.find({});

    // Lấy ngày hôm nay và ngày hôm qua
    const today = new Date();
    const oneDayAgo = new Date(today);
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    // Chuyển đổi đối tượng Date sang chuỗi ngày tháng
    const oneDayAgoString = oneDayAgo.toLocaleDateString();

    // Tính ngày nhỏ nhất trong cơ sở dữ liệu
    let earliestBooking = bookings.reduce((earliest, current) => {
      if (new Date(current.timeBooking) < new Date(earliest.timeBooking)) {
        return current;
      } else {
        return earliest;
      }
    });
    const timeBookingEarlyString = earliestBooking.timeBooking;
    // console.log(timeBookingEarlyString)

    // Truy vấn các booking từ ngày nhỏ nhất đến ngày hôm qua
    const bookingsLastDay = bookings.filter((booking) => {
      const bookingDate = new Date(booking.timeBooking);
      return bookingDate >= new Date(timeBookingEarlyString) && bookingDate < oneDayAgo;
    });

    const upOrDown =
      bookings.length > bookingsLastDay.length
        ? bookings.length - bookingsLastDay.length
        : 0;
    const bookingsUpOrDown = upOrDown;
    // so sánh doanh thu hiện tại so với hôm qua
    const revenue = bookings.reduce((total, booking) => {
      if (booking.statusBooking === 3) {
        // trạng thái đã trả phòng
        return total + booking.totalBill;
      } else {
        return total;
      }
    }, 0);
    // truy vấn các check out từ nhỏ nhất đến hôm qua
    const checkoutLastDay = bookings.filter((booking) => {
      const bookingDate = new Date(booking.checkout);
      return bookingDate >= new Date(timeBookingEarlyString) && bookingDate < oneDayAgo;
    });
    let revenueLastDay = checkoutLastDay.reduce((total, booking) => {
      if (booking.statusBooking === 3) {
        // trạng thái đã trả phòng
        return total + booking.totalBill;
      } else {
        return total;
      }
    }, 0);
    console.log(bookings.length);
    console.log(bookingsLastDay.length);
    console.log(checkoutLastDay.length);
    revenueLastDay =
      revenue > revenueLastDay
        ? revenue - revenueLastDay
        : revenue < revenueLastDay
        ? revenueLastDay - revenue
        : 0;
    // Khách hàng
    const customers = await User.find({ position: 0 });

    // Mức độ hài lòng trung bình
    const feedbacks = await Feedback.find({});
    const satisfied =
      feedbacks.reduce((total, feedback) => {
        return total + feedback.starFb;
      }, 0) / feedbacks.length;
    // Mức độ hài lòng trong ngày hôm qua
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    let satisfiedLastDay =
      feedbacks
        .filter((feedback) => {
          const feedbackDate = new Date(feedback.timeFb);
          return feedbackDate >= yesterday && feedbackDate <= now;
        })
        .reduce((total, feedback) => {
          return total + feedback.starFb;
        }, 0) / feedbacks.length;
    satisfiedLastDay =
      satisfied > satisfiedLastDay
        ? satisfied - satisfiedLastDay
        : satisfied < satisfiedLastDay
        ? satisfied - satisfiedLastDay
        : 0;
    const services = await Service.find({});
    const rooms = await Room.find({});
    // console.log(bookings)
    // console.log(feedbacks)
    let questions = await Question.find({ rep: false });
    for (let i = 0; i < questions.length; i++) {
      const user = await User.findOne({ _id: questions[i].iduser });
      if (user) {
        questions[i].imgUser = user.image;
        questions[i].nameUser = user.userName;
      }
      const date = moment(questions[i].datesend);
      const formattedDate = date.format("DD/MM/YYYY HH:mm");
      questions[i].datesendString = formattedDate;
    }

    // console.log(questions)
    const questionsLength = questions.length;

    const { _id, ...adminData } = user.toObject();
    res.render("pages/adminPage/home", {
      layout: "adminLayout",
      adminData,
      bookings,
      bookingsUpOrDown,
      revenue,
      revenueLastDay,
      customers,
      satisfied: satisfied.toFixed(1),
      satisfiedLastDay: satisfiedLastDay.toFixed(1),
      services,
      rooms,
      feedbacks,
      questions,
      questionsLength,
    });
  }

  async repQuestion(req, res) {
    const { id, repquestion } = req.body;
    // console.log(id)
    // console.log(repquestion)
    try {
      const question = await Question.findOne({ _id: id });
      question.repquestion = repquestion;
      question.daterep = Date.now();
      question.rep = true;
      const updateQuestion = new Question(question);
      await updateQuestion.save();
      // Trả về kết quả cho client
      res.status(200).json({ message: "Đã lưu câu hỏi vào cơ sở dữ liệu" });
    } catch (e) {
      console.error("Lỗi khi thao tác cơ sở dữ liệu:", e);
      res.status(500).send("Đã xảy ra lỗi khi thao tác cơ sở dữ liệu");
    }
  }

  async deleteQuestion(req, res) {
    const { id } = req.body;
    // console.log(id)
    try {
      const result = await Question.findOneAndDelete({ _id: id });
      if (result) {
        res.status(200).json({ message: "Xóa thành công" });
      } else {
        res.status(500).json({ message: "Xóa không thành công" });
      }
    } catch (e) {
      console.error("Lỗi khi thao tác với cơ sở dữ liệu:", e);
      res.status(500).send("Đã xảy ra lỗi khi thao tác với cơ sở dữ liệu");
    }
  }
  // voucher
  async voucher(req, res) {
    const email = req.session._id;
    try {
      const user = await User.findOne({ email });
      const { _id, ...adminData } = user.toObject();

      const vouchers = await Voucher.find({});
      for (let i = 0; i < vouchers.length; i++) {
        vouchers[i].conlai = vouchers[i].quantity - vouchers[i].dasudung;
        const date = moment(vouchers[i].to);
        const formattedDate = date.format("DD/MM/YYYY HH:mm");
        vouchers[i].hsd = formattedDate;
      }
      // console.log(vouchers)
      res.render("pages/adminPage/voucher", {
        layout: "adminLayout",
        adminData,
        vouchers,
      });
    } catch (e) {
      console.error("Lỗi khi thao tác với cơ sở dữ liệu:", e);
      res.status(500).send("Đã xảy ra lỗi khi thao tác với cơ sở dữ liệu");
    }
  }

  async editVoucher(req, res) {
    const { idvoucher, valuevc, quantity } = req.body;
    try {
      const result = await Voucher.findOneAndUpdate(
        { idvoucher: idvoucher },
        { valuevc: valuevc, quantity: quantity },
        { new: true }
      );
      if (result) {
        res.status(200).json({ message: result });
      } else {
        res.status(500).json({ message: "Cập nhật không thành công" });
      }
    } catch (e) {
      console.error("Lỗi khi thao tác với cơ sở dữ liệu:", e);
      res.status(500).send("Đã xảy ra lỗi khi thao tác với cơ sở dữ liệu");
    }
  }

  async deleteVoucher(req, res) {
    const { idvoucher } = req.body;
    try {
      const result = await Voucher.findOneAndDelete({ idvoucher: idvoucher });
      if (result) {
        res.status(200).json({ message: "Xóa thành công" });
      } else {
        res.status(500).json({ message: "Xóa không thành công" });
      }
    } catch (e) {
      console.error("Lỗi khi thao tác với cơ sở dữ liệu:", e);
      res.status(500).send("Đã xảy ra lỗi khi thao tác với cơ sở dữ liệu");
    }
  }

  async addVoucher(req, res) {
    const { idvoucher, valuevc, quantity, namevc } = req.body;
    try {
      const dasudung = 0;
      const from = new Date();
      const to = new Date();
      to.setMonth(from.getMonth() + 1);
      const newVoucher = new Voucher({
        idvoucher: idvoucher,
        valuevc: valuevc,
        quantity: quantity,
        namevc: namevc,
        dasudung: dasudung,
        from: from,
        to: to,
      });
      const result = await newVoucher.save();
      if (result) {
        res.status(200).json({ message: "Thêm thành công" });
      } else {
        res.status(500).json({ message: "Thêm không thành công" });
      }
    } catch (e) {
      console.error("Lỗi khi thao tác với cơ sở dữ liệu:", e);
      res.status(500).send("Đã xảy ra lỗi khi thao tác với cơ sở dữ liệu");
    }
  }

  //  QUẢN LÝ USER
  async listuser(req, res) {
    res.render("pages/adminPage/listuser", {
      layout: "adminLayout",
    });
  }

  async detailuser(req, res) {
    const email = req.params.email;
    const allBookingUser = await Booking.find({ emailUser: email });
    const bookings = await Promise.all(
      allBookingUser.map(async (booking) => {
        const room = await Room.findOne({ number_room: booking.idroom });
        return { ...booking.toObject(), room: room };
      })
    );

    const bookingstt = [];
    for (let i = 0; i < 5; i++) {
      bookingstt.push(
        bookings.filter((booking) => booking.statusBooking === i)
      );
    }

    res.render("pages/adminPage/detailuser", {
      layout: "adminLayout",
      bookings,
      bookingstt,
    });
  }

  async edituser(req, res) {
    const email = req.body.email;

    const user = await usersModel.findOne({ email: email });
    if (!user) {
      res.json({ code: 1, message: "User not found" });
    }

    const { _id } = user.toObject();

    let { gender, phone, cardClass, name } = req.body;

    const card = await Card.findOne({ userId: _id.toString() });
    if (card) {
      card.cardType = parseInt(cardClass);
      await card.save();
    } else {
      const newCard = new Card({
        userId: _id.toString(),
        cardType: parseInt(cardClass),
        expiredDate: new Date(),
      });

      await newCard.save();
    }
    usersModel
      .findOneAndUpdate(
        { email: email },
        {
          id: _id.toString(),
          userName: name,
          gender: gender,
          phoneNumber: phone,
        },
        {
          new: true,
        }
      )
      .then((user) => {
        if (user) {
          res.json({ code: 0, data: user, message: "Update successfully" });
        } else {
          res.json({ code: 1, message: "User not found" });
        }
      })
      .catch((e) => {
        res.json({ code: 2, message: e.message });
      });
  }

  async deleteuser(req, res) {
    const userID = req.body.email;
    console.log(userID);
    const user = await usersModel.findOne({ email: userID, active: true });
    if (!user) {
      res.json({ code: 1, message: "User not found" });
    }

    usersModel
      .findOneAndUpdate({ email: userID }, { active: false })
      .then((user) => {
        if (user) {
          res.json({ code: 0, data: user, message: "Delete successfully" });
        } else {
          res.json({ code: 1, message: "User not found" });
        }
      })
      .catch((e) => {
        res.json({ code: 2, message: e.message });
      });
  }

  //  QUẢN LÝ STAFF
  async liststaff(req, res) {
    const staff = await usersModel.find({ position: 1 }).then((staff) => {
      res.render("pages/adminPage/liststaff", {
        layout: "adminLayout",
        staff: staff,
      });
    });
  }

  async addstaff(req, res) {
    let {name, email,password, phone, gender, address, image} = req.body;
    const hash = await bcrypt.hash(password, 10);
    const result = await cloudinary.uploader.upload(image);
    if(!address){
      address = 'Chưa cập nhật';
    }
    const newStaff = new usersModel({
        userName : name, email : email, password : hash, gender: gender, phoneNumber : phone, address: address, position: 1, image: result.secure_url,
        cloudinary_id: result.public_id
    })

    newStaff.save()
    .then(() => {
      res.json({ code: 0, message: "Staff updated successfully"})
    })
    .catch(e => {
      res.json({ code: 2, message: e.message})
    })
  }

  async editstaff(req, res) {
    const email = req.body.email;
    const staff = await usersModel.findOne({ email: email });
    if (!staff) {
      res.json({ code: 1, message: "Staff not found" });
    }

    let { name, address, phone, gender } = req.body;
    usersModel
      .findOneAndUpdate(
        { email: email },
        {
          userName: name,
          gender: gender,
          address: address,
          phoneNumber: phone,
        },
        {
          new: true,
        }
      )
      .then((staff) => {
        if (staff) {
          res.json({
            code: 0,
            data: staff,
            message: "Staff updated successfully",
          });
        } else {
          res.json({ code: 1, message: "Staff not found" });
        }
      })
      .catch((e) => {
        res.json({ code: 2, message: e.message });
      });
  }

  async deletestaff(req, res) {
    const email = req.body.email;

    const staff = await usersModel.findOne({ email: email, active: true });
    if (!staff) {
      res.json({ code: 1, message: "Staff not found" });
    }

    usersModel
      .findOneAndUpdate({ email: email }, { active: false })
      .then((staff) => {
        if (staff) {
          res.json({ code: 0, data: staff, message: "Delete successfully" });
        } else {
          res.json({ code: 1, message: "Staff not found" });
        }
      })
      .catch((e) => {
        res.json({ code: 2, message: e.message });
      });
  }

  // QUẢN LÝ BOOKING
  async bookingPage(req, res) {
    const email = req.session._id;
    const user = await User.findOne({ email });
    const { _id, ...adminData } = user.toObject();
    res.render("pages/adminPage/booking", { layout: "adminLayout", adminData });
  }
  async listBooking(req, res) {
    try {
      const bookinglistbystatus = req.params.bookinglistbystatus;
      const data = await Booking.find({ statusBooking: bookinglistbystatus });
      for (let i = 0; i < data.length; i++) {
        let room = await Room.findOne({ number_room: data[i].idroom });
        data[i] = {
          ...data[i]._doc,
          namer: room ? room.name_room : null,
          imgr: room ? room.img_room : null,
        };
      }
      res.json({ code: 0, data: data });
    } catch (err) {
      console.error(err);
      res.json({ code: 1, message: "Error data" });
    }
  }

  async inforBooking(req, res) {
    const id = req.params.id;

    try {
      const dataBooking = await Booking.findOne({ _id: id });

      if (!dataBooking) {
        return res.status(404).send("Booking not found");
      }

      const user = await usersModel.findOne({ email: dataBooking.emailUser });
      if (!user) {
        return res.status(404).send("User not found");
      }

      res.json({
        code: 0,
        data: { ...dataBooking.toObject(), inforUser: user || null },
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred");
    }
  }

  async updateStatusBooking(req, res) {
    const { idbooking, statusbooking } = req.body;
    await Booking.findOneAndUpdate(
      { _id: idbooking },
      { statusBooking: statusbooking }
    )
      .then(() => {
        res.json({ code: 0, message: "Success" });
      })
      .catch((err) =>
        res.json({ code: 1, message: "Không tìm thấy thông tin hợp lệ" })
      );
  }

  async billUserPage(req, res) {
    const id = req.params.id;
    const idroom = req.params.idroom;
    const email = req.session._id;
    const user = await User.findOne({ email });
    const { _id, ...adminData } = user.toObject();
    try {
      const dataBooking = await Booking.findOne({ _id: id, idroom: idroom });
      const services = await Service.find({ toggle: true });
      if (!dataBooking) {
        return res.status(404).send("Booking not found");
      }

      const user = await usersModel.findOne({ email: dataBooking.emailUser });
      if (!user) {
        return res.status(404).send("User not found");
      }
      let room = await Room.findOne({ number_room: dataBooking.idroom });
      dataBooking.namer = room ? room.name_room : null;
      dataBooking.imgr = room ? room.img_room : null;
      dataBooking.inforUser = user ? user : null;
      res.render("pages/adminPage/billUser", {
        layout: "adminLayout",
        services,
        dataBooking,
        adminData,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred");
    }
  }

  async buyService(req, res) {
    try {
      const { id, idsv, amountsv } = req.body;

      const service = await Service.findOne({ stt: idsv });
      if (!service) {
        return res.status(404).json({ code: 1, message: "Service not found" });
      }

      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ code: 2, message: "Booking not found" });
      }

      const serviceObj = {
        stt: service.stt,
        name: service.namesv,
        amount: amountsv,
        price: service.pricesv,
      };

      const existingService = booking.services.find((e) => e.stt == idsv);

      if (existingService) {
        await Booking.findByIdAndUpdate(
          { _id: id },
          {
            $inc: {
              "services.$[element].amount": 1,
              totalService: amountsv * service.pricesv,
              totalBill: amountsv * service.pricesv,
            },
          },
          { arrayFilters: [{ "element.stt": existingService.stt }] }
        )
          .then(() =>
            res.json({
              code: 0,
              message: "Service amount updated successfully",
            })
          )
          .catch(() =>
            res.status(500).json({ code: 3, message: "Internal server error" })
          );
      } else {
        booking.services.push(serviceObj);
        booking.totalService += amountsv * service.pricesv;
        booking.totalBill += amountsv * service.pricesv;
        await booking.save();
        res.json({ code: 0, message: "Service added to booking successfully" });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ code: 3, message: "Internal server error" });
    }
  }

  async cancelService(req, res) {
    try {
      const { id, idsv } = req.body;

      const service = await Service.findOne({ stt: idsv });
      if (!service) {
        return res.status(404).json({ code: 1, message: "Service not found" });
      }

      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ code: 2, message: "Booking not found" });
      }

      const existingService = booking.services.find((e) => e.stt == idsv);
      if (existingService) {
        await Booking.updateOne(
          { _id: id },
          {
            $pull: { services: { stt: existingService.stt } },
            $inc: {
              totalBill: -(existingService.price * existingService.amount),
              totalService: -(existingService.price * existingService.amount),
            },
          }
        )
          .then(() => res.json({ code: 0, message: "Xóa sản phẩm thành công" }))
          .catch(() =>
            res.status(500).json({ code: 3, message: "Internal server error" })
          );
      } else {
        res.json({ code: 0, success: false });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ code: 3, message: error });
    }
  }

  async confirmPayment(req, res) {
    try {
      const { id, idroom, updatesv } = req.body;
      const booking = await Booking.findOne({
        _id: id,
        idroom: idroom,
        statusBooking: 2,
      });
      if (!booking) {
        return res.status(404).json({ code: 2, message: "Booking not found" });
      }

      if (updatesv)
        await updatesv.forEach((item) => {
          const index = booking.services.findIndex((s) => s.stt === item.stt);
          if (index !== -1) {
            booking.services[index].amount = item.amount;
          }
        });

      let totalService = booking.services.reduce(
        (acc, cur) => acc + cur.price * cur.amount,
        0
      );
      booking.totalBill = booking.totalPrice + totalService;
      booking.totalService = totalService;
      booking.statusBooking = 3;
      booking.checkout = new Date();

      await booking.save();
      for (let i = 0; i < booking.services.length; i++) {
        await Service.updateOne(
          { stt: booking.services[i].stt },
          { $inc: { amountsv: booking.services[i].amount } }
        );
      }
      res.json({ code: 0, message: "Thanh toán thành công" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ code: 1, message: "Có lỗi xảy ra, vui lòng thử lại sau" });
    }
  }

  //QUẢN LÝ DỊCH vụ
  async servicePage(req, res) {
    try {
      let dataService = await Service.find({});
      res.render("pages/adminPage/services", {
        layout: "adminLayout",
        dataService,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ code: 1, message: "Có lỗi xảy ra, vui lòng thử lại sau" });
    }
  }

  async updateToggleService(req, res) {
    let data = req.body;
    await Service.findOneAndUpdate({ stt: data.stt }, { toggle: data.toggle })
      .then((data) => {
        if (data != null)
          res.json({
            code: 0,
            message: "Cập nhật trạng thái dịch vụ thành công",
          });
        else res.json({ code: 0, message: "MÃ id sai" });
      })
      .catch((err) =>
        res.json({ code: 0, message: "Cập nhật trạng thái dịch vụ thất bại" })
      );
  }

  async getInforService(req, res) {
    const stt = req.params.stt;
    await Service.findOne({ stt: stt })
      .then((sv) => {
        res.json({ code: 0, data: sv });
      })
      .catch((err) =>
        res.json({ code: 0, message: "Không có dịch vụ thích hợp" })
      );
  }

  async updateService(req, res) {
    const { stt, namesv, pricesv, descriptionsv } = req.body;
    console.log(descriptionsv);
    await Service.findOneAndUpdate(
      { stt: stt },
      { namesv: namesv, pricesv: pricesv, descriptionsv: descriptionsv }
    )
      .then((data) => {
        if (data != null)
          res.json({ code: 0, message: "Cập nhật dịch vụ thành công" });
        else res.json({ code: 0, message: "MÃ id sai" });
      })
      .catch((err) =>
        res.json({ code: 0, message: "Cập nhật dịch vụ thất bại" })
      );
  }

  async addService(req, res) {
    const { namesv, pricesv, descriptionsv, type, imgsv } = req.body;

    if (!namesv || !pricesv || !type || !descriptionsv) {
      return res.json({
        code: 1,
        message: "Vui lòng nhập đủ thông tin dịch vụ",
      });
    } else {
      try {
        const result = await cloudinary.uploader.upload(imgsv);

        let stt;
        await Service.aggregate([
          { $group: { _id: null, maxStt: { $max: "$stt" } } },
        ])
          .exec()
          .then((result) => {
            stt = result[0].maxStt;
          })
          .catch((err) => {
            console.log(err);
          });

        let serviceJson = {
          stt: stt + 1,
          namesv: namesv,
          imgsv: result.secure_url,
          type: type,
          pricesv: pricesv,
          descriptionsv: descriptionsv,
          createdAt:
            new Date().getHours() +
            ":" +
            new Date().getMinutes() +
            " ngày " +
            new Date().getDate() +
            "/" +
            new Date().getMonth() +
            "/" +
            new Date().getFullYear(),
        };

        let newService = new Service(serviceJson);
        await newService.save();
        res.json({
          code: 0,
          message: "Success",
          service: newService,
        });
      } catch (err) {
        return res.json({
          code: 1,
          message: err.message,
        });
      }
    }
  }

  // Quản lý khách sạn
  async getManageRoom(req, res) {
    const rooms = await Room.find({});
    res.render("pages/adminPage/manageRoom", { layout: "adminLayout", rooms });
  }

  async deleteRoom(req, res) {
    try {
      const { id } = req.body;
      await Room.updateOne({ _id: id }, { $set: { hide: true } });
      res.json({ status: true });
    } catch (error) {
      res.json({ status: false });
    }
  }

  async unDeleteRoom(req, res) {
    try {
      const { id } = req.body;
      await Room.updateOne({ _id: id }, { $set: { hide: false } });
      res.json({ status: true });
    } catch (error) {
      res.json({ status: false });
    }
  }

  async getRoom(req, res) {
    const { id } = req.body;
    const room = await Room.findById(id);
    res.json(room);
  }

  async updatetRoom(req, res) {
    const { _id } = req.body;
    await Room.updateOne(
      { _id },
      {
        ...req.body,
      }
    );
    res.json({ status: true });
  }
}

module.exports = new AdminController();
