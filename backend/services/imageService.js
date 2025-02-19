const axios = require('axios')
const FormData = require('form-data')
const { URL } = require('url')
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const fs = require('fs')
const APITOKEN = 'uXfDEJnPDTFB/riggN9gZvhnmwaYtMTEV6e8Kce9cwjNKvIs/+CvGgN4agdwhqbJYaIjIHQsmXo='
const TESTING_MODE = false

const get_image_results = async (imagePath) => {
    if (TESTING_MODE) {
        console.log('****** TESTING MODE: Results may be inaccurate ******')
    }

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
        console.log(`${response.data.message} id_search=${id_search}`)

        const json_data = { id_search, with_progress: true, status_only: false, demo: TESTING_MODE }

        while (true) {
            const searchResponse = await axios.post(`${site}/api/search`, json_data, { headers })
            if (searchResponse.data.error) {
                return { error: `${searchResponse.data.error} (${searchResponse.data.code})`, results: null }
            }
            if (searchResponse.data.output) {
                return { error: null, results: searchResponse.data.output.items }
            }
            console.log(`${searchResponse.data.message} progress: ${searchResponse.data.progress}%`)
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    } catch (err) {
        return { error: err.message, results: null }
    }
}

function get_image_path() {
    return new Promise((resolve) => {
        // Prompt user for input
        rl.question("Please provide the image path or URL: ", (imagePath) => {
            imagePath = imagePath.trim()

            // Validate as URL
            if (isValidUrl(imagePath)) {
                console.log("Valid URL provided.")
                resolve(imagePath)
            }
            // Validate as file path
            else if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
                console.log("Valid file path provided.")
                resolve(imagePath)
            } else {
                console.log("Invalid input. Please provide a valid image URL or file path.")
                resolve(getImagePath())  // Retry if input is invalid
            }
        })
    })
}

function isValidUrl(url) {
    try {
        new URL(url)
        return true
    } catch (e) {
        return false
    }
}

const filter_results = (results) => {
    const scoreThreshold = 75
    const instagramUsernames = []
    const linkedinUsernames = []
    const facebookUsernames = []
    const twitterUsernames = []
    const otherUsernames = []

    const patterns = {
        instagram: /instagram\.com\/([a-zA-Z0-9_.-]+)/,
        linkedin: /linkedin\.com\/in\/([a-zA-Z0-9_-]+)/,
        facebook: /facebook\.com\/([a-zA-Z0-9.]+)/,
        twitter: /x\.com\/([a-zA-Z0-9_-]+)/
    }

    for (let i = 0; i < results.length; i++) {
        const { score, url } = results[i]
        if (score > scoreThreshold) {
            let matched = false

            if (patterns.instagram.test(url)) {
                const match = url.match(patterns.instagram)
                if (match) {
                    instagramUsernames.push({ url, username: match[1], score })
                    matched = true
                }
            }

            if (patterns.linkedin.test(url)) {
                const match = url.match(patterns.linkedin)
                if (match) {
                    linkedinUsernames.push({ url, username: match[1], score })
                    matched = true
                }
            }

            if (patterns.facebook.test(url)) {
                const match = url.match(patterns.facebook)
                if (match) {
                    facebookUsernames.push({ url, username: match[1], score })
                    matched = true
                }
            }

            if (patterns.twitter.test(url)) {
                const match = url.match(patterns.twitter)
                if (match) {
                    twitterUsernames.push({ url, username: match[1], score })
                    matched = true
                }
            }

            if (!matched) {
                otherUsernames.push({ url, username: url, score })
            }
        }
    }

    return {
        instagramUsernames,
        linkedinUsernames,
        facebookUsernames,
        twitterUsernames,
        otherUsernames
    }
}

