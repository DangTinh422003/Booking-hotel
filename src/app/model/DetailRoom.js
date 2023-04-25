const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DetailRooom = new Schema({
  idroom:String,
  description:String,
});

module.exports = mongoose.model("DetailRooom", DetailRooom);
