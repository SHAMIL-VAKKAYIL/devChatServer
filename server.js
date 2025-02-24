import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import dotenv from 'dotenv'

import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';

//! routers
import authRoutes from './routes/authRouter.js'
import messageRoutes from './routes/chatRouter.js'

import { app, server } from './lib/socket.js';

dotenv.config()


const mongoURL = process.env.MONGO_URL

mongoose.connect(mongoURL)
    .then(() => {
        console.log('connected');
    })
    .catch((err) => {
        console.error(err, ' failed to connect');
    })

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser())


app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)



const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB
})