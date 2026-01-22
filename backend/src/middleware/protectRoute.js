import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
    requireAuth(),
    async (req, res, next) => {
        try {
            const clerkId = req.auth().userId;
            if (!clerkId) return res.status(401).json({ message: "Unauthorized, invalid token" });
            const user = User.findOne({ clerkId });
            if (!user) return res.status(404).json({ message: "User not found" });

            req.user = user; //sent the user by attaching it to the request
            next();

        } catch (error) {
            console.error("Error in protectRoute middleware: ", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
];

// why an array?
// express automatically decomposes/flattens protectRoute array []
//  into 2 different methods and runs them sequentially
// this is done so that we dont have to use this
// app.get("/video-calls",requireAuth(), protectRoute, (req, res) => {}
// we can do this instead
// app.get("/video-calls", protectRoute, (req, res) => {}
// tha above line handles both