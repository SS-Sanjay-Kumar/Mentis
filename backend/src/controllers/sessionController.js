import { Session } from "@clerk/express";
import { chatClient, streamClient } from "../lib/stream.js";

export async function createSession(req, res) {
    try {
        const { problem, difficulty } = req.body;
        if (!problem || !difficulty) return res.status(400).json({ message: "All fields are mandatory" });

        const userId = req.user._id;
        const clerkId = req.user.clerkId;
        //unique call id for stream video
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        const session = await Session.create({
            problem,
            difficulty,
            host: userId,
            callId
        });
        // video call
        await streamClient.video.call("default", callId).getOrCreate({
            data: {
                created_by_id: clerkId,
                custom: { problem, difficulty, sessionId: session._id.toString() }
            }
        });
        // chat 
        const channel = chatClient.channel("messaging", callId, {
            name: `${problem} Session`,
            created_by_id: clerkId,
            members: [clerkId],
        })
        await channel.create();
        res.status(201).json({ session });

    } catch (error) {
        console.error("Error creating sessions", error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getActiveSessions(req, res) {
    try {

    } catch (error) {

    }
}

export async function getPastSessions(req, res) {
    try {

    } catch (error) {

    }
}

export async function getSessionById(req, res) {
    try {

    } catch (error) {

    }
}

export async function joinSession(req, res) {
    try {

    } catch (error) {

    }
}

export async function endSession(req, res) {
    try {

    } catch (error) {

    }
}