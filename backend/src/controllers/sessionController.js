import Session from "../models/Session.js";
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
        const activeSessions = await Session.find({ status: "active" })
            .populate("host", "name email profilePic clerkId")
            .sort({ createdAt: -1 })
            .limit(20);
        return res.status(200).json({ activeSessions })

    } catch (error) {
        console.error("Error fetching active sessions", error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getPastSessions(req, res) {
    try {
        const userId = req.user._id;
        const pastSessions = await Session.find({
            status: "completed",
            $or: [{ host: userId }, { participant: userId }]
        })
            .sort({ createdAt: -1 })
            .limit(20);

        return res.status(200).json({ pastSessions })

    } catch (error) {
        console.error("Error fetching past sessions", error)
        return res.status(500).json({ message: "Internal Server Error" });

    }
}

export async function getSessionById(req, res) {
    try {
        const { id } = req.params;
        const session = await Session.findById(id)
            .populate("host", "name email profilePic clerkId")
            .populate("participant", "name email profilePic clerkId");

        if (!session) return res.status(404).json({ message: "Session not found" });
        return res.status(200).json({ session });

    } catch (error) {
        console.error("Error fetching session by Id", error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function joinSession(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        const session = await Session.findById(id);

        if (!session) return res.status(404).json({ message: "Session not found" });
        if (session.status !== "active") return res.status(400).json({ message: "Cannot join a completed session" });
        if (session.host.toString() === userId.toString()) return res.status(400).json({ message: "Host cannot join as participant" });
        if (session.participant) return res.status(409).json({ message: "Session is full" });

        session.participant = userId;
        await session.save();

        const channel = chatClient.channel("messaging", session.callId);
        await channel.addMembers([clerkId]);

        return res.status(200).json({ session, message: "Joined the session successfully" });

    } catch (error) {
        console.error("Error joining session: ", error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function endSession(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const session = await Session.findById(id);
        if (!session) return res.status(404).json({ message: "Session not found" });

        if (session.host.toString() !== userId.toString()) return res.status(403).json({ message: "Unauthorized, only host can end the session" });
        if (session.status === "completed") return res.status(400).json({ message: "Session already ended" });

        const videoCall = streamClient.video.call("default", session.callId);
        await videoCall.delete({ hard: true });

        const chatChannel = chatClient.channel("messaging", session.callId);
        await chatChannel.delete();

        session.status = "completed";
        await session.save();

        return res.status(200).json({ session, message: "Session ended" });

    } catch (error) {
        console.error("Error ending session: ", error)
        return res.status(500).json({ message: "Internal Server Error" });

    }
}