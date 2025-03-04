const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { protectedRoute } = require('../middleware/auth.middleware')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/users-details', protectedRoute, authController.getCurrentUserDetails)

module.exports = router
