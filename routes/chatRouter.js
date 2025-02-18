import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { addmember, createGroup, getGroupMessages, getGroups, getmembers, getSelectedGroup, getSelectedUser, getUserMessages, getUSersForSidebar, removemember, sendMessages } from '../controllers/messageController.js'

const router = express.Router()


router.get('/users', protectRoute, getUSersForSidebar)
router.get('/messages/:id', protectRoute, getUserMessages)
router.get('/groupMessages/:id', protectRoute, getGroupMessages)
router.get('/selected/:id', protectRoute, getSelectedUser)

router.get('/group/:id', protectRoute, getSelectedGroup)
router.get('/groups', protectRoute, getGroups)

router.post('/creategroup', protectRoute, createGroup)
router.post('/send', protectRoute, sendMessages)
router.get('/groupmembers/:id', protectRoute, getmembers)
router.post('/addmember/:id', protectRoute, addmember)
router.post('/removemember/:id', protectRoute, removemember)

export default router