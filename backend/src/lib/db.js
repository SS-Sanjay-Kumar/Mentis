import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
    try {
        const dbResponse = await mongoose.connect(ENV.MONGODB_URI);
        if (!dbResponse) {
            console.error("Error connecting to MONGODB");
            return;
        }
        console.log("Mongo DB Connected successfully ", dbResponse.connection.host);
    } catch (error) {
        console.error("Error connecting to MONGODB", error);
        process.exit(1); 
    }
};