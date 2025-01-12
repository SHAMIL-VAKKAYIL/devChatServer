import { response } from "express"
import cloudinary from "../lib/cloudinary.js"
import Message from "../models/messageSchema.js"
import User from "../models/user.model.js"


export const getUSersForSidebar = async (req, res) => {
    try {
        const loggedInUser = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select('-password')

        res.status(200).json(filteredUsers)

    } catch (error) {
        console.error(error.message, 'Error in getting users')
        res.status(500).json({ message: 'internal server error' })

    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChat } = req.params
        const myId = req.user._id
        const messages = await Message.find({
            $or: [
                { senderId: myId, reciverId: userToChat },
                { senderId: userToChat, reciverId: myId }
            ]
        })
        res.status(200).json(messages)

    } catch (error) {
        console.log(error.message, 'Error in getting messages')
        res.status(500).json({ message: 'internal server error' })
    }
}

export const sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body
        const { id: receiverId } = req.params
        senderId = req.user._id

        let imgUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imgUrl = uploadResponse.secure_url
        }
        const newMessage = new Message({
            senderId,
            reciverId: receiverId,
            text,
            image: imgUrl
        })
        await newMessage.save()
        // todo: realtime fuctionalty using socket.io

        res.status(200).json(newMessage)
        
    } catch (error) {

        console.log('error in sending messages: ', error);
        res.status(500).json({ message: 'internal server error' });

    }
}