const tmp = require('tmp')
const path = require('path')
const fs = require('fs')
const { successResponse, errorResponse } = require('../utils/errorHandler')
const { HTTP_BAD_REQUEST_400, HTTP_INTERNAL_SERVER_ERROR_500 } = require('../utils/https.status')
const { get_image_results, filter_results, find_most_likely_username, isValidUrl, prepare_display_data } = require('../services/imageService')

const uploadImage = async (req, res) => {
    if (!req.file) {
        return errorResponse(res, { error: 'No image file provided' }, 'No image file provided', HTTP_BAD_REQUEST_400)
    }

    try {
        // Save the uploaded file to a temporary location
        const file = req.file
        const tempDir = tmp.dirSync(); // Create a temporary directory
        const filePath = path.join(tempDir.name, file.originalname);

        // Move the uploaded file to the temporary directory
        fs.renameSync(file.path, filePath);

        // Call the getImageResults function with the temporary file path
        try {
            const results = await get_image_results(filePath);
            // Clean up: Delete the temporary file and directory
            fs.unlinkSync(filePath); // Delete the file
            fs.rmdirSync(tempDir.name); // Remove the temporary directory

            return successResponse(res, { results: results }, 'Image uploaded successfully')
        } catch (error) {
            // Clean up on error
            fs.unlinkSync(filePath)
            fs.rmdirSync(tempDir.name)
            return errorResponse(res, { error: error.message }, error.message, HTTP_INTERNAL_SERVER_ERROR_500)
        }

    } catch (error) {
        return errorResponse(res, { error: error.message }, error.message, HTTP_INTERNAL_SERVER_ERROR_500)
    }
}

const filterResultsEndpoint = (req, res) => {
    const data = req.body;
    if (!data) {
        return errorResponse(res, { error: 'No results provided in the request' }, 'No results provided in the request', HTTP_BAD_REQUEST_400)
    }
    results = data['results']

    const { instagramUsernames, linkedinUsernames, facebookUsernames, twitterUsernames, otherUsernames } = filter_results(results)

    return successResponse(res, {
        'instagram': instagramUsernames,
        'linkedin': linkedinUsernames,
        'twitter': facebookUsernames,
        'facebook': twitterUsernames,
        'others': otherUsernames
    }, 'Filter Result Successfully')
}

const prepareDisplayDataEndpoint = async (req, res) => {
    const data = req.body;
    if (!data) {
        return errorResponse(res, { error: 'Invalid request data' }, 'Invalid request data', HTTP_BAD_REQUEST_400)
    }

    try {
        const instagramUsernames = data.instagram || [];
        const linkedinUsernames = data.linkedin || [];
        const twitterUsernames = data.twitter || [];
        const facebookUsernames = data.facebook || [];
        const otherUsernames = data.others || [];

        const displayData = await prepare_display_data(
            instagramUsernames,
            linkedinUsernames,
            twitterUsernames,
            facebookUsernames,
            otherUsernames
        )
        return successResponse(res, { display_data: displayData }, 'Prepare display data successfully.')
    } catch (error) {
        return errorResponse(res, { error: error.message }, error.message, HTTP_INTERNAL_SERVER_ERROR_500)
    }
}

const most_likely_username = (req, res) => {
    const data = req.body;

    if (!data) {
        return errorResponse(res, { error: 'Invalid request data' }, 'Invalid request data', HTTP_BAD_REQUEST_400)
    }

    try {
        const instagramUsernames = data.instagram || [];
        const facebookUsernames = data.facebook || [];
        const twitterUsernames = data.twitter || [];
        const linkedinUsernames = data.linkedin || [];

        const mostLikely = find_most_likely_username(
            instagramUsernames,
            facebookUsernames,
            twitterUsernames,
            linkedinUsernames
        )
        return successResponse(res, { most_likely_usernames: mostLikely }, 'Get the most likely username successfully.')
    } catch (error) {
        return errorResponse(res, { error: error.message }, error.message, HTTP_INTERNAL_SERVER_ERROR_500)
    }
}

const validate_url = (req, res) => {
    const data = req.body;

    if (!data || !data.url) {
        return errorResponse(res, { error: 'No URL provided' }, 'No URL provided', HTTP_BAD_REQUEST_400)
    }

    const url = data.url;
    const isValid = isValidUrl(url)
    return successResponse(res, { url: url, is_valid: isValid }, 'Url validate successfully.')
}

module.exports = {
    uploadImage,
    filterResultsEndpoint,
    prepareDisplayDataEndpoint,
    most_likely_username,
    validate_url
}