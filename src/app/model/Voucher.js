const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Voucher = new Schema({
  idvoucher: String,
  namevc: String,
  valuevc:String,
  quantity: Number,
  dasudung: Number,
  from:String,
  to:String,
  hidevc:{type:Boolean, default:false}
});

module.exports = mongoose.model("Voucher", Voucher);
