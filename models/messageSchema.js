import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    chatroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chatroom',
        
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    image: { type: String, required: false },
    text: { type: String, required: false },

},
    { timestamps: true })

const Message = mongoose.model('Message', messageSchema)

export default Message;