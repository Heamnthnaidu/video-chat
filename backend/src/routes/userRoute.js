import express from 'express'
import { protectRoute } from '../middleware/authmiddleware.js'
import { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, outgoingFriendRequest } from '../controllers/userController.js'

const router = express.Router()

router.use(protectRoute)

router.get('/', getRecommendedUsers)
router.get('/friends', getMyFriends)

router.post('/friend-request/:id', sendFriendRequest)
router.put('/friend-request/:id/accept', acceptFriendRequest)

router.get('/friend-requests', getFriendRequests)
router.get('/outgoing-friend-request', outgoingFriendRequest)



export default router


