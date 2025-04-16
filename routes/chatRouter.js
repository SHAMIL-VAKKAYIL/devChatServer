import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { addmember, createGroup, deleteMessage, getGroupMessages, getGroups, getmembers, getSelectedGroup, getSelectedUser, getUserMessages, getUSersForSidebar, removemember, searchContact, sendMessages } from '../controllers/messageController.js'

const router = express.Router()


router.get('/users', protectRoute, getUSersForSidebar)

router.get('/messages/:id', protectRoute, getUserMessages)
router.get('/groupMessages/:id', protectRoute, getGroupMessages)
router.delete('/delmsg/:id',protectRoute,deleteMessage)

router.get('/selected/:id', protectRoute, getSelectedUser)
router.get('/group/:id', protectRoute, getSelectedGroup)
router.get('/groups', protectRoute, getGroups)

router.post('/creategroup', protectRoute, createGroup)
router.post('/send', protectRoute, sendMessages)
router.get('/groupmembers/:id', protectRoute, getmembers)
router.post('/addmember/:id', protectRoute, addmember)
router.put('/removemember/:id', protectRoute, removemember)

router.get('/search', protectRoute, searchContact)

export default router