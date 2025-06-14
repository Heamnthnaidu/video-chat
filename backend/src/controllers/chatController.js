import { generateStreamToken } from "../config/stream.js"


export const getStreamToken = (req,res) =>{
    try {
        const token = generateStreamToken(req.user._id)
        res.status(200).json({token})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"Internal server Error"})
    }
}