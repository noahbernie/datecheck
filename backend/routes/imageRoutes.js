const express = require('express')
const router = express.Router()
const imageController = require('../controllers/imageController')
const userImageFaceMatchesConroller = require('../controllers/userImageFaceMatchesController')
const upload = require('../utils/fileHeper')
const { protectedRoute } = require('../middleware/auth.middleware')

router.post('/upload-image', upload.single('image'), imageController.uploadImage)
router.post('/filter-results', imageController.filterResultsEndpoint)
router.post('/prepare-display-data', imageController.prepareDisplayDataEndpoint)
router.post('/most-likely-username', imageController.most_likely_username)
router.post('/validate-url', imageController.validate_url)
router.post('/user-image-face-matches', userImageFaceMatchesConroller.saveUserImageFaceMatches)
router.post('/get-image-result', protectedRoute, userImageFaceMatchesConroller.getImageResult)
router.post('/user-image-face-result', protectedRoute, userImageFaceMatchesConroller.userImageResultData)

module.exports = router