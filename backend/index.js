const express = require('express')
const cors = require('cors')
const imageRoutes = require('./routes/imageRoutes')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', imageRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to the backend service API!')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
