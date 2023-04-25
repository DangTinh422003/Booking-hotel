const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

const Feedback = new Schema({
  idroom:String,
  idbooking:String,
  emailUser: String,
  contentFb:String,
  imageFb:{type:Array, default:[]},
  starFb: Number,
  timeFb:{
    type: Date,
    default: moment.tz('Asia/Ho_Chi_Minh').format()
  },
  hide:{type:Boolean, default:false}, //mặc định là false
});

module.exports = mongoose.model("Feedback", Feedback);
