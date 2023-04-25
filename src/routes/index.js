const homeRoute = require("./home.route");
const contactRoute = require("./contact.route");
const registerRoute = require("./register.route");
const apiRoute = require("./API.route");
const profileRoute = require("./profile.route");
const errorRoute = require("./error");
const veMayBayRoute = require("./VeMayBayRoute");
const gioiThieuRoute = require("./GioiThieuRoute");
const adminRoute = require("./admin");
const userRoute = require("./user");

function router(app) {
  app.use("/api", apiRoute);
  app.use("/ve-may-bay", veMayBayRoute);
  app.use("/profile", profileRoute);
  app.use("/register", registerRoute);
  app.use("/contact", contactRoute);
  app.use("/gioi-thieu", gioiThieuRoute);
  app.use("/user", userRoute);
  app.use("/admin", adminRoute);
  app.use("/", homeRoute);
  app.use(errorRoute);
}

module.exports = router;
