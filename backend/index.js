require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
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

app.get('/', (req, res) => {
    res.send('Welcome to the backend service API!')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
