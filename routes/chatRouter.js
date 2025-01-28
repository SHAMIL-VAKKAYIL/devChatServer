import express from 'express'
import Message from '../models/messageSchema.js'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { getGroup, getMessages, getSelectedUser, getUSersForSidebar, sendMessages } from '../controllers/messageController.js'

const router = express.Router()


router.get('/users', protectRoute, getUSersForSidebar)
router.get('/:id', protectRoute, getMessages)
router.get('/selected/:id', protectRoute, getSelectedUser)
router.post('/send/:id', protectRoute, sendMessages)
router.get('/group/:id',protectRoute,getGroup)

export default router