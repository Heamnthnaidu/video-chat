import FriendRequest from "../models/FriendRequest.js"
import User from "../models/User.js"

export const getRecommendedUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id
        const currentUser = req.user

        const recommmendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: currentUser.friends } },
                { isOnboarded: true }
            ]
        })
        res.status(200).json(recommmendedUsers)

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal server Error" })
    }
}


export const getMyFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('friends')
            .populate('friends', 'fullName profilePic nativeLanguage learningLanguage')

        res.status(200).json(user.friends)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal server Error" })
    }
}

export const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user._id
        const { id: recipientId } = req.params

        // prevent sending to u
        if (myId === recipientId) {
            return res.status(400).json({ message: "You can't sed request to yourself" })
        }

        const recipient = await User.findById(recipientId)

        if (!recipient) {
            res.status(400).json({ message: "Recipiant not found" })
        }

        // checking if both are friends
        if (recipient.friends.includes(myId)) {
            res.status(400).json({ message: "You are already friends with this user" })
        }

        // check if a req already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        })

        if (existingRequest) {
            res.status(400).json({ message: "A friend request already exists b/w you and user" })
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        })

        res.status(201).json(friendRequest)


    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal server Error" })
    }
}


export const acceptFriendRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params
        const friendRequest = await FriendRequest.findById(requestId)

        if (!friendRequest) {
            res.status(404).json({ message: "Friend request Not found" })
        }

        // check if current user is the recipient
        if (friendRequest.recipient.toString() !== req.user._id) {
            res.status(403).json({ message: "You're not authorized to accept this request" })
        }

        friendRequest.status = "accepted"
        await friendRequest.save()

        // add each user to the other's friends array
        // addToSet is add a method adds elements to an array if they does not exist already
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        })

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }
        })

        res.status(200).json({ message: "Friend Request Accepted" })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal server Error" })
    }
}

export const getFriendRequests = async (req, res) => {
    try {
        const incomingRequests = await FriendRequest.find({
            recipient: req.user._id,
            status: "pending"
        }).populate("sender", 'fullName nativeLanguage profilePic learningLanguage')

        const acceptedRequest = await FriendRequest.find({
            sender: req.user._id,
            status: "accepted"
        }).populate("recipient", "fullName profilePic")

        res.status(200).json({
            incomingReqs: incomingRequests,
            acceptedReqs: acceptedRequest
        })


    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal server Error" })
    }
}


export const outgoingFriendRequest = async (req, res) => {
    try {

        const outgoingReq = await FriendRequest.find({
            sender: req.user._id,
            status: "pending"
        }).populate("recipient", 'fullName nativeLanguage profilePic learningLanguage')

        res.status(200).json(outgoingReq)

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal server Error" })
    }
}