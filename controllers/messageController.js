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

export const getUserMessages = async (req, res) => {
    const { id: userToChat } = req.params
    const senderId = req.user._id
    try {

        if (!userToChat || !senderId) return
        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChat },
                { senderId: userToChat, receiverId: senderId }
            ]
        })
        res.status(200).json(messages)


    } catch (error) {
        console.log(error.message, 'Error in getting messages')
        res.status(500).json({ message: 'internal server error' })
    }
}

export const getGroupMessages = async (req, res) => {
    const { id: GroupId } = req.params
    try {
        if (!GroupId) return
        const messages = await Message.find({ chatroom: GroupId })

        res.status(200).json(messages)

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const sendMessages = async (req, res) => {
    const { messageData, UserId, GroupId } = req.body
    const { text, image } = messageData
    const senderId = req.user._id
    try {


        let imgUrl;
        if (image) {

            const base64Length = image.length - (image.indexOf(',') + 1); 
            const size = (base64Length * 3) / 4; 
            const maxSize = 10 * 1024 * 1024

            if (size > maxSize) {
                console.log(maxSize);
                res.status(500).json({ message: 'image size must be less than 10 mb' })
            }

            const uploadResponse = await cloudinary.uploader.upload(image)
            imgUrl = uploadResponse.secure_url
        }


        const Messages = {
            senderId,
            text,
            image: imgUrl
        }
        if (GroupId) {
            Messages.chatroom = GroupId
        }
        if (UserId) {
            Messages.receiverId = UserId
        }

        const newMessage = new Message(Messages)
        await newMessage.save()


        const receiverSocketId = getReciverSocketId(UserId)

        if (GroupId) {
            console.log(`Sending message to group: ${GroupId}`);
            io.to(GroupId).emit('NewGrpMessage', newMessage)
        }
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }

        res.status(200).json(newMessage)

    } catch (error) {

        console.log('error in sending messages: ', error);
        res.status(500).json({ message: 'internal server error' });

    }
}

export const deleteMessage = async (req, res) => {
    const { id } = req.params
    try {
        const delmsg = await Message.findByIdAndDelete(id)
        res.json({ data: delmsg, message: 'message deleted successfully' })
    } catch (error) {
        console.log('error in deleting messages: ', error);
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
        await Group.findByIdAndUpdate(newGroup._id, { $push: { participants: req.user._id } }, { new: true })

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

export const getmembers = async (req, res) => {
    const { id: groupId } = req.params
    try {
        if (!groupId) {
            return res.status(400).json({ message: 'Invalid data' })
        }

        const group = await Group.findById(groupId)


        if (!group) return res.status(404).json({ message: 'Group not found' })

        res.status(200).json(group.participants)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'internal server error' });
    }
}

export const addmember = async (req, res) => {
    const { id: groupId } = req.params
    const { selectedUserID } = req.body
    console.log(selectedUserID, groupId, 'gk');

    try {
        if (!groupId || !selectedUserID) return res.status(400).json({ message: 'Invalid data' })
        const group = await Group.findById(groupId)
        if (group.participants.includes(selectedUserID)) return res.status(400).json({ message: 'alredy joined the group' })

        const groupupdate = await Group.findByIdAndUpdate(groupId, { $push: { participants: selectedUserID } }, { new: true })

        const user = await User.findOne({ _id: selectedUserID })
        console.log(user);


        res.status(200).json({ message: `${user.userName} joined the Group`, data: groupupdate.participants })



    } catch (error) {
        console.log(error);
    }
}
export const removemember = async (req, res) => {
    const { id: groupId } = req.params
    const { selectedUserID } = req.body
    console.log(selectedUserID);

    try {
        if (!groupId || !selectedUserID) return res.status(400).json({ message: 'Invalid Data' })

        const user = await User.findById(selectedUserID)

        const group = await Group.findByIdAndUpdate(groupId, { $pull: { participants: selectedUserID } }, { new: true })
        if (!group) return res.status(404).json({ message: 'Group not found' })
        res.status(200).json({ message: `${user.userName} left the Group`, data: group.participants })
    } catch (error) {
        console.log(error);

    }
}

export const searchContact = async (req, res) => {
    const loggedInUser = req.user._id
    try {
        const { query } = req.query
        const users = await User.find({
            $and: [
                { _id: { $ne: loggedInUser } },
                {
                    $or: [
                        { userName: { $regex: query, $options: 'i' } },
                        { displayName: { $regex: query, $options: 'i' } }
                    ]
                }
            ]
        }).limit(10).select('-password')

        res.status(200).json(users)
    } catch (error) {
        console.log(error);

    }
}