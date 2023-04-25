const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Question = new Schema({
  iduser: String,
  question: String,
  repquestion: { type: String, default: "" },
  rep: { type: Boolean, default: false },
  datesend: { type: Date, default: Date.now },
  daterep: { type: Date, default: null },
  hidevc: { type: Boolean, default: false },
});

module.exports = mongoose.model("Question", Question);
