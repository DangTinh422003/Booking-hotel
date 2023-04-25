const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const Booking = new Schema({
  idroom: String,
  emailUser: String,
  idvoucher: {type:Object, default:null}, //{"idvoucher","valuevc"}
  totalPrice: Number,
  infoBooking: Object,
  //   {
  //     name
  //     phone
  //     email
  //     amountRoom
  //     from
  //     to
  //     adult
  //     child
  //   }
  timeBooking: {type: String, default:new Date()},
  statusBooking: {type: Number, default:0}, //0: Chờ xác nhận, 1: Đã xác nhận, 2: Nhận phòng, 3: Trả phòng, 4:Hủy phòng
  feedback:{type:Boolean, default:false}, //true: Đã feedback, false: Chưa feedback (trả phòng rồi mới cho feedback)
  totalService: {type:Number, default:0},
  services:{type:Array, default:[]},
  /*
    {
      stt:1, (stt trong bảng service set là primary key)
      namesv:
      amount:1, số lượng
      pricesv:100000 giá
      totalsv:
    }
   */
  totalBill:Number,
  checkout:{type:String, default:null}
});
// Booking.plugin(mongoosePaginate); // Khai báo plugin
module.exports = mongoose.model("Booking", Booking);
