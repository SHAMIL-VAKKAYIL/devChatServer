import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
    const { fullname, email, password } = req.body
    try {
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })

        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: 'Email already exists' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({ fullname, email, password: hashedPassword })
        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullname: fullname,
                email: email,
                profilePic: newUser.profilePic
            })

        } else {
            return res.status(500).json({ message: 'Error creating user' })
        }

    } catch (error) {
        res.status(500).json({ message: 'Error creating user' })
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic
        })

    } catch (error) {
        console.log("Error in login process", error.message);

        res.status(404).json({ message: "internalError" })
    }
}
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.json({ message: "Logged out successfully" })
    } catch (error) {
        res.status(404).json({ message: 'internal error' })
    }
}


export const updateProfile = async (req, res) => {
    try {
        const { profilepic } = req.body
        const userId = req.user._id

        if (!profilepic) {
            return res.status(400).json({ message: 'Profile picture is required' })
        }
        const uploadRes = await cloudinary.uploader.upload(profilepic)
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadRes.secure_url }, { new: true })
        res.status(200).json(updatedUser)

    } catch (error) {
        console.log("Error in update profile process", error.message);
        res.status(404).json({ message: 'internal error' })

    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
        
    } catch (error) {
        console.log('error in checkAuth', error);
        res.status(500).json({ message: 'internal server error' })
        
    }

}