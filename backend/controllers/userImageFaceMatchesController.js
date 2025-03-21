const FormData = require('form-data')
const UserFaceImageMatches = require('../models/UserImageFaceMatches')
const { successResponse, errorResponse } = require('../utils/errorHandler')
const { HTTP_INTERNAL_SERVER_ERROR_500, HTTP_BAD_REQUEST_400 } = require('../utils/https.status')
const fs = require('fs')
const axios = require('axios')
const APITOKEN = 'tmSWkdDten7CzaD8IdSOjhp/okSsNXAdGXKQVuj5rO3HowsnNoi9zBdx9f3sHIDYutK4DhZuQlg='
const TESTING_MODE = true

const saveUserImageFaceMatches = async (req, res) => {
    try {
        const id = req.body.id
        const faceMatches = req.body.data
        for (let match of faceMatches) {
            match.user_id = id
            await UserFaceImageMatches.create(match) // Insert each document one by one
        }
        return successResponse(res, {}, 'All data inserted successfully. ')
    } catch (error) {
        return errorResponse(res, { error: error.message }, error.message, HTTP_INTERNAL_SERVER_ERROR_500)
    }
}

const getImageResult = async (req, res) => {
    if (TESTING_MODE) {
        console.log('****** TESTING MODE: Results may be inaccurate ******')
    }

    const imagePath = req.body.imagePath

    const site = 'https://facecheck.id'
    const headers = { 'accept': 'application/json', 'Authorization': APITOKEN }
    const formData = new FormData()
    formData.append('images', fs.createReadStream(imagePath))
    formData.append('id_search', '')

    try {
        const response = await axios.post(`${site}/api/upload_pic`, formData, { ...formData.getHeaders(), headers })
        if (response.data.error) {
            return { error: `${response.data.error} (${response.data.code})`, results: null }
        }

        const id_search = response.data.id_search

        const json_data = { id_search, with_progress: true, status_only: false, demo: TESTING_MODE }

        while (true) {
            const searchResponse = await axios.post(`${site}/api/search`, json_data, { headers })
            if (searchResponse.data.error) {
                return errorResponse(res, { error: searchResponse.data.error, code: searchResponse.data.code }, searchResponse.data.error, HTTP_BAD_REQUEST_400)
            }
            if (searchResponse.data.output) {
                console.log(searchResponse.data.output.items)
                return successResponse(res, { results: searchResponse.data.output.items }, 'All data inserted successfully. ')
            }
            console.log(`${searchResponse.data.message} progress: ${searchResponse.data.progress}%`)
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    } catch (error) {
        return errorResponse(res, { error: error.message }, error.message, HTTP_INTERNAL_SERVER_ERROR_500)
    }
}

const userImageResultData = async (req, res) => {
    try {
        const userId = req.decoded.id
        const imageResultData = await UserFaceImageMatches.find({ user_id: userId })
        return successResponse(res, imageResultData, 'Get user face image data successfully.')
    } catch (error) {
        return errorResponse(res, { error: error.message }, 'Error while find user image data', HTTP_INTERNAL_SERVER_ERROR_500)
    }
}

module.exports = {
    saveUserImageFaceMatches,
    getImageResult,
    userImageResultData
}
