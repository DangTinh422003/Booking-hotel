class ContactController {
  // [GET] /contact
  index(req, res) {
    res.render("pages/contactPage/contact");
  }
}

module.exports = new ContactController();
