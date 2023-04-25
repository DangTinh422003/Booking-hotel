class GioiThieuController {
  index(req, res) {
    res.render("pages/GioiThieu/GioiThieu.hbs");
  }
}

module.exports = new GioiThieuController();
