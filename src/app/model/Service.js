const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Service = new Schema({
    stt :{ type: Number, unique: true, sparse: true },
    namesv:String,
    pricesv:Number,
    amountsv:{type:Number, default:0},
    imgsv:String,
    descriptionsv:String, //type:2 thì để null
    type:Number, //1: dịch vụ, 2:sản phẩm (trà, cafe)
    toggle:{type:Boolean, default:true}, //false: xóa(ẩn)
    createdAt: String
});

module.exports = mongoose.model("Service", Service);
