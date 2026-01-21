import dotenv from 'dotenv/config.js';

export const ENV ={
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV,
};