class SiteController {
    error(req, res) {
        res.status(404)
        res.render('pages/errorPage/error',{layout:null})
    }
}

module.exports = new SiteController()