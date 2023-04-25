const User = require("../model/users.model")

async function checkAdmin(req, res, next) {
    if (!req.session._id) {
        return res.redirect('/admin/login')
    }
    else {
        await User.findOne({ email: req.session._id })
            .then(user => {
                if (user.position == 2) //admim
                    next()
                else
                    return res.redirect('/admin/login')
            })
    }

}
module.exports = checkAdmin