const find_most_likely_username = (instagramUsernames, facebookUsernames, twitterUsernames, linkedinUsernames) => {
    const allBuckets = {
        Instagram: instagramUsernames,
        Facebook: facebookUsernames,
        Twitter: twitterUsernames,
        LinkedIn: linkedinUsernames
    }

    // Flatten all usernames into a single list with sources
    const allUsernames = []
    for (const [platform, usernames] of Object.entries(allBuckets)) {
        for (const { username } of usernames) {
            allUsernames.push({ username, platform })
        }
    }

    // Compare usernames for overlap or similarity
    const usernameScores = {}
    for (let i = 0; i < allUsernames.length; i++) {
        const { username: username1, platform: platform1 } = allUsernames[i]
        for (let j = i + 1; j < allUsernames.length; j++) {
            const { username: username2, platform: platform2 } = allUsernames[j]
            const similarity = similarityScore(username1, username2)
            if (similarity > 0.6) { // Adjust threshold as needed
                if (!usernameScores[username1]) {
                    usernameScores[username1] = { score: 0, platforms: new Set() }
                }
                if (platform1 !== platform2) {
                    usernameScores[username1].score += similarity
                }
                usernameScores[username1].platforms.add(platform2)

                if (!usernameScores[username2]) {
                    usernameScores[username2] = { score: 0, platforms: new Set() }
                }
                if (platform1 !== platform2) {
                    usernameScores[username2].score += similarity
                }
                usernameScores[username2].platforms.add(platform1)
            }
        }
    }

    // Rank usernames by score
    const sortedUsernames = Object.entries(usernameScores).sort((a, b) => {
        const [usernameA, detailsA] = a
        const [usernameB, detailsB] = b
        return detailsB.platforms.size - detailsA.platforms.size || detailsB.score - detailsA.score
    })

    // Output the most likely usernames
    return sortedUsernames.map(([username, details]) => ({
        username,
        score: details.score,
        platforms: Array.from(details.platforms)
    }))
}

const similarityScore = (str1, str2) => {
    let longer = str1
    let shorter = str2
    if (str1.length < str2.length) {
        longer = str2
        shorter = str1
    }
    const longerLength = longer.length
    if (longerLength === 0) {
        return 1.0
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
}

const editDistance = (str1, str2) => {
    const costs = []
    for (let i = 0; i <= str1.length; i++) {
        let lastValue = i
        for (let j = 0; j <= str2.length; j++) {
            if (i === 0) {
                costs[j] = j
            } else {
                if (j > 0) {
                    let newValue = costs[j - 1]
                    if (str1.charAt(i - 1) !== str2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
                    }
                    costs[j - 1] = lastValue
                    lastValue = newValue
                }
            }
        }
        if (i > 0) {
            costs[str2.length] = lastValue
        }
    }
    return costs[str2.length]
}

const prepare_display_data = async (instagramUsernamesWithScores, linkedinUsernamesWithScores, twitterUsernamesWithScores, facebookUsernamesWithScores, otherUsernamesWithScores) => {
    const baseUrls = {
        instagram: 'https://instagram.com/',
        linkedin: 'https://linkedin.com/in/',
        twitter: 'https://x.com/',
        facebook: 'https://facebook.com/'
    }

    const fetchProfilePhoto = async (url) => {
        const placeholderImage = "https://via.placeholder.com/150"
        try {
            const response = await axios.get(url, { timeout: 5000 })
            if (response.status === 200) {
                return url // Assume URL is valid for now
            }
        } catch (e) {
            console.error(`Error fetching profile photo: ${e}`)
        }
        return placeholderImage
    }

    const prepareEntries = async (usernamesWithScores, platform) => {
        const platformData = []
        for (const { url, username, score } of usernamesWithScores) {
            const profilePhoto = await fetchProfilePhoto(url)
            platformData.push({
                platform: platform.charAt(0).toUpperCase() + platform.slice(1),
                username,
                profileUrl: url,
                profilePhoto,
                score
            })
        }
        return platformData
    }

    const displayData = []
    displayData.push(...await prepareEntries(instagramUsernamesWithScores, 'instagram'))
    displayData.push(...await prepareEntries(linkedinUsernamesWithScores, 'linkedin'))
    displayData.push(...await prepareEntries(twitterUsernamesWithScores, 'twitter'))
    displayData.push(...await prepareEntries(facebookUsernamesWithScores, 'facebook'))

    for (const { url, score } of otherUsernamesWithScores) {
        displayData.push({
            platform: 'Other',
            username: url,
            profileUrl: url,
            profilePhoto: url,
            score
        })
    }

    return displayData
}

module.exports = {
    get_image_results,
    get_image_path,
    isValidUrl,
    filter_results,
    find_most_likely_username,
    prepare_display_data
}
