require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const axios = require('axios')
const cheerio = require('cheerio')
const imageRoutes = require('./routes/imageRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json())


// DB Config
const db = process.env.MONGO_URI
// Connect to MongoDB
mongoose
    .connect(db)
    .then(async () => {
        console.log('Connected to Database')
    })
    .catch((err) => {
        console.log('Not Connected to Database ERROR! ', err)
    })


app.use('/api', imageRoutes)
app.use('/api/user', authRoutes)

// async function getSocialMediaImage(postUrl) {
//     try {
//         const { data } = await axios.get(postUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } })
//         const $ = cheerio.load(data)

//         // Extract Open Graph Image
//         const imageUrl = $('meta[property="og:image"]').attr('content')

//         if (imageUrl) {
//             console.log('Image URL:', imageUrl)
//             return imageUrl
//         } else {
//             console.log('No image found')
//         }
//     } catch (error) {
//         console.error('Error fetching post image:', error.message)
//     }
// }
// getSocialMediaImage('https://www.instagram.com/p/DBWnj4iPafB/')

app.get('/', (req, res) => {
    res.send('Welcome to the backend service API!')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
