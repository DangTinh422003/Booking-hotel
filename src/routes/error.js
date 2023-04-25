const express = require('express')
const router = express.Router()
const siteController = require('../app/controllers/SiteController')

router.use(siteController.error)

module.exports = router