const express = require('express')
const router = express.Router()
const imageController = require('../controllers/imageController')
const upload = require('../utils/fileHeper')

router.post('/upload-image', upload.single('image'), imageController.uploadImage)
router.post('/filter-results', imageController.filterResultsEndpoint)
router.post('/prepare-display-data', imageController.prepareDisplayDataEndpoint)
router.post('/most-likely-username', imageController.most_likely_username)
router.post('/validate-url', imageController.validate_url)

module.exports = router