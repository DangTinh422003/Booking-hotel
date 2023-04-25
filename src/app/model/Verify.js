const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const verifySchema = new Schema({
    email:String,
    otp:Number,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
      }
});

verifySchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

const Verify = mongoose.model('Verify', verifySchema);

module.exports = Verify;
