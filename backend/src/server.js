import express from 'express';
import path from 'path';

import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';

const app = express();
const __dirname = path.resolve();

app.get("/health", (req, res) => {
    return res.status(200).json({
        status: "ok",
    });
})

if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("/{*any}", (req, res)=>{
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

app.listen(ENV.PORT, () => {
    console.log("Server running at port:", ENV.PORT);
    connectDB();
})