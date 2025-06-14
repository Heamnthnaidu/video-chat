import { upsertStreamUser } from "../config/stream.js";
import User from "../models/User.js";
import jwt from 'jsonwebtoken'

export const signUp = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" })
        }

        const index = Math.floor(Math.random() * 100) + 1

        const randomAvator = `https://avatar.iran.liara.run/public/${index}.png`

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvator
        })
        console.log(newUser._id)

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || '',
            })
            console.log(`Stream user Created for ${newUser.fullName}`)
        } catch (error) {
            console.log(error)
        }

        const jwtToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })

        res.cookie('jwt', jwtToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE === "production",
        })

        res.status(201).json({ success: true, user: newUser })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Error" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Email not exists" })
        }
        const isPasswordCorrect = await user.matchPassword(password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Password" })
        }

        const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })

        res.cookie('jwt', jwtToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE === "production",
        })

        res.status(200).json({ success: true, user })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Error" })
    }
}

export const logout = (req, res) => {
    res.clearCookie('jwt')
    res.status(200).json({ success: true, message: "Logout successful" })
}

export const onboard = async (req,res) => {
    try {
        const userId = req.user._id
        const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({message:"All fields are required", missingFields : [
                !fullName && "fullName",
                !bio && "bio",
                !nativeLanguage && 'nativelanguage',
                !learningLanguage && 'learninglanguage',
                !location && 'location'
            ].filter(Boolean),
        })
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {...req.body, isOnboarded:true}, {new:true})

        if(!updatedUser){
            return res.status(400).json({message:"User not found"})
        }

        try {
            await upsertStreamUser({
            id: updatedUser._id.toString(),
            name: updatedUser.fullName,
            image: updatedUser.profilePic || ''
        })
            console.log(`Stream user Updated for ${updatedUser.fullName}`)
        } catch (streamError) {
            console.log(streamError.message)
        }

        res.status(200).json({success:true, user:updatedUser})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Error" })
    }
}