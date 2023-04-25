const User = require("../model/users.model")

async function checkUser(req, res, next) {
    if (!req.session._id) {
        return res.redirect('/')
    }
    else {
        await User.findOne({ email: req.session._id })
            .then(user => {
                if (user.position == 0) 
                    next()
                else
                    return res.redirect('/')
            })
    }

}
module.exports = checkUser