const multer = require('multer')
const path = require('path')

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Unique file name
  }
})

// Initialize multer with storage
const upload = multer({ storage: storage })

module.exports = upload
