import express from 'express'
import Message from '../models/messageSchema.js'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { getMessages, getUSersForSidebar, sendMessages } from '../controllers/messageController.js'

const router = express.Router()


router.get('/users', protectRoute, getUSersForSidebar)
router.get('/:id', protectRoute, getMessages)

router.post('/send/:id', protectRoute, sendMessages)

export default router