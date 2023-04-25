const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  userId: { type: String },
  cardName: { type: String },
  cardType: { type: Number }, // 0: normal (người dùng bình thường), 1: middle (người dùng thường xuyên đặt phòng và sử dụng dịch vụ), 2: upstream (người dùng VIP)
  createdDate: { type: Date ,default: new Date()},
  expiredDate: { type: Date ,default: null},
  cardDescription: { type: String },
  cardBenefits: { type: String,default: "Giảm 7% khi đặt các loại phòng tương ứng bao gồm dịch vụ và các tiện ích trong khách sạn." },
  times: {type: Number,default: 65}, // số lần thẻ có tác dụng,
  cardPricePerYear: {type: Number,default: 2000000},
  type_room: [{ type: String }]
});

cardSchema.pre('save', function(next) {
  if (this.cardType === 0) {
    this.cardDescription = 'Đây là loại thẻ cơ bản, được dành cho những người dùng mới hoặc không sử dụng dịch vụ thường xuyên. Thẻ normal sẽ không có nhiều ưu đãi hay giảm giá đặc biệt so với các loại thẻ khác.';
    this.type_room = ['Standard Room'];
    this.cardName = 'NORMAL';
    this.cardBenefits = "Giảm 2% khi đặt phòng Standard Room"
  } else if (this.cardType === 1) {
    this.cardDescription = 'Đây là loại thẻ dành cho những người dùng thường xuyên đặt phòng và sử dụng các dịch vụ của khách sạn. Thẻ middle sẽ có nhiều ưu đãi hơn so với thẻ normal, bao gồm các giảm giá đặc biệt cho các dịch vụ và tiện ích trong khách sạn.';
    this.type_room = ['Standard Room', 'Premier Ocean View', 'Family Suite', 'Deluxe Room', 'Deluxe Pool View', 'Deluxe Ocean View', 'Deluxe Garden View'];
    this.cardName = 'MIDDLE';
    this.cardPricePerYear = 5000000
  } else if (this.cardType === 2) {
    this.cardDescription = 'Đây là loại thẻ cao cấp nhất, được dành cho những người dùng VIP của khách sạn. Thẻ upstream sẽ có nhiều ưu đãi và tiện ích đặc biệt hơn so với các loại thẻ khác, bao gồm các giảm giá lớn cho các dịch vụ, tiện ích cao cấp trong khách sạn và ưu tiên khi đặt phòng và sử dụng dịch vụ.';
    this.type_room = ['ALL'];
    this.cardName = 'VIP';
    this.cardPricePerYear = 7500000
  }
  if (!this.expiredDate) {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    this.expiredDate = oneYearFromNow;
  }
  next();
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
