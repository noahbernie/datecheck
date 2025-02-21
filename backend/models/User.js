const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user'
    },
    jwtSecret: {
        type: String
    }
}, { timestamps: true })

const Model = mongoose.model('users', UserSchema)

module.exports = Model