const jwt = require('jsonwebtoken')
const _ = require('lodash')
const { errorResponse } = require('../utils/errorHandler')
const { HTTP_UNAUTHORIZED_401 } = require('../utils/https.status')
const User = require('../models/User')

/**
 * middleware to verify logged user
 *
 * @param {object} req request
 * @param {object} res response
 * @param {object} next next
 * @returns {boolean} response sent
 */
async function protectedRoute(req, res, next) {
    let token = req.headers.authorization
    req.headers.authorization
    if (!token) {
        return errorResponse(res, { error: 'You are not authorized to access this route' }, 'Unauthorized', HTTP_UNAUTHORIZED_401)
    }

    token = token.split(' ')[1]

    try {
        const secretOrKey = await getJWT(token)
        req.decoded = jwt.verify(token, secretOrKey)
        next()
    } catch (err) {
        console.log(err)
        return errorResponse(res, { error: 'You are not authorized' }, 'Unauthorized', HTTP_UNAUTHORIZED_401)
    }
}

/**
 * Get jwt
 *
 * @param {string} token token
 * @returns {Promise} promise
 */
async function getJWT(token) {
    let secretOrKey = process.env.JWT_SECRET || ''
    console.log(secretOrKey)
    const decodedToken = jwt.decode(token)
    let user = await User.findOne({ _id: decodedToken.id }, 'jwtSecret')
    console.log(user)
    const jwtSecret = _.get(user, 'jwtSecret', false)
    if (jwtSecret) {
        secretOrKey = jwtSecret
    }

    return secretOrKey
}

module.exports = { protectedRoute }