import express from 'express';

import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';

const app = express();

app.get("/health", (req, res) => {
    return res.status(200).json({
        status: "ok",
    });
})

app.listen(ENV.PORT, () => {
    console.log("Server running at port:", ENV.PORT);
    connectDB();
})