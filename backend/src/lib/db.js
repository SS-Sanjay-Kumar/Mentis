import mongoose from 'mongoose';
import dotenv from 'dotenv/config.js';

export const connectDB = async()=>{
    try {
        const dbResponse = await mongoose.connect(process.env.MONGODB_URI);
        if(!dbResponse){
            console.error("Error connecting to MONGODB");
            return;
        }
        console.log("Mongo DB Connected successfully!");
    } catch (error) {
        console.error("Error connecting to MONGODB", error);
    }
};