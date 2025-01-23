const router = require('express').Router()
const userSchema = require('../models/userSchema')

// router.get('/users', async (req, res) => {
//     console.log('heloo');
    
//     try {
//         // const { user } = req.body
//         const users = await userSchema.find()
//         console.log(users);
//         console.log('users');
        
//         res.status(200).json({users})
//     } catch (error) {
//     }
// })


module.exports = router