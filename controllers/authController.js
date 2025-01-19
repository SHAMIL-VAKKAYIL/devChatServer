import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
    const { name, email, password } = req.body
    try {
        console.log(name, email, password);

        const exuser = await User.findOne({ email: email })
        if (exuser) {
            console.log(exuser);
            return res.status(400).json('Email already exists')
        } else {
            const salt = await bcrypt.genSalt(10)
            const hashedpassword = await bcrypt.hash(password, salt)
            console.log(hashedpassword, 'password hash');

            const newUser = new User({ fullname: name, email, password: hashedpassword })
            await newUser.save()
            return res.status(201).json({ message: 'User created successfully' });
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
            return res.status(400).json('invalid credentials')
        }
        else {
            const isPasswordCorrect = await bcrypt.compare(password, user.password)

            if (!isPasswordCorrect) {
                return res.status(400).json('invalid credentials')
            }
            else {
                generateToken(user._id, res)
                res.status(200).json({
                    id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    profilePic: user.profilePic
                })
            }
        }
    } catch (error) {
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
        console.log(req.user);
        
        res.status(200).json(req.user)

    } catch (error) {
        console.log('error in checkAuth', error);
        res.status(500).json({ message: 'internal server error' })

    }

}