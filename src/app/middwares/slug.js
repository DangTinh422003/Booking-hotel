const slugify = require('slugify');
function slug(req, res, next) {
    const text = req.params.text;
    const slug = slugify(text, {
        lower: true, // chuyển tất cả các ký tự thành chữ thường
        strict: true, // loại bỏ các ký tự đặc biệt không hợp lệ
        locale: 'vi' // sử dụng bảng mã tiếng Việt để chuyển đổi
    });
    return slug
}

module.exports = slug;
