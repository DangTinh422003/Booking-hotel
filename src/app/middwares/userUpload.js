const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

const storage = multer.diskStorage({
    destination: './public/img/users',
    filename: (req, file, cb) => {
        cb(null, crypto.createHash('md5').update(Math.random().toString()).digest('hex')
            + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})

module.exports = upload
