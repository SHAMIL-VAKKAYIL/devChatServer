import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilePic: {
        type: String,
        default: ''
    },
    displayName: {
        type: String,
        default: '',
        index: true
    }
},
    { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User