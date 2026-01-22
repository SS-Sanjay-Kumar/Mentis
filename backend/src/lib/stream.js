import { StreamChat } from 'stream-chat';
import { ENV } from './env.js'

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) console.error("STREAM ENV VARS MISSING!");

export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await chatClient.upsertUser(userData);
        console.log("Success: User upserted to STREAM");
        return userData;
    } catch (error) {
        console.error("Error upserting user to STREAM:", error);
    }
}

export const deleteStreamUser = async (userId) => {
    try {
        await chatClient.deleteUser(userId);
        console.log("Success: User deleted from STREAM");
        return userId;
    } catch (error) {
        console.error("Error deleting user from STREAM:", error);
    }
}

// todo: method to generate token