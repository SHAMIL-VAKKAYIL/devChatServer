import mongoose from "mongoose"


const chatroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ''
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // isGroupchat: { type: Boolean, default: false },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    }],
    createdDate: {
        type: Date,
        default: Date.now
    }
})

const Group = mongoose.model('Chatroom', chatroomSchema)
export default Group