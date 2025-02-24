/**
 * Success response success helper function
 *
 * @param {object} res Express response object
 * @param {object} data Response json object
 * @param {string} message human readable messages
 * @returns {boolean} response sent
 */
exports.successResponse = function successResponse(res, data, message) {
    const response = {
        success: 1,
        data: data,
        message: message,
        status: 200
    }
    return res.status(200).json(response)
}
/**
 * Success response error helper function
 *
 * @param {object} res Express response object
 * @param {object} errors Response json object
 * @param {string} message human readable messages
 * @param {number} status http status code
 * @returns {boolean} response sent
 */

exports.errorResponse = function errorResponse(res, errors, message, status) {
    const response = {
        success: 0,
        data: {},
        errors: errors,
        message: message,
        status: status
    }
    return res.status(status).json(response)
}
