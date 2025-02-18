const tmp = require('tmp')
const path = require('path')
const fs = require('fs')
const { get_image_results, filter_results, find_most_likely_username, isValidUrl, prepare_display_data } = require('../services/imageService')

const uploadImage = async (req, res) => {
    console.log('here to show image', req.file)
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
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

            return res.status(200).json({ results: results });
        } catch (error) {
            // Clean up on error
            fs.unlinkSync(filePath);
            fs.rmdirSync(tempDir.name);
            return res.status(500).json({ error: error.message });
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const filterResultsEndpoint = (req, res) => {
    const data = req.body;
    if (!data) {
        return res.status(400).json({ error: 'No results provided in the request' });
    }
    console.log(req.body)
    results = data['results']

    const { instagram_usernames, linkedin_usernames, twitter_usernames, facebook_usernames, other_usernames } = filter_results(results)

    return res.status(200).json({
        'instagram': instagram_usernames,
        'linkedin': linkedin_usernames,
        'twitter': twitter_usernames,
        'facebook': facebook_usernames,
        'others': other_usernames
    });
}

const prepareDisplayDataEndpoint = (req, res) => {
    const data = req.body;

    if (!data) {
        return res.status(400).json({ error: 'Invalid request data' });
    }

    try {
        const instagramUsernames = data.instagram || [];
        const linkedinUsernames = data.linkedin || [];
        const twitterUsernames = data.twitter || [];
        const facebookUsernames = data.facebook || [];
        const otherUsernames = data.others || [];

        const displayData = prepare_display_data(
            instagramUsernames,
            linkedinUsernames,
            twitterUsernames,
            facebookUsernames,
            otherUsernames
        );

        return res.status(200).json({ display_data: displayData });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const most_likely_username = (req, res) => {
    const data = req.body;

    if (!data) {
        return res.status(400).json({ error: 'Invalid request data' });
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
        );

        return res.status(200).json({ most_likely_usernames: mostLikely });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const validate_url = (req, res) => {
    const data = req.body;

    if (!data || !data.url) {
        return res.status(400).json({ error: 'No URL provided' });
    }

    const url = data.url;
    const isValid = isValidUrl(url);
    return res.status(200).json({ url: url, is_valid: isValid });
}

module.exports = {
    uploadImage,
    filterResultsEndpoint,
    prepareDisplayDataEndpoint,
    most_likely_username,
    validate_url
}