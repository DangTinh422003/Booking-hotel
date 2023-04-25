const Room = require("../model/Room");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

class HomeController {
  // [GET] path : '/'
  async index(req, res) {
    const user = req.session._id;
    res.render("pages/homePage/home", { user });
  }

  danhsachtours(req, res) {
    res.render("pages/homePage/danhsachtour.hbs");
  }

  async detail(req, res) {
    let room;
    const param = req.params.slug;

    const lastDashIndex = param.lastIndexOf("-");
    const slug = param.slice(0, lastDashIndex);
    const id = param.slice(lastDashIndex + 1);

    await Room.find({ slug: slug })
      .then((foundRoom) => {
        for (let i = 0; i < foundRoom.length; i++) {
          if (foundRoom[i].id.substr(-5) === id) {
            room = foundRoom[i];
            break;
          }
        }
      })
      .catch((error) => {
        console.error(error);
        res.send("Lỗi truy vấn CSDL");
      });
    if (room) {
      res.render("pages/homePage/detail.hbs", { layout: null, room });
    }
  }

  async danhsachphong(req, res) {
    let rooms;
    let { star } = req.query;

    if (!star) {
      rooms = await Room.find({hide:false});
    } else {
      let arr = star.split("");
      let promises = [];

      arr.forEach(function (char) {
        promises.push(Room.find({ star: char }));
      });

      rooms = await Promise.all(promises).then((data) => {
        return data.flat();
      });
    }

    res.render("pages/homePage/danhsachphong.hbs", { rooms });
  }
}

module.exports = new HomeController();
