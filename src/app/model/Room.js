const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Room = new Schema({
  number_room: String,
  direction:String,
  intro: String,
  img_room: String,
  name_room: String,
  slug:String,
  star: Number,
  feedback_normal: String,
  point: Number,
  count_cmt:Number,
  characters: Array,
  bonus_character: String,
  oldprice: Number,
  newprice: Number,
  type_room: String,
  type_room_bonus: String,
  status: String,
  voucher: String,
  adult: Number,
  child: Number,
  img_room_list: Array,
  hide:Boolean
});

module.exports = mongoose.model("Room", Room);
