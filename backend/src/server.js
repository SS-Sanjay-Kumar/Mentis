import express from 'express';
import dotenv from 'dotenv/config.js';

import { connectDB } from './lib/db.js';

const PORT = process.env.PORT;
const app = express();

app.get("/health", (req, res) => {
    return res.status(200).json({
        status: "ok",
    });
})

app.listen(PORT, () => {
    console.log("Server running at port ", PORT);
    connectDB();
})