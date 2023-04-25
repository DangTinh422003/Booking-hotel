const express = require("express");
const createError = require("http-errors");
const app = express();
const server = require("http").createServer(app);
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const expressSession = require('express-session')
const cookieSession = require('cookie-session')
const MemoryStore = require('session-memory-store')(expressSession)
const flash = require('connect-flash');
const moment = require('moment')
const bodyParser = require('body-parser');

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
// Connect database
const db = require("./config/db");
db.connect();
const port = 3000;

app.use(express.urlencoded({ limit: '50mb', extended: true }));// giới hạn kích thước cho phép tối đa là 50MB
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(
  cookieSession({
    secret: "secret",
    store: new MemoryStore(60 * 60 * 12),
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);
app.use(flash()); //use flash message

// http logger
// app.use(morgan("combined"));

// set view engine
// set up Handlebars
const hbs = exphbs.create({
  extname: ".hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    loopStar: function (numStar) {
      let result = "";
      for (let i = 0; i < numStar; i++) {
        result += `<i class="fas fa-star"></i>`;
      }
      return result;
    },
    formatPrice(price) {
      price = Number(price).toFixed(0);
      let chars = price.split("");
      let len = chars.length;
      let dots = Math.floor((len - 1) / 3);
      for (let i = 1; i <= dots; i++) {
        chars.splice(len - i * 3, 0, ".");
      }
      return chars.join("");
    },
    id5(id) {
      return id.substr(-5)
    },
    multiply(a, b) {
      return a * b
    },
    inObjectService(stt, arr) {
      return arr.some(obj => obj.stt == stt)
    },
    ne: (v1, v2) => v1 !== v2
  },
});


// register your Handlebars helpers here
hbs.handlebars.registerHelper("ifEqual", function (a, b, options) {
  if (a === b) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
hbs.handlebars.registerHelper("ifCondition", function (a, operator, b, options) {
  switch (operator) {
    case "==":
      return a == b ? options.fn(this) : options.inverse(this);
    case "===":
      return a === b ? options.fn(this) : options.inverse(this);
    case "!=":
      return a != b ? options.fn(this) : options.inverse(this);
    case "!==":
      return a !== b ? options.fn(this) : options.inverse(this);
    case ">":
      return a > b ? options.fn(this) : options.inverse(this);
    case ">=":
      return a >= b ? options.fn(this) : options.inverse(this);
    case "<":
      return a < b ? options.fn(this) : options.inverse(this);
    case "<=":
      return a <= b ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
  });
hbs.handlebars.registerHelper('formatDate', function (date, format) {
  if (moment(date, 'ddd MMM DD YYYY HH:mm:ss ZZ', false).isValid()) {
    // Nếu ngày tháng chứa giờ
    return moment(date, 'ddd MMM DD YYYY HH:mm:ss ZZ', false).format(format);
  } else if (moment(date, 'DD-MM-YYYY_hh:mmA', false).isValid()) {
    // Nếu ngày tháng không chứa giờ
    return moment(date, 'DD-MM-YYYY_hh:mmA', false)
      .startOf('hour')
      .format(format);
  } else {
    return date;
  }
});
hbs.handlebars.registerHelper('money-format', function (number, decimals, decimalPoint, thousandsSep) {
  // Kiểm tra số tiền có phải là số không
  if (isNaN(number) || number == null) {
    return number;
  }
  // Đặt mặc định số thập phân là 2
  decimals = typeof decimals !== 'undefined' ? decimals : 2;
  // Đặt mặc định dấu phân cách thập phân là dấu "."
  decimalPoint = typeof decimalPoint !== 'undefined' ? decimalPoint : '.';
  // Đặt mặc định dấu phân cách hàng ngàn là dấu ","
  thousandsSep = typeof thousandsSep !== 'undefined' ? thousandsSep : ',';
  // Định dạng số tiền theo định dạng mong muốn
  var num = parseFloat(number).toFixed(decimals).toString().replace('.', decimalPoint);
  var thousandsRegex = /(\d)(?=(\d{3})+(?!\d))/g;
  return num.replace(thousandsRegex, '$1' + thousandsSep) + ' VND';
});
hbs.handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

// set Handlebars as the view engine
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "resources", "views"));

// parser data (cookie, body, etc...)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes Init
const route = require("./routes/index.js");
route(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("pages/errorPage/error",{layout:null});
});

app.listen(port, () =>
  console.log(`\nExample app listening at http://localhost:${port} !\n`)
);
