import express from 'express'
import { checkAuth,  login,  logout, signup, updateProfile } from '../controllers/authController.js'
import { protectRoute } from '../middlewares/auth.middleware.js'
// import  userSchema from '../models/userSchema.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

router.put('/update_profile', protectRoute, updateProfile)

router.get('/check',protectRoute,checkAuth)

export default router