const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    chatroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chatroom',
        required: false
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    image: { type: String, required: false },
    message: { type: String, required: false },
    timestamp: { type: Date, default: Date.now }

})

module.exports = mongoose.model('Message', messageSchema)