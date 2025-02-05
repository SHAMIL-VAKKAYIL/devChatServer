import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { addmember, createGroup, getGroups, getMessages, getSelectedGroup, getSelectedUser, getUSersForSidebar, removemember, sendMessages } from '../controllers/messageController.js'

const router = express.Router()


router.get('/users', protectRoute, getUSersForSidebar)
router.get('/messages/:id', protectRoute, getMessages)
router.get('/selected/:id', protectRoute, getSelectedUser)

router.get('/group/:id', protectRoute, getSelectedGroup)
router.get('/groups', protectRoute, getGroups)

router.post('/creategroup', protectRoute, createGroup)
router.post('/send/:id', protectRoute, sendMessages)
router.post('/addmember/:id', protectRoute, addmember)
router.post('/removemember/:id', protectRoute, removemember)

export default router