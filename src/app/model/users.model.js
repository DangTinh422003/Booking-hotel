const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName : String,
  password : String,
  phoneNumber : String,
  email : String,
  cloudinary_id:{type:String, default:null},
  image:{type:String, default:null},
  gender: {
    type: String,
    default: 'Male'
  },
  address: {
    type: String,
    default: 'Chưa cập nhật'
  },
  position:{type:Number, default:0}, //0:khách hàng, 1:lễ tân, 2:Quản lý,
  active:{type: Boolean, default:true} //true: Hoạt động, false: Xóa
},{versionKey: false});

module.exports = mongoose.model("user", userSchema);
