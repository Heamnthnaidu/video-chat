import {StreamChat} from 'stream-chat'
import 'dotenv/config'

const apiKey = process.env.STEAM_API_KEy
const apiSecret = process.env.STEAM_API_SECRET

if(!apiKey || !apiSecret){
    console.error("Stream key or secret is undefined")
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret)

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUser(userData)
        return userData
    } catch (error) {
        console.log(error);
    }
}

export const generateStreamToken = (userId) =>{
    try {
        // ensure user id is a string
        const userIdStr = userId.toString()
        return streamClient.createToken(userIdStr)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"Internal server Error"})
    }
}
