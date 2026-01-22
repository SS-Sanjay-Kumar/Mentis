import express from 'express';

import { protectRoute } from '../middleware/protectRoute.js'
import {
    createSession,
    getActiveSessions,
    getPastSessions,
    getSessionById,
    joinSession,
    endSession,
} from '../controllers/sessionController.js'

const router = express.Router();
// api/sessions
router.post("/", protectRoute, createSession);

router.get("/active", protectRoute, getActiveSessions);
router.get("/past-session", protectRoute, getPastSessions);

router.get("/:id", protectRoute, getSessionById);
router.post("/:id/join", protectRoute, joinSession);
router.post("/:id/end", protectRoute, endSession);


export default router;