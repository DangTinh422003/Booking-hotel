const User = require('../model/users.model')
const Booking = require('../model/Booking')
const Room = require('../model/Room')
const Feedback = require('../model/Feedback')
const Voucher = require('../model/Voucher')
const Question = require('../model/UserQuestion')
const CardModel = require('../model/usersCard.model')
const bcrypt = require("bcrypt");
const cloudinary = require("../middwares/cloudinary")
const slugify = require('slugify')
const { ObjectId } = require("mongodb");

class ProfileController {
  async profile(req, res) {
    const email = req.session._id
    try {
      const user = await User.findOne({ email });
      const { _id, ...userData } = user.toObject();
      let card = await CardModel.findOne({ userId: _id.toString()});
      // console.log(userData)
      let id_card = null;
      if (card)
        id_card = card._id.toString()
      res.render("pages/profilePage/userProfile", { layout: "profileLayout", currentPage: "profile", userData, error: req.flash('error'),id_card: id_card });
    } catch (e) {
      console.log(e)
      res.redirect("/")
    }
  }

  async postProfile(req, res) {
    const { name, gender, email, phone, address, changePass, passNow, passNew, passNewPre } = req.body;
    try {
      if (changePass) {
        const user = await User.findOne({ email: email });
        if (!user) {
          return res.status(422).json({ errors: { message: 'Không tìm thấy người dùng, hãy thử đăng nhập lại' } });
        }
        const match = await bcrypt.compare(passNow, user.password);
        if (!match) {
          return res.status(422).json({ errors: { message: 'Current password is incorrect' } });
        }
        if (passNew !== passNewPre) {
          return res.status(422).json({ errors: { message: 'New password confirmation does not match' } });
        }
        const hash = await bcrypt.hash(passNew, 10);
        user.password = hash;
        user.name = name;
        user.gender = gender;
        user.phone = phone;
        user.address = address;
        await user.save();
        return res.status(200).json({ message: 'Cập nhật thông tin thành công' });
      } else {
        const user = await User.findOneAndUpdate(
          { email: email },
          { userName: name, gender, phoneNumber: phone, address },
          { new: true }
        );
        if (!user) {
          return res.status(422).json({ errors: { message: 'Không tìm thấy người dùng, hãy thử đăng nhập lại' } });
        }
        return res.status(200).json({ message: 'Cập nhật thông tin thành công' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errors: { message: 'Internal server error' } });
    }
  }

  async editUserImage(req, res) {
    // console.log(req.session._id)
    if (req.file) {
      console.log(req.file);
      if (!req.file.mimetype.match(/image.*/)) {
        error = "Chỉ hổ trợ định dạng hình ảnh"
        return res.json({ code: 2, message: err })
      } else if (req.file.size > (1024 * 1024 * 20)) {
        error = "Size ảnh không được quá 20MB"
        return res.json({ code: 2, message: err })
      } else {
        const user = await User.findOne({ email:req.session._id });
        if (user && user.cloudinary_id) {
          await cloudinary.uploader.destroy(user.cloudinary_id);
          // Tiếp tục thực hiện các thao tác khác
        } else if (!user) {
          return res.json({ code: 1, message: "Không tìm thấy người dùng" });
        }

        try {
          const result = await cloudinary.uploader.upload(req.file.path)
          await User.updateOne({ email:req.session._id }, {
            image: result.secure_url,
            cloudinary_id: result.public_id
          })
            .then(() => {
              return res.json({ code: 0, message: "success" })
            })
            .catch(err => {
              return res.json({ code: 1, message: err.message })
            })
        } catch (err) {
          return res.json({ code: 2, message: err })
        }
      }
    }else{
      return res.json({ code: 3, message: "Không có file hình ảnh được chọn" });
    }
  }

 async history(req, res, next) {
    const email = req.session._id;
    try {
      const user = await User.findOne({ email });
      const bookings = await Booking.find({ emailUser: email });
      const bookingsWithRooms = await Promise.all(bookings.map(async (booking) => {
        const room = await Room.findOne({ number_room: booking.idroom });
        // console.log(room)
        const roomName = slugify(room.name_room.toLowerCase(), {
          remove: /[*+~.()'"!:@]/g,  // Xóa các ký tự đặc biệt
          lower: true,              // Viết thường
          strict: true,             // Chỉ giữ lại ký tự a-zA-Z0-9 và -
          locale: 'vi'               // Sử dụng ngôn ngữ tiếng Việt để xử lý
        }).replace(/\s+/g, '-'); // Thay thế khoảng trắng bằng gạch nối
        const roomId = room.id.slice(-5); // Lấy 5 kí tự cuối cùng của this.room.id
        const href = `/xem-phong/${roomName}-${roomId}`; // Tạo đường link mới
        return { ...booking.toObject(), room: room ,href:href};
      }));
      // console.log(bookingsWithRooms[0].rooms)
      const pendingBookings = bookingsWithRooms.filter(booking => booking.statusBooking === 0);
      const confirmedBookings = bookingsWithRooms.filter(booking => booking.statusBooking === 1);
      const checkInBookings = bookingsWithRooms.filter(booking => booking.statusBooking === 2);
      const checkOutBookings = bookingsWithRooms.filter(booking => booking.statusBooking === 3);
      const { _id, ...userData } = user.toObject();
      let card = await CardModel.findOne({ userId: _id.toString()});
      let id_card = null;
      if (card)
        id_card = card._id.toString()
      res.render("pages/profilePage/userHistory", {
        layout: "profileLayout",
        currentPage: "history",
        userData,
        pendingBookings,
        confirmedBookings,
        checkInBookings,
        checkOutBookings,
        id_card: id_card
      });
    } catch(e){
      console.log(e)
      return next(Error);
    }
  }

// async history(req, res, next) {
//   const email = req.session._id;
//   const page = parseInt(req.query.page) || 1;
//   const limit = 10; // Số lượng kết quả trên mỗi trang
//   try {
//     const user = await User.findOne({ email });
//     const bookings = await Booking.find({ emailUser: email });
//     const roomIds = bookings.map((booking) => booking.idroom);
//     const room = await Room.find({ number_room: roomIds });
//     const roomsMap = room.reduce(
//       (acc, room) => ({ ...acc, [room.number_room]: room.toObject() }),
//       {}
//     );
//     const bookingsWithRoomsAndPagination = await Booking.paginate(
//       { emailUser: email },
//       { page, limit}
//     ).then((result) => {
//       const bookingsWithRooms = result.docs.map((booking) => ({
//         ...booking.toObject(),
//         room: roomsMap[booking.idroom],
//       }));
//       return { ...result, docs: bookingsWithRooms };
//     });
//     const pendingBookings = bookingsWithRoomsAndPagination.docs.filter(
//       (booking) => booking.statusBooking === 0
//     );
//     const confirmedBookings = bookingsWithRoomsAndPagination.docs.filter(
//       (booking) => booking.statusBooking === 1
//     );
//     const checkInBookings = bookingsWithRoomsAndPagination.docs.filter(
//       (booking) => booking.statusBooking === 2
//     );
//     const checkOutBookings = bookingsWithRoomsAndPagination.docs.filter(
//       (booking) => booking.statusBooking === 3
//     );
//     console.log(pendingBookings)
//     console.log({
//       ...confirmedBookings,
//       docs: confirmedBookings,
//     })
//     const { _id, ...userData } = user.toObject();
//     res.render("pages/profilePage/userHistory", {
//       layout: "profileLayout",
//       currentPage: "history",
//       userData,
//       pendingBookings: pendingBookings.slice(0, limit),
//       confirmedBookings: confirmedBookings.slice(0, limit),
//       checkInBookings: checkInBookings.slice(0, limit),
//       checkOutBookings: checkOutBookings.slice(0, limit),
//       pagination: {
//         pendingBookings: {
//           ...bookingsWithRoomsAndPagination,
//           docs: pendingBookings,
//         },
//         confirmedBookings: {
//           ...bookingsWithRoomsAndPagination,
//           docs: confirmedBookings,
//         },
//         checkInBookings: {
//           ...bookingsWithRoomsAndPagination,
//           docs: checkInBookings,
//         },
//         checkOutBookings: {
//           ...bookingsWithRoomsAndPagination,
//           docs: checkOutBookings,
//         },
//       }, 
//     });
//   } catch(e) {
//     console.log(e);
//     return next(Error);
//   }
// }

  async feedback(req,res){
    try {
      // Lấy dữ liệu đánh giá từ request body
      const feedbackData = req.body;
      // Lưu các ảnh đánh giá lên Cloudinary
      const uploadedImages = [];
      if (feedbackData.imageFb)
      {
        for (let i = 0; i < feedbackData.imageFb.length; i++) {
          const result = await cloudinary.uploader.upload(feedbackData.imageFb[i]);
          uploadedImages.push(result.secure_url);
        }
      }
      if (feedbackData.starFb!=0){
        feedbackData.imageFb = uploadedImages;
              // Lưu dữ liệu đánh giá vào cơ sở dữ liệu với các ảnh đã lưu lên Cloudinary
        feedbackData.emailUser = req.session._id
        // console.log(feedbackData);
        const feedback = new Feedback(feedbackData);
        // console.log(feedback);
        await feedback.save()
        // Cập nhật trạng thái đánh giá và điểm đánh giá cho phòng
        const booking = await Booking.findOne({_id: new ObjectId(feedbackData.idbooking),idroom: feedbackData.idroom,emailUser: req.session._id});
        console.log(booking);
        if (booking) {
          booking.feedback = true;
          await booking.save();
        }
        const feedbacks = await Feedback.find({ idroom: feedbackData.idroom });
        const totalStars = feedbacks.reduce((acc, feedback) => {
          return acc + feedback.starFb;
        }, 0);
        const averageStar = Math.round(totalStars / feedbacks.length);
        const room = await Room.findOne({ number_room: feedbackData.idroom })
        if (room) {
          room.star = averageStar
          await room.save()
        }
        // Trả về kết quả cho client
        res.status(200).json({message: 'Đã lưu đánh giá vào cơ sở dữ liệu'});
      }else {
        res.status(200).json({errors: 1,message: 'không thể lưu đánh giá vào cơ sở dữ liệu'});
      }
    } catch (error) {
      console.error('Lỗi khi lưu đánh giá vào cơ sở dữ liệu:', error);
      res.status(500).send('Đã xảy ra lỗi khi lưu đánh giá vào cơ sở dữ liệu');
    }
  }

  async voucher(req, res) {
    const email = req.session._id;
    try{
      const user = await User.findOne({ email });
      const { _id, ...userData } = user.toObject();
      let card = await CardModel.findOne({ userId: _id.toString()});
      const vouchers = await Voucher.find({});
      // console.log(vouchers)
      let id_card = null;
      if (card)
        id_card = card._id.toString()
      res.render("pages/profilePage/userVoucher", {
        layout: "profileLayout",
        currentPage: "voucher",
        userData,
        vouchers,
        id_card: id_card
      });
    }catch (e){
      console.log(e);
      req.flash("error","Something error at page voucher")
      res.redirect("/profile")
    }
  }

  async question(req, res) {
    const email = req.session._id;
    try{
      const user = await User.findOne({ email });
      const { _id, ...userData } = user.toObject();
      let card = await CardModel.findOne({ userId: _id.toString()});
      const questions = await Question.find({iduser: _id.toString()})
      let id_card = null;
      if (card)
        id_card = card._id.toString()
      res.render("pages/profilePage/userQuestion", {
        layout: "profileLayout",
        currentPage: "question",
        userData,
        questions,
        id_card: id_card
      });
    }catch(e){
      console.log(e)
      res.redirect("/profile")
    }
  }

  async card(req, res) {
    const email = req.session._id;
    try{
      const user = await User.findOne({ email });
      const { _id, ...userData } = user.toObject();
      let card = await CardModel.findOne({ userId: _id.toString()});
      let id_card = null;
      if (card)
        id_card = card._id.toString()
      res.render("pages/profilePage/userCard", {
        layout: "profileLayout",
        currentPage: "card",
        userData,
        card,
        id_card: id_card
      });
    }catch(e){
      console.log(e)
      res.redirect("/profile")
    }
  }

  async registerCard(req,res){
    const email = req.session._id;
    try {
      const { type, expiredDate } = req.body;
      // console.log(type, expiredDate)
      if (expiredDate == "") {
        return res.status(400).json({ error: 'Vui lòng chọn số năm đăng ký' });
      } else if (type == "") {
        return res.status(400).json({ error: 'Vui lòng chọn loại thẻ' });
      }
      const user = await User.findOne({ email });
      const { _id, ...userData } = user.toObject();
      const YearFromNow = new Date();
      YearFromNow.setFullYear(YearFromNow.getFullYear() + (+expiredDate));
      
      let card = await CardModel.findOne({ userId: _id.toString()});
      
      if (card) {
        card.expiredDate = YearFromNow;
        card.cardType = type
      } else {
        card = new CardModel({
          userId: _id.toString(),
          cardType: type,
          expiredDate: YearFromNow
        });
      }
      
      const result = await card.save();
      
      if (result) {
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }

}

module.exports = new ProfileController();
