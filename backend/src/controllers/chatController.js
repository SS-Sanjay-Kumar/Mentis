import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try {
        // req.user contains -> name, email, profilePic, clerkId
        const token = chatClient.createToken(req.user.clerkId);
        return res.status(200).json({
            token,
            userId: req.user.clerkId,
            userName: req.user.name,
            userProfile: req.user.profilePic,
        });
    } catch (error) {
        console.error("Error in getStreamToken: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}