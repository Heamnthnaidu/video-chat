import express from 'express'
import { login, logout, signUp, onboard } from '../controllers/authcontrollers.js'
import { protectRoute } from '../middleware/authmiddleware.js'


const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)
router.post('/logout', logout)

router.post('/onboarding', protectRoute, onboard)

router.get('/me', protectRoute, (req,res) => {
    res.status(200).json({success:true, user: req.user})
})

export default router