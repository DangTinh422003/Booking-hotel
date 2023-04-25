const nodemailer = require('nodemailer');
const Verify = require("../model/Verify");
const usersModel = require('../model/users.model');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'daylataikhoanguiemail@gmail.com',
    pass: 'upfmzrqgdnlbatzi'
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendEmail = async (req, res, next) => {
  const to = req.body.to;
  const isValidEmail = validateEmail(to);

  if (!isValidEmail) {
    res.status(400).json({ code: 1, message: 'Invalid email address' });
    return;
  }

  try {
    const user = await usersModel.findOne({ email: to });
    if (!user) {
      return res.json({ code: 1, message: 'Email chưa được đăng ký' });
    }
    if (user.active == false) {
      return res.json({ code: 1, message: 'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ với chúng tôi để xử lý!' });
    }

    const code = getCode();

    let mailOptions = {
      from: 'daylataikhoanguiemail@gmail.com',
      to: to,
      subject: req.body.subject || 'Khôi phục tài khoản của bạn',
      text: req.body.text || '',
      html: req.body.html || `<div><p>Mã có hiệu lực trong <b>5</b> phút.</p><div><a href="http://localhost:3000/register/account/reset?otp=${code}&email=${to}">Vui lòng truy cập vào đường link này</a></div></div>`
    };



    let verifyObj = {
      email: to,
      otp: code,
      createdAt: new Date()
    };

    let newVerify = new Verify(verifyObj);
    await Verify.deleteMany({ email: to })
      .then(async () => {
        await newVerify.save();
      })

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.json({ code: 1, message: 'Gửi mail không thành công' });
      } else {
        res.json({ code: 0, message: 'Gửi mail thành công' });
      }
    });

    // Xóa document Verify sau 5 phút
    setTimeout(() => {
      Verify.deleteOne({ _id: newVerify._id })
        .then(result => {
          console.log(result);
          // Xử lý kết quả ở đây
        })
        .catch(err => {
          console.error(err);
        });

    }, 300000);

  } catch (err) {
    console.log(`Error finding user: ${err}`);
    res.json({ code: 1, message: 'Lỗi khi tìm kiếm thông tin người dùng' });
  }
};


function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function getCode() {
  const str = "032157845280211221452196301365427899";
  const shuffledStr = str.split('').sort(() => 0.5 - Math.random()).join('');
  const randomNumber = shuffledStr.substring(0, 6);

  return randomNumber;
}

module.exports = sendEmail;
