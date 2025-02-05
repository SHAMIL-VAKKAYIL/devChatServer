import { response } from "express"
import cloudinary from "../lib/cloudinary.js"
import Message from "../models/messageSchema.js"
import User from "../models/user.model.js"
import Group from "../models/chatroomSchema.js"
import { getReciverSocketId, io } from "../lib/socket.js"


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

export const getSelectedUser = async (req, res) => {

    try {
        const { id: userId } = req.params
        const user = await User.findById(userId).select('-password')

        res.status(200).json(user)

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
                { senderId: myId, receiverId: userToChat },
                { senderId: userToChat, receiverId: myId }
            ]
        })
        const details = await Message.find()
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
        const senderId = req.user._id

        let imgUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imgUrl = uploadResponse.secure_url
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imgUrl
        })
        await newMessage.save()
        const receiverSocketId = getReciverSocketId(receiverId)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }

        res.status(200).json(newMessage)

    } catch (error) {

        console.log('error in sending messages: ', error);
        res.status(500).json({ message: 'internal server error' });

    }
}

export const createGroup = async (req, res) => {
    console.log(req.body);

    const { grpName } = req.body
    try {
        console.log(grpName);

        const newGroup = new Group({
            creator: req.user._id,
            name: grpName,

        })
        await newGroup.save()
        res.status(200).json(newGroup)

    } catch (error) {
        console.log(error.message);

    }
}

export const getGroups = async (req, res) => {
    try {
        const groups = await Group.find()
        res.status(200).json(groups)

    } catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }
}
export const getSelectedGroup = async (req, res) => {
    console.log(req.params);
    const { id: groupId } = req.params
    try {
        const selectedGroup = await Group.findOne({ _id: groupId })
        res.status(200).json(selectedGroup)

    } catch (error) {

    }
}

export const addmember = async (req, res) => {
    const { id: groupId } = req.params
    const { userId } = req.body
    try {
        const group = await Group.findByIdAndUpdate(groupId, { $push: { participants: userId } }, { new: true })
        res.status(200).json(group)

    } catch (error) {
        console.log(error);
    }
}
export const removemember = async (req, res) => {
    const { id: groupId } = req.params
    const { userId } = req.body
    try {
        const group = await Group.findByIdAndUpdate(groupId, { $pull: { participants: userId } }, { new: true })
        res.status(200).json(group)
    } catch (error) {
        console.log(error);
        
    }
}