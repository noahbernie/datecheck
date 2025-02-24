const _ = require('lodash')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { HTTP_BAD_REQUEST_400, HTTP_INTERNAL_SERVER_ERROR_500 } = require('../utils/https.status')
const { errorResponse, successResponse } = require('../utils/errorHandler')
const validateRegisterData = require('../validation/register')

const register = async (req, res) => {
    try {
        console.log(req)
        const { isValid, errors } = validateRegisterData(req.body)

        if (!isValid) return errorResponse(res, errors, 'Invalid data', HTTP_BAD_REQUEST_400)
        let { email, password } = req.body
        const userEmail = email.toLowerCase().trim()
        const isUserExist = await User.exists({ email: userEmail })
        if (isUserExist) {
            const errorMessage = 'This email is already in use. Please use another email.'
            return errorResponse(res, { error: errorMessage }, errorMessage, HTTP_BAD_REQUEST_400)
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const data = {
            email: userEmail,
            password: hashPassword
        }

        const user = await new User(data)
        await user.save()

        const payload = {
            id: user._id,
            isAdmin: user.isAdmin,
            role: user.role
        }
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2d' })
        const response = {
            token: `Bearer ${token}`,
            userId: user._id
        }
        return successResponse(res, response, 'User register successfully.')
    } catch (error) {
        console.log(error)
        return errorResponse(res, { error: error.message }, error.message, HTTP_INTERNAL_SERVER_ERROR_500)
    }
}

module.exports = { register }