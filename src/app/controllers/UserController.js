const jwt = require('jsonwebtoken');
const cache = require('memory-cache');
const Room = require('../model/Room');
const User = require('../model/users.model');
const Booking = require('../model/Booking');
const Voucher = require('../model/Voucher');
const CardModel = require('../model/usersCard.model');
function formatDate1(str) {
    const originalString = str;
    const dateArray = originalString.split("_")[0].split("-");
    const timeArray = originalString.split("_")[1].split(/(?=[AP]M)/);

    const newString = `${dateArray[0]}-${dateArray[1]}-${dateArray[2]}_${timeArray[0]} ${timeArray[1]}`;

    return newString
}
function formatDate2(start, end) {

    const startParts = formatDate1(start).split(/-|_|:| /);
    const endParts = formatDate1(end).split(/-|_|:| /);

    const startDate = new Date(startParts[2], startParts[1] - 1, startParts[0], startParts[3], startParts[4], 0);
    const endDate = new Date(endParts[2], endParts[1] - 1, endParts[0], endParts[3], endParts[4], 0);

    const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

    const hours = Math.floor((endDate - startDate) / (1000 * 60 * 60)) % 24;

    return days
}

class UserController {
    async sendToken(req, res) {
        const { JWT_SECRET, JWT_REFRESTOKEN, TOKEN_LIFE } = process.env;
        let token = req.cookies.token;
        if (!token) {
            token = jwt.sign({ email: req.session._id }, JWT_SECRET, { expiresIn: TOKEN_LIFE });
            const refreshToken = jwt.sign({ email: req.session._id }, JWT_REFRESTOKEN);
            res.cookie('refreshToken', refreshToken, { httpOnly: true });
        }
        res.cookie('token', token);
        if (!req.session._id)
            res.json({ code: 1, message: "Vui lòng đăng nhập" })
        else
            res.json({ code: 0, token: token })
    }

    async Booking(req, res) {
        const { room, amount_room, adult_num, child_num, check_in, check_out, rate_token } = req.query;
        const token = req.cookies.token;

        if (!token || rate_token !== token) {
            // return res.send('Không tìm thấy access token');
            return res.render("pages/errorPage/errorBooking.hbs",{layout:null});
        }

        try {
            const roomObj = await Room.findOne({ number_room: room });
            const user = await User.findOne({ email: req.session._id })
            if (!roomObj) {
                throw new Error('Room not found');
            }

            const { name_room, img_room, bonus_character, type_room_bonus, newprice, adult, child } = roomObj;

            res.render('pages/bookingPage/booking', {
                name_room, img_room, bonus_character, type_room_bonus, newprice, adult, user, child, amount_room, total: newprice * amount_room * formatDate2(check_in, check_out), numDate: formatDate2(check_in, check_out)
            });
        } catch (err) {
            console.log(err);
            res.send('Xảy ra lỗi');
        }
    }


    async confirmBooking(req, res) {
        const { idroom, idvoucher, totalPrice, name, phone, email, amountRoom, from, to, adult, child } = req.body
        await User.findOne({ email: req.session._id })
            .then(user => {
                if (!user)
                    res.json({ code: 0, message: "Email này chưa đăng ký sử dụng dịch vụ" })
            })

        await Room.find({ number_room: idroom })
            .then(async () => {
                const infoBooking = {
                    name: name,
                    phone: phone,
                    email: email,
                    amountRoom: amountRoom,
                    from: from,
                    to: to,
                    adult: adult,
                    child: child
                }
                const bookingObj = {
                    idroom: idroom,
                    emailUser: req.session._id,
                    idvoucher: idvoucher,
                    totalPrice: totalPrice,
                    infoBooking: infoBooking,
                    totalBill: totalPrice
                }

                const newBooking = new Booking(bookingObj)
                newBooking.save()
                const room = await Room.findOne({ number_room: idroom })
                const user = await User.findOne({ email: req.session._id });
                const { _id, ...userData } = user.toObject();
                let card = await CardModel.findOne({ userId: _id.toString() });
                if (card && card.times > 0 && card.type_room.includes(room.type_room)) {
                    card.times -= 1
                    await card.save()
                }

                if (idvoucher != null) {
                    await Voucher.updateOne({idvoucher: idvoucher.idvoucher},{$inc:{quantity:-1, dasudung:1}})
                }

                res.clearCookie("token");
                res.clearCookie("refreshToken");
                return res.json({ code: 0, message: "Đặt phòng thành công" })
            })

    }
}

module.exports = new UserController()