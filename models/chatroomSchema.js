const mongoose = require('mongoose')

const chatroomSchema = new mongoose.Schema({
    name: { type: String, required: false },
    isGroupchat: { type: Boolean, default: false },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdDate: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Chatroom', chatroomSchema)