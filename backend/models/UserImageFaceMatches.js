const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserFaceImageMatches = new Schema({
    platform: {
        type: String,
    },
    profilePhoto: {
        type: String,
        required: true
    },
    profileUrl: {
        type: String,
        default: false
    },
    score: {
        type: Number,
        default: 'user'
    },
    userName: {
        type: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    user_face_image_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_face_image'
    }
}, { timestamps: true })

const Model = mongoose.model('user_face_image_matches', UserFaceImageMatches)

module.exports = Model
